import { PointerInfo } from "@babylonjs/core/Events/pointerEvents";
import { EventState, Observer } from "@babylonjs/core/Misc/observable";
import { Scene } from "@babylonjs/core/scene";
import { Nullable } from "@babylonjs/core/types";

export abstract class AbstractTool {
  private _active = false;
  private _pointerObserver!: Nullable<Observer<PointerInfo>>;
  constructor(
    public name: string,
    public icon: string,
    public hotKey: string,
    public scene: Scene
  ) {
    this._active = false;
  }

  get active() {
    return this._active;
  }

  set active(value) {
    this._active = value;

    if (this._active) {
      //bind the pointer events

      this._pointerObserver = this.scene.onPointerObservable.add(
        this.OnPointerObservable.bind(this)
      );
      //bind the keyboard events
      window.onkeyup = (evt) => {
        this.OnKeyUp(evt);
      };
      //run the hook
      this.OnActivated();
    } else {
      this.scene.onPointerObservable.remove(this._pointerObserver);
      this.OnDeactivated();
    }
  }

  /**
   * Run when a tool is turned on
   */
  abstract OnActivated(): void;

  /**
   * Run when a tool is turned off
   */
  abstract OnDeactivated(): void;

  abstract OnPointerObservable(
    pointerInfo: PointerInfo,
    eventState: EventState
  ): void;

  /**
   *
   * @param evt
   * @param state
   */
  abstract OnKeyUp(evt: KeyboardEvent): void;
}
