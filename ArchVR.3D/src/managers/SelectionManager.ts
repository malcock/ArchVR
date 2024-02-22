import { BoundingBoxGizmo } from "@babylonjs/core/Gizmos/boundingBoxGizmo";
import { Color3, Vector3 } from "@babylonjs/core/Maths";
import { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { Observable } from "@babylonjs/core/Misc/observable";
import { UtilityLayerRenderer } from "@babylonjs/core/Rendering";
import { MetaLookupBehavior } from "../behaviors/MetaLookupBehavior";
import { IfcMeta } from "../types/IfcMeta";
import { IotDeviceManager } from "./IotDeviceManager";

export enum SelectionMode {
  Files,
  Objects,
  Faces,
  Triangles,
  Verticies,
}

export interface EditorSelection {
  mode: SelectionMode;
  objects: Array<SelectedObject>;
}

export interface SelectedObject {
  id: string;
  type: "object" | "device" | "light" | "camera";
  name: string;
  position: Vector3;
  rotation: Vector3;
  scaling: Vector3;
  ifcMeta?: IfcMeta;
}

export class SelectionManager {
  private static _objects: Array<TransformNode> = [];

  private static _boundingGizmos: Array<BoundingBoxGizmo> = [];

  private static _selectionColor: Color3 = Color3.FromHexString("#FFFF00");

  static get objects() {
    return this._objects;
  }
  static set objects(value) {
    this._objects = value;
    //remove all exant bounding boxes
    for (var i = 0; i < this._boundingGizmos.length; i++) {
      this._boundingGizmos[i].attachedMesh = null;
      this._boundingGizmos[i].dispose();
      delete this._boundingGizmos[i];
    }
    // let metas: Array<Partial<IfcMeta>> = [];
    this._boundingGizmos = [];
    // console.log(this.objects);
    let objs: Array<SelectedObject> = [];
    for (var i = 0; i < this._objects.length; i++) {
      const thisObj = this._objects[i];
      var newGizmo = new BoundingBoxGizmo(
        this._selectionColor,
        UtilityLayerRenderer.DefaultUtilityLayer
      );
      // console.log(newGizmo);
      if (thisObj instanceof AbstractMesh) {
        newGizmo.ignoreChildren = true;
      } else {
        newGizmo.ignoreChildren = false;
      }
      // newGizmo.updateGizmoPositionToMatchAttachedMesh = false

      newGizmo.setEnabledRotationAxis("");

      newGizmo.setEnabledScaling(false);
      // var rot = this._objects[i].rotation.clone();
      newGizmo.attachedMesh = this._objects[i] as AbstractMesh;
      // this._objects[i].rotation = rot;
      this._boundingGizmos.push(newGizmo);

      // add obj to returned selection
      let newObj: SelectedObject = {
        id: thisObj.id,
        name: thisObj.name,
        position: thisObj.position,
        rotation: thisObj.rotation,
        scaling: thisObj.scaling,
        type: "object",
      };

      var b = this._objects[i].getBehaviorByName("MetaLookupBehavior");

      var objMeta = b
        ? (b as MetaLookupBehavior).getMeta(this._objects[i])
        : null;
      if (objMeta) {
        newObj.ifcMeta = objMeta as IfcMeta;
        // metas.push(objMeta);
      } else {
        // it's not a meta obj - so what is it?]
        if (IotDeviceManager.isDevice(thisObj)) {
          newObj.type = "device";
        }
        // metas.push({
        //   id: this.objects[i].id,
        // });
      }
      objs.push(newObj);
    }

    this.onSelectionChange.notifyObservers({
      mode: this._mode,
      objects: objs,
    });
  }
  private static _mode: SelectionMode = SelectionMode.Faces;

  public static onSelectionChange = new Observable<EditorSelection>();

  constructor() {}

  static isObjectSelected(obj: TransformNode) {
    return this.objects.indexOf(obj) > -1;
  }

  static setObjectSelection(obj: TransformNode) {
    this.objects = [obj];
  }

  static toggleObjectSelection(obj: TransformNode, shiftKey: boolean) {
    const index = this.objects.indexOf(obj);
    if (index > -1) {
      this.objects = this.objects.splice(index, 1);
    } else {
      if (shiftKey) {
        this.objects = [...this.objects, obj];
      } else {
        this.objects = [obj];
      }
    }
  }

  static addObjectToSelection(obj: TransformNode) {
    this.objects = [...this.objects, obj];
  }

  static removeObjectFromSelection(obj: TransformNode) {
    const index = this.objects.indexOf(obj);
    if (index > -1) {
      this.objects = this.objects.splice(index, 1);
    }
  }

  static selectNone() {
    this.objects = [];
  }
}
