import { ClassicPreset } from "rete";
import type { DataflowNode } from "rete-engine";
import type { GraphContext } from "~/GraphManager";
import sockets from "~/GraphManager/sockets";

type Data = {
  scale?: number;
  offset?: number;
};

export class ScaleOffset extends ClassicPreset.Node implements DataflowNode {
  static ID = "Scale Offset";

  width = 200;
  height = 250;

  constructor(public ctx: GraphContext, data: Data) {
    super("Scale Offset");

    this.addInput("value", new ClassicPreset.Input(sockets.Number, "Value"));

    const scaleInput = new ClassicPreset.Input(sockets.Number, "Scale");
    scaleInput.addControl(
      new ClassicPreset.InputControl("number", {
        initial: data.scale ?? 1,
        change: ctx.process,
      })
    );

    const offsetInput = new ClassicPreset.Input(sockets.Number, "Offset");
    offsetInput.addControl(
      new ClassicPreset.InputControl("number", {
        initial: data.offset ?? 0,
        change: ctx.process,
      })
    );

    this.addInput("scale", scaleInput);
    this.addInput("offset", offsetInput);

    this.addOutput(
      "output",
      new ClassicPreset.Output(sockets.Number, "Output")
    );
  }

  private controlValue(key: string) {
    return (this.inputs[key]?.control as ClassicPreset.InputControl<"number">)
      .value as number;
  }

  data(inputs: any) {
    const getInputOrCtrlValue = (key: string) =>
      inputs[key] && typeof inputs[key][0] === "number"
        ? inputs[key][0]
        : this.controlValue(key);

    const value =
      inputs["value"] && typeof inputs["value"][0] === "number"
        ? inputs["value"][0]
        : 0;

    return {
      output:
        value * getInputOrCtrlValue("scale") + getInputOrCtrlValue("offset"),
    };
  }

  serialize(): Data {
    return {
      scale: this.controlValue("scale"),
      offset: this.controlValue("offset"),
    };
  }
}
