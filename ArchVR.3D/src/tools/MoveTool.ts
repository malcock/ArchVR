import { AbstractTool } from "./AbstractTool";
import {
  PointerEventTypes,
  PointerInfo,
} from "@babylonjs/core/Events/pointerEvents";
import { EventState } from "@babylonjs/core/Misc/observable";
import { SelectionManager } from "../managers/SelectionManager";

import { Scene } from "@babylonjs/core/scene";

export class MoveTool extends AbstractTool {
  constructor(scene: Scene) {
    super("Move", "open_with", "w", scene);
  }
  OnActivated(): void {}
  OnDeactivated(): void {}

  //@ts-ignore
  OnPointerObservable(pointerInfo: PointerInfo, eventState: EventState): void {
    if (pointerInfo.type === PointerEventTypes.POINTERTAP) {
      //
      if (
        pointerInfo.pickInfo &&
        pointerInfo.pickInfo.hit &&
        pointerInfo.pickInfo.pickedMesh
      ) {
        SelectionManager.toggleObjectSelection(
          pointerInfo.pickInfo.pickedMesh,
          pointerInfo.event.shiftKey
        );
      }
    }
  }
  //@ts-ignore
  OnKeyUp(evt: KeyboardEvent): void {
    // throw new Error("Method not implemented.");
  }
}
