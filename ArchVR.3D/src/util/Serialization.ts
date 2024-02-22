import { Vector3 } from "@babylonjs/core/Maths";
import { Node, TransformNode } from "@babylonjs/core";

export function SerializeTransform(
  node:
    | TransformNode
    | {
        position?: Vector3;
        rotation?: Vector3;
        scaling?: Vector3;
        parent?: Node;
      }
) {
  function vector3ToObject(vector?: Vector3) {
    if (!vector) return null;
    return {
      x: vector.x,
      y: vector.y,
      z: vector.z,
    };
  }
  console.log(node);
  return {
    position: vector3ToObject(node.position),
    rotation: vector3ToObject(node.rotation),
    scaling: vector3ToObject(node.scaling),
    parent: node.parent ? node.parent.id : null,
  };
}

export function DeserializeTransform(json: string | object): {
  position: Vector3;
  rotation: Vector3;
  scaling: Vector3;
  parent: null | Node | string;
};
export function DeserializeTransform(
  json: string | object,
  node: TransformNode
): void;
export function DeserializeTransform(
  json: string | object,
  node?: TransformNode
): {
  position: Vector3;
  rotation: Vector3;
  scaling: Vector3;
  parent: null | Node | string;
} | void {
  function objectToVector3(obj: { x: number; y: number; z: number }) {
    return new Vector3(obj.x, obj.y, obj.z);
  }
  if (typeof json === "string") {
    json = JSON.parse(json);
  }
  const position = objectToVector3((json as any).position);
  const rotation = objectToVector3((json as any).rotation);
  const scaling = objectToVector3((json as any).scaling);

  if (node) {
    node.position = position;
    node.rotation = rotation;
    node.scaling = scaling;

    const newParent = node.getScene().getNodeById(json as any);
    node.parent = newParent || null;
    return;
  } else {
    return {
      position,
      rotation,
      scaling,
      parent: (json as any).parent,
    };
  }
}
