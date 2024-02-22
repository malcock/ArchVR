import { Texture } from "@babylonjs/core";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Color3 } from "@babylonjs/core/Maths/math";
import { Scene } from "@babylonjs/core/scene";

class UiMaterial {
  material: StandardMaterial;
  constructor(public name: string, public color: Color3, scene: Scene) {
    this.material = new StandardMaterial(name, scene);
    this.material.emissiveColor = this.material.diffuseColor = color;
  }
}

export class UiMaterials {
  private static _progressBg: UiMaterial;
  private static _progressFg: UiMaterial;
  private static _deviceIcon: UiMaterial;
  // private static _selectBase:UiMaterial;
  // private static _selectHover:UiMaterial;
  // private static _selectActive:UiMaterial;

  static initialise(scene: Scene) {
    this._progressBg = new UiMaterial(
      "progressBg",
      new Color3(0.2, 0.2, 0.2),
      scene
    );
    this._progressFg = new UiMaterial(
      "progressFg",
      new Color3(1, 0.2, 0.2),
      scene
    );
    this._deviceIcon = new UiMaterial("deviceIcon", new Color3(1, 1, 1), scene);
    this._deviceIcon.material.diffuseTexture = new Texture(
      "/editor/device-icon.png",
      scene,
      { invertY: false }
    );

    this._deviceIcon.material.disableLighting = true;
    this._deviceIcon.material.opacityTexture = new Texture(
      "/editor/icon-alpha.png",
      scene
    );

    // progressFg: new Color4(1,0.2,0.2),
    // selectBase: new Color4(1,0.596,0,0.4),
    // selectHover: new Color4(1,1,0),
    // selectActive: new Color4(0,1,0)
  }
  static get progressBg() {
    return this._progressBg.material;
  }
  static get progressFg() {
    return this._progressFg.material;
  }

  static get deviceIcon() {
    return this._deviceIcon.material;
  }
}
