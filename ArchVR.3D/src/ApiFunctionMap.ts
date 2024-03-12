import { Scene } from "@babylonjs/core";
import { IotDeviceManager } from "./managers/IotDeviceManager";
import { ModelManager } from "./managers/ModelManager";

const ApiFunctionMap = {
  "model.add": (options: {
    scene: Scene;
    name: string;
    filepath: string;
    transform: string;
  }) => {
    const { filepath, name, scene, transform } = options;
    ModelManager.loadModel(scene, name, filepath, transform);
  },
  "device.create": (options: { scene: Scene; id: string; transform: string }) =>
    IotDeviceManager.createDevice(options.scene, options.id, options.transform),
};

export default ApiFunctionMap;
