import { Scene } from "@babylonjs/core";
import { IotDeviceManager } from "./managers/IotDeviceManager";
import { ModelManager } from "./managers/ModelManager";

const ApiFunctionMap = {
  "model.add": async (options: {
    scene: Scene;
    name: string;
    filepath: string;
    transform: string;
  }) => {
    const { filepath, name, scene, transform } = options;
    return ModelManager.loadModel(scene, name, filepath, transform);
  },
  "device.create": async (options: {
    scene: Scene;
    id: string;
    transform: string;
  }) =>
    IotDeviceManager.createDevice(options.scene, options.id, options.transform),
};

export default ApiFunctionMap;
