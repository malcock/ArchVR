import { type InjectionKey } from "vue";
import { EditorApp } from "~archvr3d";

const EditorKey: InjectionKey<EditorApp> = Symbol("Editor");

export default EditorKey;
