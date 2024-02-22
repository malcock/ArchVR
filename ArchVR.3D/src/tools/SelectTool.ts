import { AbstractTool } from "./AbstractTool";
import {
  PointerEventTypes,
  PointerInfo,
} from "@babylonjs/core/Events/pointerEvents";
import { EventState } from "@babylonjs/core/Misc/observable";
import { SelectionManager } from "../managers/SelectionManager";

import { Scene } from "@babylonjs/core/scene";

export class SelectTool extends AbstractTool {
  constructor(scene: Scene) {
    super("Select", "arrow_selector_tool", "q", scene);
  }
  OnActivated(): void {}
  OnDeactivated(): void {}
  //@ts-ignore
  OnPointerObservable(pointerInfo: PointerInfo, eventState: EventState): void {
    // console.log(pointerInfo, eventState);
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
      if (!pointerInfo.pickInfo?.hit) {
        SelectionManager.selectNone();
      }
    }
  }
  //@ts-ignore
  OnKeyUp(evt: KeyboardEvent): void {
    // throw new Error("Method not implemented.");
  }
}
