import { ClassicPreset } from "rete";
import type { DataflowNode } from "rete-engine";
import type { DiContainer } from "../..";
import { SelectField } from "../../controls/select-field";
import sockets from "../../sockets";
import { Vector } from "../../types/Vector";

type Data = {
  deviceId: string;
};
export class DeviceInput extends ClassicPreset.Node implements DataflowNode {
  static ID = "Device Input";
  val: Vector;
  width = 220;
  height = 220;
  constructor(public di: DiContainer, data: Data) {
    super("Device Input");
    const deviceList = di.deviceList.map((x) => ({
      text: x.topic as string,
      value: x.id,
    }));

    const sel = new SelectField(data.deviceId, deviceList, (e) => {
      data.deviceId = e;
      this.setOutputSocket(data.deviceId);
    });

    const onDeviceDataReceived = (obj: { deviceId: string; data: any }) => {
      if (obj.deviceId === data.deviceId)
        this.val = new Vector(obj.data.x, obj.data.y, obj.data.z);
      di.process();
    };
    di.addDeviceHook(onDeviceDataReceived);
    this.addControl("deviceId", sel);
    if (data.deviceId) {
      this.setOutputSocket(data.deviceId);
    }
    // this.addOutput("value", new ClassicPreset.Output(sockets.Vector3, "Value"));

    this.val = new Vector(0, 0, 0);

    // setInterval(() => {
    //   this.val = { x: Math.random(), y: Math.random(), z: Math.random() };
    //   di.process();
    // }, 500);
  }

  setOutputSocket(deviceId: string) {
    //first get the device from the list
    const device = this.di.deviceList.find((x) => x.id === deviceId);
    console.log("setOutputSocket", deviceId, device);
    if (device) {
      //add outputs based on the device unitType
      if (this.hasOutput("value")) this.removeOutput("value");
      if (this.hasControl("name")) this.removeControl("name");
      if (this.hasControl("deviceType")) this.removeControl("deviceType");
      if (this.hasControl("unit")) this.removeControl("unit");
      switch (device.unitType) {
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

      //now add informational controls
      this.addControl(
        "name",
        new ClassicPreset.InputControl("text", {
          initial: device.name,
          readonly: true,
        })
      );
      this.addControl(
        "deviceType",
        new ClassicPreset.InputControl("text", {
          initial: device.deviceType,
          readonly: true,
        })
      );
      this.addControl(
        "unit",
        new ClassicPreset.InputControl("text", {
          initial: device.unit,
          readonly: true,
        })
      );
      this.di.updateNode(this);
    }
  }

  data() {
    return {
      value: this.val,
    };
  }

  serialize(): Data {
    return {
      deviceId: (this.controls["deviceId"] as SelectField).value,
    };
  }
}
