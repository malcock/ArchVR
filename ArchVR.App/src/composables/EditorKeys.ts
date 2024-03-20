import type { EventBusKey } from "@vueuse/core";
import { type InjectionKey } from "vue";
import { EditorApp } from "~archvr3d";

export const EditorKey: InjectionKey<EditorApp> = Symbol("Editor");

type EditorBusTypes =
  | "model.new"
  | "widget.new"
  | "device.new"
  | "widget.update"
  | "widget.open"
  | "graph.open";

export const EditorBus: EventBusKey<EditorBusTypes> = Symbol("Editor");
