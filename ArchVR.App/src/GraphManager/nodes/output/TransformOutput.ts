import { ClassicPreset } from "rete";
import type { DataflowNode } from "rete-engine";
import sockets from "../../sockets";
import { type GraphContext } from "../..";
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
  transformId: string;
  updateTransform: (
    transformId: string,
    transform: {
      position?: number[] | undefined;
      rotation?: number[] | undefined;
      scaling?: number[] | undefined;
    }
  ) => void;

  constructor(public di: GraphContext, data: Data) {
    super("Transform Output");
    console.log("transform node created", data);
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
    // show the live value on this node in the graph editor
    if (value && value[0] !== undefined) {
      this.di.showReadout?.(this.id, value[0]);
    }

    return { value };
  }

  serialize(): Data {
    return {
      transformId: this.transformId,
    };
  }
}
