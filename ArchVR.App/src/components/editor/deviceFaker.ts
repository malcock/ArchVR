import type { Pausable } from "@vueuse/core";
import type { GraphManager } from "~/GraphManager";
import type { DeviceType } from "~/server/trpc/routers/devices";

const deviceOptions = {
  "UK.SHF.BLD.ambient": {
    interval: 2000,
    data: () => Math.random() * 6 + 16,
  },
  "UK.SHF.BLD.Cell1.MA1.spindle": {
    interval: 16,
    data: () => Math.sin(Date.now() / 1e3),
  },
  "UK.SHF.BLD.Cell1.MA1.heat": {
    interval: 500,
    data: () => Math.abs(Math.sin(Date.now() / 1e4)) * 70 + 20,
  },
  "UK.SHF.BLD.Cell1.MA1.power": {
    interval: 1000,
    data: () => Math.random() * 200 + 400,
  },
  "UK.SHF.BLD.Cell1.MA1.vector": {
    interval: 500,
    data: () => ({ x: Math.random(), y: Math.random(), z: Math.random() }),
  },
};
const timers: Record<string, Pausable> = {};
export function useDeviceFaker(manager: GraphManager) {
  for (const [key, value] of Object.entries(deviceOptions)) {
    const d = manager.ctx.deviceList.find((x) => x.topic === key);
    if (d) {
      timers[key] = useIntervalFn(async () => {
        const newData = value.data();
        // console.log(key, newData);
        manager.updateDevice({ deviceId: d.id, data: value.data() });
      }, value.interval);
    }
  }
  const pauseAll = () => {
    for (const p of Object.values(timers)) {
      p.pause();
    }
  };
  const resumeAll = () => {
    for (const p of Object.values(timers)) {
      p.resume();
    }
  };
  return { timers, pauseAll, resumeAll };
}
