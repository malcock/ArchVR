import { ClassicPreset } from "rete";
import type { DataflowNode } from "rete-engine";
import type { GraphContext } from "~/GraphManager";
import sockets from "~/GraphManager/sockets";
import { Vector } from "~/GraphManager/types/Vector";

type Data = {
  x?: number;
  y?: number;
  z?: number;
  w?: number;
};

export class VectorCombiner extends ClassicPreset.Node implements DataflowNode {
  static ID = "Vector Combiner";

  width = 200;
  height = 200;
  x: number;
  y: number;
  z: number;
  w: number;

  constructor(public ctx: GraphContext, data: Data) {
    super("Vector Combiner");
    this.x = data.x || 0;
    this.y = data.y || 0;
    this.z = data.z || 0;
    this.w = data.w || 0;
    const xInput = new ClassicPreset.Input(sockets.Number, "x");
    xInput.addControl(
      new ClassicPreset.InputControl("number", {
        initial: data.x,
        change: ctx.process,
      })
    );

    const yInput = new ClassicPreset.Input(sockets.Number, "y");
    yInput.addControl(
      new ClassicPreset.InputControl("number", {
        initial: data.y,
        change: ctx.process,
      })
    );

    const zInput = new ClassicPreset.Input(sockets.Number, "z");
    zInput.addControl(
      new ClassicPreset.InputControl("number", {
        initial: data.z,
        change: ctx.process,
      })
    );

    const wInput = new ClassicPreset.Input(sockets.Number, "w");
    wInput.addControl(
      new ClassicPreset.InputControl("number", {
        initial: data.w,
        change: ctx.process,
      })
    );

    this.addInput("x", xInput);
    this.addInput("y", yInput);
    this.addInput("z", zInput);
    this.addInput("w", wInput);

    this.addOutput(
      "output",
      new ClassicPreset.Output(sockets.Vector4, "Output")
    );
  }
  data(inputs: any) {
    const getInputOrCtrlValue = (key: string) => {
      const ctrl = (
        this.inputs[key]?.control as ClassicPreset.InputControl<"number">
      ).value;
      return inputs[key] && typeof inputs[key][0] === "number"
        ? inputs[key][0]
        : ctrl;
    };

    const x = getInputOrCtrlValue("x");
    const y = getInputOrCtrlValue("y");
    const z = getInputOrCtrlValue("z");
    const w = getInputOrCtrlValue("w");
    return {
      output: new Vector(x, y, z, w),
    };
  }

  serialize(): Data {
    return {
      w: (this.inputs["w"]?.control as ClassicPreset.InputControl<"number">)
        .value as number,
      x: (this.inputs["x"]?.control as ClassicPreset.InputControl<"number">)
        .value as number,
      y: (this.inputs["y"]?.control as ClassicPreset.InputControl<"number">)
        .value as number,
      z: (this.inputs["z"]?.control as ClassicPreset.InputControl<"number">)
        .value as number,
    };
  }
}
