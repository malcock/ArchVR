import { Connection } from "./connections";
import * as Nodes from "./nodes";

export type { GraphIO } from "./types/GraphIO";

export type Node =
  | Nodes.DeviceInput
  | Nodes.TransformOutput
  | Nodes.VectorCombiner
  | Nodes.WidgetOutput;

export type ConnProps = Connection<Node, Node>;
