import { ClassicPreset, type GetSchemes, NodeEditor } from "rete";
import { AreaPlugin } from "rete-area-plugin";
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
import * as Nodes from "./nodes";
import { DataflowEngine } from "rete-engine";
import type { GraphIO } from "./types/GraphIO";
import { debounce } from "./util";
import { exportEditor, importEditor } from "./import-export";

import { SelectField } from "./controls/select-field";
import SelectUI from "./controls/SelectUI.vue";
import { GraphObservable } from "./GraphObservable";
import { Vector } from "./types/Vector";
import type { DeviceType } from "~/server/trpc/routers/devices";
import type { ConnProps, Node } from "./types";
export type Schemes = GetSchemes<Node, ConnProps>;

type AreaExtra = VueArea2D<Schemes> | ContextMenuExtra;

// export type DeviceId = { id: string; name: string };

export type DiContainer = {
  process: () => void;
  editor: NodeEditor<Schemes>;
  deviceList: DeviceType[];
  updateControl: (control: ClassicPreset.InputControl<"number">) => void;
  addDeviceHook: (hook: (obj: { deviceId: string; data: any }) => void) => void;
  updateTransform: (
    transformId: string,
    transform: {
      position?: Array<number>;
      rotation?: Array<number>;
      scaling?: Array<number>;
    }
  ) => void;
  updateWidget: (widgetId: string, data: any) => void;
  updateNode: (n: Node) => void;
};

export class GraphEditorApp {
  editor!: NodeEditor<Schemes>;
  di!: DiContainer;
  private _deviceObservable = new GraphObservable<{
    deviceId: string;
    data: any;
  }>();
  //@ts-ignore // unknown beef
  arrange: AutoArrangePlugin<Schemes, never>;

  async createEditor(
    container: HTMLElement,
    deviceList: DeviceType[],
    updateTransform: (
      transformId: string,
      transform: {
        position?: Array<number>;
        rotation?: Array<number>;
        scaling?: Array<number>;
      }
    ) => void,
    updateWidget: (widgetId: string, data: any) => void
  ) {
    const editor = new NodeEditor<Schemes>();
    const area = new AreaPlugin<Schemes, AreaExtra>(container);
    const connection = new ConnectionPlugin<Schemes>();
    const render = new VuePlugin<Schemes, AreaExtra>();
    //@ts-ignore dunno what the beef is here
    const arrange = new AutoArrangePlugin<Schemes>();
    const engine = new DataflowEngine<Schemes>();

    this.editor = editor;

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

    const process = debounce(_process, 100);

    const addDeviceHook = (
      hook: (obj: { deviceId: string; data: any }) => void
    ) => {
      this._deviceObservable.subscribe(hook);
    };
    const updateNode = (node: Node) => area.update("node", node.id);
    this.di = {
      editor: this.editor,
      process,
      deviceList,
      addDeviceHook,
      updateControl: (c) => {
        area.update("control", c.id);
      },
      updateTransform,
      updateWidget,
      updateNode,
    };

    const contextMenu = new ContextMenuPlugin<Schemes>({
      items: ContextMenuPresets.classic.setup([
        [
          "Input",
          [
            ["Device", () => new Nodes.DeviceInput(this.di, { deviceId: "" })],
            // ["Texture", () => new Nodes.InputTexture(di, { name: '' })],
          ],
        ],
        [
          "Output",
          [
            [
              "Transform",
              () => new Nodes.TransformOutput(this.di, { transformId: "" }),
            ],
          ],
        ],
      ]),
    });
    area.use(contextMenu);
    render.addPreset(Presets.contextMenu.setup({ delay: 200 }));
    render.addPreset(Presets.classic.setup());
    render.addPreset(
      Presets.classic.setup({
        customize: {
          control(data) {
            if (data.payload instanceof SelectField) return SelectUI;

            if (data.payload instanceof ClassicPreset.InputControl) {
              return Presets.classic.Control;
            }
          },
        },
      })
    );
    connection.addPreset(ConnectionPresets.classic.setup());
    arrange.addPreset(ArrangePresets.classic.setup());
    this.editor.use(area);
    editor.use(engine);
    area.use(connection);
    area.use(render);
    area.use(arrange);

    this.arrange = arrange;
    return {
      destroy: () => area.destroy(),
    };
  }

  updateDevice(obj: { deviceId: string; data: any }) {
    this._deviceObservable.notify(obj);
  }

  async loadGraph(graph: GraphIO) {
    console.log(graph);

    await importEditor(this.di, graph);
    await this.arrange.layout();
  }

  async saveGraph() {
    return exportEditor(this.di.editor);
  }
}
