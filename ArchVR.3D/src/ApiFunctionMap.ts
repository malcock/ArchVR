import { Scene } from "@babylonjs/core";
import { IotDeviceManager } from "./managers/IotDeviceManager";

const ApiFunctionMap = {
  "device.create": (options: { scene: Scene; id: string; transform: string }) =>
    IotDeviceManager.createDevice(options.scene, options.id, options.transform),
  "device.poo": (options: { foo: string }) => console.log(options.foo),
};

export default ApiFunctionMap;
