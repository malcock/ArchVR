import { NodeEditor, type NodeId } from "rete";
import type { DiContainer, Schemes } from ".";

import { Connection } from "./connections";
import * as Nodes from "./nodes";
import type { NodeFactory } from "./nodes/types";
import type { Node, GraphIO } from "./types";

export async function createNode(di: DiContainer, name: string, data: any) {
  const nodes = {
    [Nodes.DeviceInput.ID]: () => new Nodes.DeviceInput(di, data),
    [Nodes.TransformOutput.ID]: () => new Nodes.TransformOutput(di, data),
    [Nodes.WidgetOutput.ID]: () => new Nodes.WidgetOutput(di, data),
  };
  const matched = nodes[name];

  if (!matched) throw new Error(`Unsupported node '${name}'`);

  const node = await matched();

  return node;
}

export async function importEditor(di: DiContainer, data: GraphIO) {
  const { nodes, connections } = data;
  console.log("importing", nodes);
  await di.editor.clear();

  for (const n of nodes) {
    console.log(n);
    const node = await createNode(di, n.name, n.data);
    node.id = n.id;
    await di.editor.addNode(node as Node);
  }
  for (const c of connections) {
    const source = di.editor.getNode(c.source);
    const target = di.editor.getNode(c.target);

    if (
      source &&
      target &&
      source.outputs[c.sourceOutput] &&
      target.inputs[c.targetInput]
    ) {
      const conn = new Connection(
        source,
        c.sourceOutput,
        target,
        c.targetInput
      );

      await di.editor.addConnection(conn);
    }
  }
}

export function exportEditor(editor: NodeEditor<Schemes>) {
  const nodes = [];
  const connections = [];

  for (const n of editor.getNodes()) {
    nodes.push({
      id: n.id,
      name: (n.constructor as NodeFactory).ID,
      data: n.serialize(),
    });
  }
  for (const c of editor.getConnections()) {
    connections.push({
      source: c.source,
      sourceOutput: c.sourceOutput,
      target: c.target,
      targetInput: c.targetInput,
    });
  }

  return {
    nodes,
    connections,
  };
}
