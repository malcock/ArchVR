export interface GraphIO {
  id?: string;
  nodes: GraphNode[];
  connections: Connection[];
}

export interface Connection {
  source: string;
  sourceOutput: string;
  target: string;
  targetInput: string;
}

export interface GraphNode {
  id: string;
  name: string;
  data: { [key: string]: any };
}
