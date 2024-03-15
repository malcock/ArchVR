import { nanoid } from "nanoid";
import {
  Engine,
  Scene,
  Vector3,
  TransformNode,
  HemisphericLight,
} from "@babylonjs/core";
import { Observable } from "@babylonjs/core/Misc/observable";
// import { SceneDto } from "../types/dtos/ProjectDtos";
// import { ModelLoader } from "./loaders/ModelLoader";
import { UiMaterials } from "./ui/UiMaterial";
import CameraRig from "./rigs/CameraRig";
import { MetaLookupBehavior } from "./behaviors/MetaLookupBehavior";
import { EditorSelection, SelectionManager } from "./managers/SelectionManager";
import { SelectTool } from "./tools/SelectTool";
import { AbstractTool } from "./tools/AbstractTool";
import { MoveTool } from "./tools/MoveTool";
import LayerColors from "./config/LayerColors";
import { DeviceTool, DeviceTransform } from "./tools/DeviceTool";
// import { ApiFunctions } from "./types/ApiFunctions";
import ApiFunctionMap from "./ApiFunctionMap";
function debounce(func: (...args: unknown[]) => unknown, delay = 200) {
  let timeout: any;

  return function (...args: unknown[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

export interface HierarchyItem {
  id: string | undefined;
  name: string | undefined;
  graphId: string | undefined;
  ifcType: string | undefined;
  objectType: string | undefined;
  selected?: boolean;
  children: HierarchyItem[];
}

export class EditorApp {
  scene?: Scene;
  // private _canvas!: HTMLCanvasElement;
  cameraRig!: CameraRig;
  public static root: TransformNode;

  public id: string;

  tools!: {
    select: SelectTool;
    move: MoveTool;
    devices: DeviceTool;
  };
  private _currentTool!: AbstractTool;

  get currentTool(): AbstractTool {
    return this._currentTool;
  }

  static get layerColors() {
    return LayerColors;
  }

  set currentTool(tool: AbstractTool) {
    if (tool === this._currentTool) return;
    if (this._currentTool) {
      this._currentTool.active = false;
    }
    this._currentTool = tool;
    this._currentTool.active = true;
    console.log("currentTool set", tool);
    this.onToolSelected.notifyObservers(this._currentTool);
  }

  // observables
  onToolSelected = new Observable<AbstractTool>();
  onEditorReady = new Observable<boolean>();
  onHierarchyUpdated = new Observable<HierarchyItem>();
  onSelectionChange = new Observable<EditorSelection>();
  onDeviceUpdated = new Observable<DeviceTransform>();
  onBroadcastCommand = new Observable<EditorCommand>();

  constructor() {
    this.id = nanoid();
    console.log("editor constructed");
  }

  setCurrentToolByName(name: string) {
    const theTool =
      this.tools[name.toLowerCase() as "move" | "select" | "devices"];
    this.currentTool = theTool;
  }

  dispose() {
    var engine = this.scene?.getEngine();
    this.scene?.dispose();
    engine?.dispose();
    engine = undefined;
  }

  createEditor(canvas: HTMLCanvasElement) {
    const engine = new Engine(canvas);
    const scene = new Scene(engine);
    UiMaterials.initialise(scene);
    this.scene = scene;
    // this._canvas = canvas;
    EditorApp.root = new TransformNode("root", scene);

    this.tools = {
      select: new SelectTool(scene),
      move: new MoveTool(scene),
      devices: new DeviceTool(this.onDeviceUpdated, scene),
    };

    this.currentTool = this.tools.select;

    // const sidebar = document.getElementById("editorsidebar");
    // Resizing
    function resizeCanvas(canvas: HTMLCanvasElement) {
      console.log(window);
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      engine.resize();
    }
    resizeCanvas(canvas);

    window.addEventListener(
      "resize",
      debounce(() => resizeCanvas(canvas), 200)
    );

    this.cameraRig = new CameraRig(scene, canvas);
    scene.cameraToUseForPointers = this.cameraRig.camera;

    // const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);
    // camera.setTarget(Vector3.Zero());
    // camera.attachControl(canvas, true);

    new HemisphericLight("light", new Vector3(0, 1, 1), scene);

    engine.runRenderLoop(() => {
      scene.render();
    });

    //bus observers to emit
    SelectionManager.onSelectionChange.add((selection) => {
      this.onSelectionChange.notifyObservers(selection);
      this.onHierarchyUpdated.notifyObservers(this.getHierarchy());
    });

    this.onEditorReady.notifyObservers(true);
    console.log("editor starte  d");
  }

  loadScene(scene: any) {
    console.log(scene);
    // let deviceList =
    // //@ts-ignore
    //   scene.devices?.map(({ transform, ...rest }) => ({
    //     ...rest,
    //     ...(transform && { transform: JSON.parse(transform) }),
    //   })) || [];
    // if (scene.Nodes) {
    //   for (const node of scene.Nodes) {
    //     if (node.File && node.File.sasUrl) {
    //       const model = new ModelLoader(
    //         node.name,
    //         node.File.sasUrl,
    //         this.scene!,
    //         EditorApp.root,
    //         () => {
    //           // console.log(this.getHierarchy());

    //           // const heirarchy = this.getHierarchy()
    //           // get list of new nodes
    //           const deviceIds = deviceList.map((x:any) => x.transform.parent);
    //           const newDeviceNodes = EditorApp.root.getDescendants(false, (x) =>
    //             deviceIds.includes(x.id)
    //           );

    //           newDeviceNodes.forEach((n) => {
    //             const devices = deviceList.filter(
    //               (x:any) => x.transform.parent === n.id
    //             );
    //             devices.forEach((d:any) => {
    //               this.call("device.create", {
    //                 id: d.id,
    //                 transform: JSON.stringify(d.transform),
    //               });
    //             });
    //             // const index = deviceList.findIndex(
    //             //   (x) => x.transform.parent === n.id
    //             // );
    //             // if (index > -1) {
    //             //   const newDevice = deviceList[index];
    //             //   this.call("device.create", {
    //             //     id: newDevice.id,
    //             //     transform: JSON.stringify(newDevice.transform),
    //             //   });
    //             //   deviceList.splice(index, 1);
    //             // }
    //           });

    //           this.onHierarchyUpdated.notifyObservers(this.getHierarchy());

    //           setTimeout(() => {
    //             SelectionManager.selectNone();
    //           }, 5);
    //         }
    //       );
    //       model.loadModel();
    //     }
    //   }
    // }
  }

  setSelection(id: string) {
    console.log(id);

    var obj = EditorApp.root.getChildren((x) => x.id === id, false)[0];
    console.log(obj);
    if (obj) {
      SelectionManager.setObjectSelection(obj as TransformNode);
    }
  }

  getHierarchy() {
    function buildChildren(node: TransformNode): HierarchyItem {
      var childNodes = node.getChildren<TransformNode>();
      var children = [];
      for (var i = 0; i < childNodes.length; i++) {
        children[i] = buildChildren(childNodes[i]);
      }

      var isSelected = SelectionManager.isObjectSelected(node);
      children.sort((a, b) => {
        if (a.children.length > b.children.length) return -1;
        if (a.children.length < b.children.length) return 1;
        return 0;
      });
      var b = node.getBehaviorByName("MetaLookupBehavior");

      var objMeta = b ? (b as MetaLookupBehavior).getMeta(node) : null;

      return {
        id: objMeta ? objMeta.id : node.name,
        name: objMeta ? objMeta.Name : node.name,
        graphId: `node-${node.uniqueId}`,
        ifcType: objMeta ? objMeta.ifcType : undefined,
        objectType: objMeta ? objMeta.ObjectType : undefined,
        // meta: objMeta,
        selected: isSelected,
        children,
      };
    }

    return buildChildren(EditorApp.root);
  }

  async call<T extends keyof typeof ApiFunctionMap>(
    fn: T,
    options: Omit<Parameters<(typeof ApiFunctionMap)[typeof fn]>[0], "scene">
  ) {
    console.log(options);
    var opts = { scene: this.scene!, ...options };
    //@ts-ignore - options returns as a union type for some reason...
    await ApiFunctionMap[fn](opts);

    // prep cmd to be emitted by an MQTT client
    // mqtt client code will decide whether to call()
    const cmd: EditorCommand = {
      editorId: this.id,
      name: fn,
      options,
    };
    this.onBroadcastCommand.notifyObservers(cmd);
  }

  updateTransform(
    transformId: string,
    transform: {
      position?: Array<number>;
      rotation?: Array<number>;
      scaling?: Array<number>;
    }
  ) {
    console.log("editor updateTransform", transformId, transform);
    if (!transformId) return;
    // perhaps this can be cached?

    const nodes = EditorApp.root.getChildren(
      (x) => x.id === transformId,
      false
    ) as TransformNode[];

    //TODO: seems that we're getting a mesh and a transform node by the same ID,
    // need to merge them to reduce overhead
    nodes.forEach((node) => {
      if (node) {
        if (transform.position)
          node.position = Vector3.FromArray(transform.position, 0);
        if (transform.rotation)
          node.rotation = Vector3.FromArray(transform.rotation, 0);
        if (transform.scaling)
          node.scaling = Vector3.FromArray(transform.scaling, 0);
      }
    });
  }
}

export interface EditorCommand {
  editorId: string;
  name: string;
  options: any;
}
