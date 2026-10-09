import type { Pausable } from "@vueuse/core";
import type { GraphManager } from "~/GraphManager";
import type { DeviceType } from "~/server/trpc/routers/devices";

const noise = (amount: number) => (Math.random() - 0.5) * 2 * amount;
// a machining cycle: ramp up, cut, ramp down, idle. 0 at rest, 1 at full load
const cycle = (periodMs: number) => {
  const t = (Date.now() % periodMs) / periodMs;
  if (t < 0.1) return t / 0.1;
  if (t < 0.7) return 1;
  if (t < 0.8) return (0.8 - t) / 0.1;
  return 0;
};

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
  "UK.SHF.BLD.humidity": {
    interval: 2000,
    data: () => 45 + Math.sin(Date.now() / 6e4) * 6 + noise(0.5),
  },
  "UK.SHF.BLD.Cell1.MA1.rpm": {
    interval: 250,
    data: () => cycle(30000) * 8000 + noise(40),
  },
  "UK.SHF.BLD.Cell1.MA1.torque": {
    interval: 250,
    data: () => cycle(30000) * 42 + Math.abs(noise(4)),
  },
  "UK.SHF.BLD.Cell1.MA1.feed": {
    interval: 500,
    data: () => cycle(30000) * 1200 + noise(15),
  },
  "UK.SHF.BLD.Cell1.MA1.coolant": {
    interval: 1000,
    data: () => (cycle(30000) > 0 ? 18 : 2) + noise(0.6),
  },
  "UK.SHF.BLD.Cell1.MA1.vibration": {
    interval: 100,
    data: () => {
      const load = 0.05 + cycle(30000) * 0.6;
      const t = Date.now() / 1e3;
      return {
        x: Math.sin(t * 9) * load + noise(0.03),
        y: Math.sin(t * 13 + 1) * load * 0.7 + noise(0.03),
        z: Math.sin(t * 5 + 2) * load * 0.4 + noise(0.02),
      };
    },
  },
  "UK.SHF.BLD.Cell1.MA2.power": {
    interval: 1000,
    data: () => 250 + cycle(45000) * 900 + noise(30),
  },
  "UK.SHF.BLD.Cell1.MA2.heat": {
    interval: 500,
    data: () => 24 + cycle(45000) * 38 + noise(0.4),
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
