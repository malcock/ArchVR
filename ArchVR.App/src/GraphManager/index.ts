//rete imports
import { ClassicPreset, type GetSchemes, NodeEditor } from "rete";
import { DataflowEngine } from "rete-engine";
import { AreaExtensions, AreaPlugin } from "rete-area-plugin";
import { type VueArea2D, VuePlugin, Presets } from "rete-vue-plugin";
import {
  type ContextMenuExtra,
  ContextMenuPlugin,
  Presets as ContextMenuPresets,
} from "rete-context-menu-plugin";
import {
  ConnectionPlugin,
  Presets as ConnectionPresets,
} from "rete-connection-plugin";
import {
  AutoArrangePlugin,
  Presets as ArrangePresets,
} from "rete-auto-arrange-plugin";

//relative imports
import { SelectField } from "./controls/select-field";
import SelectUI from "./controls/SelectUI.vue";
import GraphNode from "./ui/GraphNode.vue";
import GraphSocket from "./ui/GraphSocket.vue";
import GraphConnection from "./ui/GraphConnection.vue";
import GraphControl from "./ui/GraphControl.vue";
import { setSocketLookup } from "./ui/meta";
import * as Nodes from "./nodes";
import type { ConnProps, Node } from "./types";
export type Schemes = GetSchemes<Node, ConnProps>;
type AreaExtra = VueArea2D<Schemes> | ContextMenuExtra;

// other imports
import type { GraphType } from "~/server/trpc/routers/graph";
import type { DeviceType } from "~/server/trpc/routers/devices";
import { debounce, getConnectionSockets, throttle } from "./util";
import type { GraphIO } from "./types";
import { exportEditor, importEditor } from "./import-export";
import { GraphObservable } from "./GraphObservable";
/**
 * general purpose graph manager tool
 * responsible for running all graphs in the scene
 * and handling the display of the editor
 */

type UpdateTransformFunc = (
  transformId: string,
  transform: {
    position?: Array<number>;
    rotation?: Array<number>;
    scaling?: Array<number>;
  }
) => void;
type UpdateWidgetFunc = (widgetId: string, data: any) => void;
type DeviceLookupFunc = (term: string) => Promise<DeviceType[]>;
export type GraphContext = {
  process: () => void;
  editor: NodeEditor<Schemes>;
  activeEditor: NodeEditor<Schemes>;
  deviceList: DeviceType[];
  deviceLookup: DeviceLookupFunc;
  updateTransform: UpdateTransformFunc;
  updateWidget: UpdateWidgetFunc;
  addDeviceHook: (hook: (obj: { deviceId: string; data: any }) => void) => void;
  updateControl?: (control: ClassicPreset.InputControl<"number">) => void;
  updateNode?: (n: Node) => void;
};

export class GraphManager {
  graphs: GraphType[] = [];
  ctx!: GraphContext;
  editor: NodeEditor<Schemes>;
  engine: DataflowEngine<Schemes>;
  activeEditor: NodeEditor<Schemes>;
  private _currentGraph: GraphType | null = null;
  private _deviceObservable = new GraphObservable<{
    deviceId: string;
    data: any;
  }>();
  arrange!: AutoArrangePlugin<Schemes, never>;
  area!: AreaPlugin<Schemes, AreaExtra>;

  /**
   * Create base editor and engine, without render context
   * @param deviceLookup
   * @param updateTransform
   * @param updateWidget
   */
  constructor(
    deviceList: DeviceType[],
    deviceLookup: DeviceLookupFunc,
    updateTransform: UpdateTransformFunc,
    updateWidget: UpdateWidgetFunc
  ) {
    const editor = new NodeEditor<Schemes>();
    const engine = new DataflowEngine<Schemes>();
    const activeEditor = new NodeEditor<Schemes>();
    editor.use(engine);
    function _process() {
      engine.reset();

      editor
        .getNodes()
        .filter(
          (n) =>
            n instanceof Nodes.TransformOutput ||
            n instanceof Nodes.WidgetOutput
        )
        .forEach((n) => engine.fetch(n.id));
    }
    this.editor = editor;
    this.activeEditor = activeEditor;
    this.engine = engine;

    activeEditor.addPipe((context) => {
      if (context.type === "connectioncreate") {
        const { data } = context;
        const { source, target } = getConnectionSockets(activeEditor, data);
        console.log({ source, target });
        if (!source.isCompatibleWith(target)) {
          console.log("Sockets are not compatible", "error");
          return;
        }
      }
      return context;
    });

    const process = throttle(_process, 33);
    const addDeviceHook = (
      hook: (obj: { deviceId: string; data: any }) => void
    ) => {
      this._deviceObservable.subscribe(hook);
    };

    this.ctx = {
      activeEditor: this.activeEditor,
      deviceList,
      deviceLookup,
      updateTransform,
      updateWidget,
      process,
      addDeviceHook,
      editor: this.editor,
    };
  }

  async createEditor(container: HTMLElement) {
    const area = new AreaPlugin<Schemes, AreaExtra>(container);
    const connection = new ConnectionPlugin<Schemes>();
    const arrange = new AutoArrangePlugin<Schemes>();
    const render = new VuePlugin<Schemes, AreaExtra>();
    const contextMenu = new ContextMenuPlugin<Schemes>({
      items: ContextMenuPresets.classic.setup([
        [
          "Input",
          [
            ["Device", () => new Nodes.DeviceInput(this.ctx, { deviceId: "" })],
            // ["Texture", () => new Nodes.InputTexture(di, { name: '' })],
          ],
        ],
        [
          "Vector",
          [
            [
              "Combiner",
              () =>
                new Nodes.VectorCombiner(this.ctx, { x: 0, y: 0, z: 0, w: 0 }),
            ],
          ],
        ],
        [
          "Math",
          [
            [
              "Scale Offset",
              () => new Nodes.ScaleOffset(this.ctx, { scale: 1, offset: 0 }),
            ],
          ],
        ],
        [
          "Output",
          [
            [
              "Transform",
              () => new Nodes.TransformOutput(this.ctx, { transformId: "" }),
            ],
          ],
        ],
      ]),
    });

    render.addPreset(Presets.contextMenu.setup({ delay: 200 }));
    render.addPreset(
      Presets.classic.setup({
        customize: {
          node: () => GraphNode,
          socket: () => GraphSocket,
          connection: () => GraphConnection,
          control(data) {
            if (data.payload instanceof SelectField) return SelectUI;

            if (data.payload instanceof ClassicPreset.InputControl) {
              return GraphControl;
            }
            return null;
          },
        },
      })
    );
    setSocketLookup(
      (nodeId, key) => this.activeEditor.getNode(nodeId)?.outputs[key]?.socket
    );
    connection.addPreset(ConnectionPresets.classic.setup());
    arrange.addPreset(ArrangePresets.classic.setup());

    //active editor is the one that you use!
    this.activeEditor.use(area);
    this.arrange = arrange;
    this.area = area;
    area.use(contextMenu);
    area.use(connection);
    area.use(render);
    area.use(arrange);

    AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
      accumulating: AreaExtensions.accumulateOnCtrl(),
    });
    AreaExtensions.simpleNodesOrder(area);

    // dot grid that pans and zooms with the graph
    const grid = document.createElement("div");
    grid.classList.add("rete-grid");
    area.area.content.add(grid);
    // add missing updaters to ctx
    this.ctx.updateNode = (node: Node) => area.update("node", node.id);
    this.ctx.updateControl = (c: ClassicPreset.InputControl<"number">) => {
      area.update("control", c.id);
    };

    return {
      destroy: () => area.destroy(),
    };
  }

  async loadGraph(graph: GraphType) {
    const index = this.graphs.findIndex((x) => x.id === graph.id);
    if (index > -1) {
      //if the graph is already in the manager, remove it from the editor context
      this.graphs.splice(index, 1);
    }
    this.graphs.push(graph);

    // just clear everything and start again
    await this.editor.clear();
    for (var g of this.graphs) {
      const gIO: GraphIO =
        typeof g.file === "string" ? JSON.parse(g.file) : g.file;
      await importEditor(this.ctx, gIO);
    }
  }

  updateDevice(obj: { deviceId: string; data: any }) {
    // console.log({ obj });
    this._deviceObservable.notify(obj);
  }

  async setActiveGraph(graph: GraphType) {
    //make sure the graph is loaded in main context
    const index = this.graphs.findIndex((x) => x.id === graph.id);
    if (index > -1) {
      await this.loadGraph(graph);
    }
    this._currentGraph = graph;
    const gIO: GraphIO =
      typeof graph.file === "string" ? JSON.parse(graph.file) : graph.file;
    await importEditor(this.ctx, gIO, "activeEditor");

    await this.arrange.layout();
  }

  async tidy() {
    await this.arrange.layout();
    await this.fitView();
  }

  /** Centre the active graph in the canvas, never zooming past 100% */
  async fitView(padding = 48) {
    const { area } = this;
    const nodes = this.activeEditor.getNodes();
    if (!area || !nodes.length) return;
    // nodes mount asynchronously; wait for them to have a size
    await new Promise((resolve) => requestAnimationFrame(resolve));

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const node of nodes) {
      const view = area.nodeViews.get(node.id);
      if (!view) continue;
      const { x, y } = view.position;
      const el = view.element.firstElementChild as HTMLElement | null;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x + (el?.offsetWidth || node.width));
      maxY = Math.max(maxY, y + (el?.offsetHeight || node.height));
    }
    if (!Number.isFinite(minX)) return;

    const { clientWidth, clientHeight } = area.container;
    const width = maxX - minX;
    const height = maxY - minY;
    const k = Math.min(
      1,
      (clientWidth - padding * 2) / width,
      (clientHeight - padding * 2) / height
    );
    await area.area.zoom(k, 0, 0);
    await area.area.translate(
      (clientWidth - width * k) / 2 - minX * k,
      (clientHeight - height * k) / 2 - minY * k
    );
  }

  async saveActiveGraph() {
    return {
      graphId: this._currentGraph?.id,
      file: exportEditor(this.ctx.activeEditor),
    };
  }
}
