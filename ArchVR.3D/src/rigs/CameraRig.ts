import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";

import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Scene } from "@babylonjs/core/scene";

export default class CameraRig {
  camera: ArcRotateCamera;

  constructor(scene: Scene, canvas: HTMLCanvasElement) {
    this.camera = new ArcRotateCamera(
      "Camera",
      10,
      1,
      20,
      Vector3.Zero(),
      scene
    );
    this.camera.setTarget(Vector3.Zero());
    this.camera.lowerRadiusLimit = 2;

    this.camera.attachControl(canvas, false, true);
  }
}
