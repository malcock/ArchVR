import type { EditorApp } from "~archvr3d";
export default function UseEditorObservables(
  editor: EditorApp,
  sceneId: string
) {
  const trpc = useTrpc();
  editor.onDeviceUpdated.add(async (deviceTransform) => {
    if (!deviceTransform.id) {
      // no id, so create a new one
      const newDevice = await trpc().device.create.mutate({
        name: "New IoT device",
        deviceType: "new thing",
        transform: deviceTransform.transform,
        parentId: undefined,
        sceneId,
      });
      editor.call("device.create", {
        id: newDevice.id,
        transform: deviceTransform.transform,
      });
      setTimeout(() => {
        editor.setCurrentToolByName("select");
      }, 1);
    }
  });
}
