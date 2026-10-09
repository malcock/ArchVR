import { customAlphabet } from "nanoid";
import type { GraphIO } from "~/GraphManager/types";
import type { SceneWidgetType } from "~/server/trpc/routers/scene";

const nanoid = customAlphabet("1234567890abcdef", 16);

/** The graph a widget starts with: a lone output node bound to it */
export default function useWidgetOutputGraph(widget: SceneWidgetType) {
  return (): GraphIO => ({
    nodes: [
      {
        id: nanoid(),
        name: "Widget Output",
        data: { widgetId: widget.id },
      },
    ],
    connections: [],
  });
}
