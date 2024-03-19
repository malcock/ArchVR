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

const Image = new Socket("Image");

Number.combine(Vector2, Vector3, Vector4);
Vector2.combine(Number, Vector3, Vector4);

export default { Number, Vector2, Vector3, Vector4, Image };
