import type { ClassicPreset } from "rete";

export type SignalKind = "number" | "vector" | "text" | "image";

export function signalKind(socketName?: string): SignalKind {
  if (!socketName) return "number";
  if (socketName.startsWith("Vector")) return "vector";
  if (socketName === "Text") return "text";
  if (socketName === "Image") return "image";
  return "number";
}

const nodeIcons: Record<string, string> = {
  "Device Input": "sensors",
  "Vector Combiner": "merge",
  "Scale Offset": "functions",
  "Transform Output": "deployed_code",
  "Widget Output": "monitoring",
};

export function nodeMeta(label: string) {
  return {
    icon: nodeIcons[label] ?? "circle",
    isOutput: label.endsWith("Output"),
  };
}

// Rete mounts every node and wire in its own Vue app, so provide/inject
// can't reach them. The manager registers a lookup here instead.
type SocketLookup = (
  nodeId: string,
  outputKey: string
) => ClassicPreset.Socket | undefined;

let lookup: SocketLookup | null = null;

export function setSocketLookup(fn: SocketLookup) {
  lookup = fn;
}

export function connectionKind(conn: {
  source?: string;
  sourceOutput?: string;
}): SignalKind {
  if (!lookup || !conn.source || !conn.sourceOutput) return "number";
  return signalKind(lookup(conn.source, conn.sourceOutput)?.name);
}
