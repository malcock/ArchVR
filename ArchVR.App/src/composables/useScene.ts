import type { SceneType } from "~/server/trpc/routers/scene";

const trpc = useTrpc();

export default async function useScene(sceneId: string) {
  const scene = new SceneManager(sceneId);
  await scene.load();
}

export class SceneManager {
  scene: SceneType | undefined;
  constructor(public sceneId: string) {}

  async load() {
    this.scene = await trpc().scene.get.query({ sceneId: this.sceneId });
  }
}
