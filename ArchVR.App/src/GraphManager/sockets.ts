import { ClassicPreset } from "rete";

export class Socket extends ClassicPreset.Socket {
  compatible: Socket[] = [];

  combineWith(socket: Socket) {
    this.compatible.push(socket);
  }

  combine(...sockets: Socket[]) {
    this.compatible.push(...sockets);
  }

  isCompatibleWith(socket: Socket) {
    return this === socket || this.compatible.includes(socket);
  }
}

const Number = new Socket("Number");
const Vector2 = new Socket("Vector2");
const Vector3 = new Socket("Vector3");
const Vector4 = new Socket("Vector4");

const VectorOnly = new Socket("VectorOnly");

const Image = new Socket("Image");

const Text = new Socket("Text");

Number.combine(Vector2, Vector3, Vector4);
Vector2.combine(Number, VectorOnly);
Vector3.combine(Number, VectorOnly);
Vector4.combine(Number, VectorOnly);

export default {
  Number,
  Vector2,
  Vector3,
  Vector4,
  Image,
  Text,
  VectorOnly,
};
