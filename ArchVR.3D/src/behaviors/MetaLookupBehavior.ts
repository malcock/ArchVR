import { Node } from "@babylonjs/core/node";
import { Behavior } from "@babylonjs/core/Behaviors/behavior";
// import {
//   // PointerEventTypes,
//   PointerInfo,
// } from "@babylonjs/core/Events/pointerEvents";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
// import { Observer } from "@babylonjs/core/Misc/observable";
// import { Scene } from "@babylonjs/core/scene";
// import { Nullable } from "@babylonjs/core/types";
// import { SelectionManager } from "../managers/SelectionManager";
import { IfcMeta } from "../types/IfcMeta";

export class MetaLookupBehavior implements Behavior<TransformNode> {
  // private _scene!: Scene;
  // private _pointerObserver!: Nullable<Observer<PointerInfo>>;

  constructor(public headerNode: Node) {}
  get name(): string {
    return "MetaLookupBehavior";
  }
  init(): void {
    console.log("meta init!");
    // console.trace();
    // throw new Error("Method not implemented.");
  }
  //@ts-ignore
  attach(target: TransformNode): void {
    // this._scene = target.getScene();
    // // //only add click handler if this is header node to reduce number of listeners on observable
    // // if (target === this.headerNode) {
    // const pickPredicate = (m: TransformNode) => {
    //   return m === target;
    //   // return this.headerNode == m || m.isDescendantOf(this.headerNode);
    // };
    // this._pointerObserver = this._scene.onPointerObservable.add(
    //   (pointerInfo) => {
    //     if (pointerInfo.type === PointerEventTypes.POINTERUP) {
    //       if (
    //         pointerInfo.pickInfo &&
    //         pointerInfo.pickInfo.hit &&
    //         pointerInfo.pickInfo.pickedMesh &&
    //         pickPredicate(pointerInfo.pickInfo.pickedMesh)
    //       ) {
    //         const meta = this.getMeta(pointerInfo.pickInfo.pickedMesh);
    //         SelectionHandler.toggleObjectSelection(
    //           pointerInfo.pickInfo.pickedMesh,
    //           pointerInfo.event.shiftKey
    //         );
    //         console.log(meta);
    //       }
    //     }
    //   }
    // );
    // }
  }

  /**
   * Returns populated meta data for this node
   * @param targetNode
   * @returns
   */
  getMeta(targetNode: TransformNode) {
    // helper
    const getProperty = (propGroup: string, id: string) => {
      const headerMeta = this.headerNode.metadata.gltf.extras.properties;
      return headerMeta[propGroup][id] || null;
    };

    // TODO: Way to search up to parent to find meta
    //get our prop sets from the target node
    try {
      const meta = targetNode.metadata.gltf.extras;
      // console.log(meta);
      // console.log(this.attachedNode.metadata);
      let obj: Partial<IfcMeta> = {};
      Object.keys(meta).forEach((key) => {
        if (Array.isArray(meta[key])) {
          obj[key] = meta[key].map((x: any) => ({
            ...getProperty(key, x),
            id: x,
          }));
        } else {
          obj[key] = meta[key];
        }
      });
      if (targetNode === this.headerNode) {
        obj.id = this.headerNode.id;
        obj.Name = this.headerNode.name;
      }
      //somehow emit meta to the editor...
      return obj;
    } catch (err) {
      // console.log(targetNode, err);
      return null;
    }
  }

  detach(): void {
    console.log("detached!");
    // throw new Error("Method not implemented.");
    // if (this._pointerObserver) {
    //   this._scene.onPointerObservable.remove(this._pointerObserver);
    // }
  }
}
