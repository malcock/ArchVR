import { NodeEditor, type NodeId } from "rete";
import type { GraphContext, Schemes } from ".";

import { Connection } from "./connections";
import * as Nodes from "./nodes";
import type { NodeFactory } from "./nodes/types";
import type { Node, GraphIO } from "./types";

export async function createNode(ctx: GraphContext, name: string, data: any) {
  const nodes = {
    [Nodes.DeviceInput.ID]: () => new Nodes.DeviceInput(ctx, data),
    [Nodes.TransformOutput.ID]: () => new Nodes.TransformOutput(ctx, data),
    [Nodes.WidgetOutput.ID]: () => new Nodes.WidgetOutput(ctx, data),
    [Nodes.VectorCombiner.ID]: () => new Nodes.VectorCombiner(ctx, data),
    [Nodes.ScaleOffset.ID]: () => new Nodes.ScaleOffset(ctx, data),
  };
  const matched = nodes[name];

  if (!matched) throw new Error(`Unsupported node '${name}'`);

  const node = await matched();

  return node;
}

// export async function importGraph(ctx:GraphContext,data:GraphIO){
//   const { nodes, connections } = data;

//   //try to find any existing connections and remove them
//   const existingConnections = ctx.editor.getConnections()
//   for(const c of connections){
//     const match = existingConnections.find(x=>x.source===c.source && x.t)
//     for(var i=0;i<existingConnections.length;i++){
//       if(c.source===existingConnections[i].s)
//     }
//   }

//   for(const n of nodes){
//     if(ctx.editor.getNode(n.id)) ctx.editor.removeNode
//   }
// }

export async function importEditor(
  ctx: GraphContext,
  data: GraphIO,
  editor: "editor" | "activeEditor" = "editor"
) {
  const { nodes, connections } = data;
  console.log("importing", nodes);
  if (editor === "activeEditor") await ctx.activeEditor.clear();
  for (const n of nodes) {
    console.log(n);
    const node = await createNode(ctx, n.name, n.data);
    node.id = n.id;
    await ctx[editor].addNode(node as Node);
  }
  for (const c of connections) {
    const source = ctx[editor].getNode(c.source);
    const target = ctx[editor].getNode(c.target);

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

      await ctx[editor].addConnection(conn);
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
