import { ClassicPreset } from "rete";
import type { DataflowNode } from "rete-engine";
import sockets from "../../sockets";
import { type DiContainer } from "../..";
import { Vector } from "../../types/Vector";

type Data = {
  transformId: string;
};
export class TransformOutput
  extends ClassicPreset.Node
  implements DataflowNode
{
  width = 180;
  height = 205;

  static ID = "Transform Output";
  update: (control: ClassicPreset.InputControl<"number", number>) => void;
  transformId: string;
  updateTransform: (
    transformId: string,
    transform: {
      position?: number[] | undefined;
      rotation?: number[] | undefined;
      scaling?: number[] | undefined;
    }
  ) => void;

  constructor(di: DiContainer, data: Data) {
    super("Transform Output");
    console.log("transform node created", data);
    this.update = di.updateControl;
    this.updateTransform = di.updateTransform;
    const position = new ClassicPreset.Input(sockets.VectorOnly, "Position");
    const rotation = new ClassicPreset.Input(sockets.VectorOnly, "Rotation");
    const scaling = new ClassicPreset.Input(sockets.VectorOnly, "Scaling");
    this.transformId = data.transformId;
    this.addControl(
      "value",
      new ClassicPreset.InputControl("text", {
        readonly: true,
      })
    );

    this.addInput("position", position);
    this.addInput("rotation", rotation);
    this.addInput("scaling", scaling);
  }

  data(inputs: any) {
    // console.log(inputs);
    const value = inputs.position;
    // console.log(inputs);
    const position =
      inputs["position"] && inputs["position"][0] instanceof Vector
        ? inputs["position"][0].toArray()
        : null;
    const rotation =
      inputs["rotation"] && inputs["rotation"][0] instanceof Vector
        ? inputs["rotation"][0].toArray()
        : null;
    const scaling =
      inputs["scaling"] && inputs["scaling"][0] instanceof Vector
        ? inputs["scaling"][0].toArray()
        : null;

    if (this.updateTransform)
      this.updateTransform(this.transformId, {
        ...(position && { position }),
        ...(rotation && { rotation }),
        ...(scaling && { scaling }),
      });
    // to be removed...?
    if (value && value[0]) {
      var val = JSON.stringify(value[0]);
      // console.log(this.controls);
      (this.controls?.value as ClassicPreset.InputControl<"text">).setValue(
        val
      );
    }
    if (this.update) this.update(this.controls.value);

    return { value };
  }

  serialize(): Data {
    return {
      transformId: this.transformId,
    };
  }
}
