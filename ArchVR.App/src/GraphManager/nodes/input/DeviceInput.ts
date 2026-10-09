import { ClassicPreset } from "rete";
import type { DataflowNode } from "rete-engine";
import type { GraphContext } from "../..";
import { SelectField } from "../../controls/select-field";
import sockets from "../../sockets";
import { Vector } from "../../types/Vector";
import type { DeviceType } from "~/server/trpc/routers/devices";

type Data = {
  deviceId: string;
};
export class DeviceInput extends ClassicPreset.Node implements DataflowNode {
  static ID = "Device Input";
  device?: DeviceType;
  val: any;
  width = 280;
  height = 220;
  constructor(public ctx: GraphContext, data: Data) {
    super("Device Input");
    const deviceList = ctx.deviceList.map((x) => ({
      text: x.topic as string,
      value: x.id,
    }));

    const sel = new SelectField(
      data.deviceId,
      deviceList,
      (e) => {
        data.deviceId = e;
        this.setOutputSocket(data.deviceId);
      },
      "Choose a device"
    );

    const onDeviceDataReceived = (obj: { deviceId: string; data: any }) => {
      if (obj.deviceId === data.deviceId && this.device) {
        switch (this.device.unitType) {
          case "number":
            this.val = obj.data;
            break;
          case "vector2":
            this.val = new Vector(obj.data.x, obj.data.y);
            break;
          case "vector3":
            this.val = new Vector(obj.data.x, obj.data.y, obj.data.z);
            break;
          case "vector4":
            this.val = new Vector(
              obj.data.x,
              obj.data.y,
              obj.data.z,
              obj.data.w
            );
            break;
        }
        // console.log(this.device?.topic, "updated", data);
        ctx.process();
      }
    };
    ctx.addDeviceHook(onDeviceDataReceived);
    this.addControl("deviceId", sel);
    if (data.deviceId) {
      this.setOutputSocket(data.deviceId);
    }
    // this.addOutput("value", new ClassicPreset.Output(sockets.Vector3, "Value"));

    this.val = new Vector(0, 0, 0);

    // setInterval(() => {
    //   this.val = { x: Math.random(), y: Math.random(), z: Math.random() };
    //   ctx.process();
    // }, 500);
  }

  setOutputSocket(deviceId: string) {
    //first get the device from the list
    this.device = this.ctx.deviceList.find((x) => x.id === deviceId);
    console.log("setOutputSocket", deviceId, this.device);
    if (this.device) {
      //add outputs based on the device unitType
      if (this.hasOutput("value")) this.removeOutput("value");

      if (this.hasOutput("name")) this.removeOutput("name");
      if (this.hasOutput("deviceType")) this.removeOutput("deviceType");
      if (this.hasOutput("unit")) this.removeOutput("unit");

      switch (this.device.unitType) {
        case "number":
          console.log("adding number");
          this.addOutput(
            "value",
            new ClassicPreset.Output(sockets.Number, "Value")
          );

          break;
        case "vector2":
          this.addOutput(
            "value",
            new ClassicPreset.Output(sockets.Vector2, "Value")
          );
          break;
        case "vector3":
          this.addOutput(
            "value",
            new ClassicPreset.Output(sockets.Vector3, "Value")
          );
          break;
        case "vector4":
          this.addOutput(
            "value",
            new ClassicPreset.Output(sockets.Vector4, "Value")
          );
          break;
      }

      this.addOutput(
        "name",
        new ClassicPreset.Output(sockets.Text, `name: ${this.device.name}`)
      );

      this.addOutput(
        "deviceType",
        new ClassicPreset.Output(
          sockets.Text,
          `type: ${this.device.deviceType}`
        )
      );

      this.addOutput(
        "unit",
        new ClassicPreset.Output(sockets.Text, `unit: ${this.device.unit}`)
      );

      if (this.ctx.updateNode) this.ctx.updateNode(this);
    }
  }

  data() {
    return {
      value: this.val,
      name: this.device?.name,
      deviceType: this.device?.deviceType,
      unit: this.device?.unit,
    };
  }

  serialize(): Data {
    return {
      deviceId: (this.controls["deviceId"] as SelectField).value,
    };
  }
}
