import { AbstractTool } from "./AbstractTool";
import { IotDevice, IotDeviceManager } from "../managers/IotDeviceManager";
import { EventState, Observable } from "@babylonjs/core/Misc/observable";
import {
  PointerEventTypes,
  PointerInfo,
} from "@babylonjs/core/Events/pointerEvents";
import { Vector3 } from "@babylonjs/core/Maths";
import { Scene } from "@babylonjs/core/scene";
// import { EditorApp } from "../Editor";
import { SerializeTransform } from "../util/Serialization";

export interface DeviceTransform {
  id?: string;
  transform: string;
}
export class DeviceTool extends AbstractTool {
  constructor(
    private _deviceUpdatedObservable: Observable<DeviceTransform>,
    scene: Scene
  ) {
    super("Devices", "home_iot_device", "d", scene);
  }
  OnActivated(): void {}
  OnDeactivated(): void {}
  //@ts-ignore
  OnPointerObservable(pointerInfo: PointerInfo, eventState: EventState): void {
    if (pointerInfo.type === PointerEventTypes.POINTERTAP) {
      if (
        pointerInfo.pickInfo &&
        pointerInfo.pickInfo.hit &&
        pointerInfo.pickInfo.pickedMesh
      ) {
        //check whether the thing clicked on is an existing IOT device
        if (IotDeviceManager.isDevice(pointerInfo.pickInfo.pickedMesh)) {
          const device = pointerInfo.pickInfo.pickedMesh as IotDevice;
          const json = JSON.stringify(SerializeTransform(device));
          this._deviceUpdatedObservable.notifyObservers({
            id: device.id,
            transform: json,
          });
          IotDeviceManager.currentDevice = device;
        } else {
          console.log(pointerInfo.pickInfo);
          // Create a new one then!
          const json = JSON.stringify(
            SerializeTransform({
              position: pointerInfo.pickInfo.pickedPoint as Vector3,
              scaling: Vector3.One(),
              rotation: Vector3.Zero(),
              parent: pointerInfo.pickInfo.pickedMesh,
            })
          );
          this._deviceUpdatedObservable.notifyObservers({
            transform: json,
          });
        }
      }
    }
  }
  //@ts-ignore
  OnKeyUp(evt: KeyboardEvent): void {}
}
