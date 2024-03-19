import { defineStore } from "pinia";
import type { GraphIO } from "../rete/types";

export const useGraphStore = defineStore("graphs", {
  state: () => {
    return {
      currentGraph: null as GraphIO | null,
      editorOpen: false,
    };
  },
  actions: {},
});
