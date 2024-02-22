import { MeshBuilder, Mesh, TransformNode } from "@babylonjs/core/Meshes";

import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { DeserializeTransform } from "../util/Serialization";
import { Scene } from "@babylonjs/core";
import { UiMaterials } from "../ui/UiMaterial";
import { SelectionManager } from "./SelectionManager";

export class IotDevice extends Mesh {
  constructor(_id: string, _position: Vector3, root: TransformNode) {
    const m = MeshBuilder.CreatePlane("DeviceIcon", {
      size: 0.5,
    });

    m.billboardMode = 7;
    m.renderingGroupId = 3;
    m.material = UiMaterials.deviceIcon;

    super(`Device:${_id}`, root.getScene(), null, m);
    this.id = _id;
    m.dispose();

    this.parent = root;
    this.position = _position
      .subtract(root.absolutePosition)
      .multiply(root.absoluteScaling);
  }
}

export class IotDeviceManager {
  private static _devices: Array<IotDevice> = [];
  private static _currentDevice: IotDevice | null = null;

  public static get devices() {
    return this._devices;
  }
  public static set devices(value) {
    this._devices = value;
  }

  public static get currentDevice() {
    return this._currentDevice;
  }

  public static set currentDevice(value) {
    this._currentDevice = value;
  }

  /**
   * Creates a 3d representation of a device at the given location
   * @param scene the babylonjs scene
   * @param id the guid of the device
   * @param transform serialized transform as string
   */
  public static createDevice(scene: Scene, id: string, transform: string) {
    const { parent, position } = DeserializeTransform(transform);
    const root = scene.getNodeById(parent as string) as TransformNode;
    console.log("createDevice!", scene, position, id);
    const newDevice = new IotDevice(id, position, root);
    console.log(newDevice);
    this._devices.push(newDevice);
    SelectionManager.setObjectSelection(newDevice);
  }

  public static isDevice(device: any) {
    if (!(device instanceof IotDevice)) return false;
    return this.devices.indexOf(device) > -1;
  }

  public static addDevice(newDevice: IotDevice) {
    this._devices.push(newDevice);
  }

  public static removeDevice(device: IotDevice) {
    device.dispose();
    let index = this.devices.indexOf(device);
    this.devices = this.devices.splice(index, 1);
  }
}
