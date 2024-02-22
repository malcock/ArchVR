import "@babylonjs/core/Meshes/Builders/planeBuilder";
import "@babylonjs/loaders";

import {
  ISceneLoaderProgressEvent,
  SceneLoader,
} from "@babylonjs/core/Loading/sceneLoader";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { MetaLookupBehavior } from "../behaviors/MetaLookupBehavior";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { UiMaterials } from "../ui/UiMaterial";
import { Vector3 } from "@babylonjs/core/Maths/math";
import { Scene } from "@babylonjs/core/scene";

export class ModelLoader extends TransformNode {
  progressBg: Mesh;
  progressFg: Mesh;
  constructor(
    name: string,
    public path: string,
    scene: Scene,
    newParent: TransformNode,
    callback: (models: TransformNode[]) => void
  ) {
    super(name, scene);

    this.progressBg = MeshBuilder.CreatePlane("ProgressBg", {
      size: 1,
    });
    this.progressFg = MeshBuilder.CreatePlane("ProgressFg", {
      size: 1,
    });
    this.progressBg.material = UiMaterials.progressBg;
    this.progressFg.material = UiMaterials.progressFg;
    console.log(this.progressBg.material, this.progressFg.material);
    //@ts-ignore
    this.progressFg.newParent = this.progressBg;
    //@ts-ignore
    this.progressBg.newParent = this;
    this.progressBg.billboardMode = 7;

    this.progressBg.scaling = new Vector3(1, 0.2, 1);
    this.progressFg.scaling = new Vector3(0, 1, 1);

    SceneLoader.LoadAssetContainer(
      this.path,
      "",
      this.getScene(),
      (asset) => {
        // On Successs...

        this.progressBg.dispose();
        this.progressFg.dispose();

        // add all to scene
        asset.addAllToScene();

        // asset.rootNodes is apparently unreliable
        // create a list of all mesh/transform nodes and find any that are
        const rootNodes = [...asset.meshes, ...asset.transformNodes].filter(
          (x) => !x.parent
        );

        // for each one, find if it has a child that has header meta
        // the header meta is the one that will have all the properties etc on it
        rootNodes.forEach((node) => {
          const headerNodes = node.getChildren(
            (x) =>
              x.metadata &&
              x.metadata.gltf &&
              x.metadata.gltf.extras &&
              x.metadata.gltf.extras.header,
            false
          );

          // should only be one, but just in case
          headerNodes.forEach((hNode) => {
            //create the lookup behavior, and then add to all it's children
            const metaLookupBehavior = new MetaLookupBehavior(hNode);
            hNode.addBehavior(metaLookupBehavior);

            hNode
              .getChildren(undefined, false)
              .forEach((x) => x.addBehavior(metaLookupBehavior));
          });
          node.setParent(newParent);
        });

        this.dispose();
        callback(rootNodes);
      },
      (progressEvent) => {
        console.log(progressEvent);
        if (progressEvent.lengthComputable) {
          var complete = progressEvent.loaded / progressEvent.total;
          console.log({ complete });
          this.progressFg.scaling.x = complete;
        }
      },
      (scene: Scene, message: string, exception?: any) => {
        console.log({ scene, message, exception, stack: exception.stack });
        console.trace(message);
      }
    );
  }

  loadModel() {}

  OnProgress(progressEvent: ISceneLoaderProgressEvent) {
    if (progressEvent.lengthComputable) {
      var complete = progressEvent.loaded / progressEvent.total;
      console.log(complete);
      this.progressFg.scaling.x = complete;
    }
  }
}
