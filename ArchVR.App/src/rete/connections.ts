import { ClassicPreset } from "rete";
import type { Node } from "./types";

export class Connection<
  A extends Node,
  B extends Node
> extends ClassicPreset.Connection<A, B> {}
