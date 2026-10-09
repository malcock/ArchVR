import { ClassicPreset } from "rete";
import type { DataflowNode } from "rete-engine";
import sockets from "../../sockets";
import { type GraphContext } from "../..";
import { Vector } from "../../types/Vector";

type Data = {
  widgetId: string;
};
export class WidgetOutput extends ClassicPreset.Node implements DataflowNode {
  width = 180;
  height = 205;

  static ID = "Widget Output";
  widgetId: string;
  updateWidget: (widgetId: string, data: any) => void;

  constructor(public di: GraphContext, data: Data) {
    super("Widget Output");
    console.log("Widget Output node created", data);
    this.updateWidget = di.updateWidget;
    const dataInput = new ClassicPreset.Input(sockets.Number, "Data");

    this.widgetId = data.widgetId;
    this.addControl(
      "value",
      new ClassicPreset.InputControl("text", {
        readonly: true,
      })
    );

    this.addInput("data", dataInput);
    this.addInput("unit", new ClassicPreset.Input(sockets.Text, "Unit"));
  }

  data(inputs: any) {
    // console.log(inputs);
    // console.log(inputs);
    const value = inputs.data;
    // const position =
    //   inputs["position"] && inputs["position"][0] instanceof Vector
    //     ? inputs["position"][0].toArray()
    //     : null;
    // const rotation =
    //   inputs["rotation"] && inputs["rotation"][0] instanceof Vector
    //     ? inputs["rotation"][0].toArray()
    //     : null;
    // const scaling =
    //   inputs["scaling"] && inputs["scaling"][0] instanceof Vector
    //     ? inputs["scaling"][0].toArray()
    //     : null;

    // if (this.updateTransform)
    //   this.updateTransform(this.transformId, {
    //     ...(position && { position }),
    //     ...(rotation && { rotation }),
    //     ...(scaling && { scaling }),
    //   });
    if (this.updateWidget) {
      this.updateWidget(this.widgetId, {
        data: inputs["data"] && inputs["data"][0] ? inputs["data"][0] : [],
        unit: inputs["unit"] ? inputs["unit"][0] : undefined,
      });
    }
    // show the live value on this node in the graph editor
    if (value && value[0] !== undefined) {
      this.di.showReadout?.(this.id, value[0]);
    }

    return { value };
  }

  serialize(): Data {
    return {
      widgetId: this.widgetId,
    };
  }
}
