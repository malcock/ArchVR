import { Scene, TransformNode } from "@babylonjs/core";
import { DeserializeTransform } from "../util/Serialization";
import { EditorApp } from "../Editor";
import { ModelLoader } from "../loaders/ModelLoader";
import { SelectionManager } from "./SelectionManager";

export class ModelManager {
  // private static _objects: Array<string> = [];

  public static loadModel(
    scene: Scene,
    name: string,
    filepath: string,
    transform: string
  ): Promise<boolean> {
    return new Promise((resolve) => {
      const { position, parent } = DeserializeTransform(transform);
      let root: TransformNode;
      if (parent) {
        root = scene.getNodeById(parent as string) as TransformNode;
      } else {
        root = EditorApp.root;
      }

      const model = new ModelLoader(name, filepath, scene, root, (models) => {
        for (var m of models) {
          m.position = position;
        }
        console.log("models loaded", models);
        setTimeout(() => {
          SelectionManager.selectNone();
        }, 5);

        resolve(true);
      });
      model.loadModel();
    });
  }
}
