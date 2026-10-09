import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const widgetTypes = [
  { name: "Line", component: "line" },
  { name: "KPI", component: "kpi" },
  { name: "Statistics", component: "stats" },
  { name: "Vector chart", component: "multiline" },
  { name: "Histogram", component: "histogram" },
];

// topics must match the ones in src/components/editor/deviceFaker.ts
const devices = [
  { topic: "UK.SHF.BLD.ambient", name: "Ambient", deviceType: "temperature", unit: "°C", unitType: "number" },
  { topic: "UK.SHF.BLD.Cell1.MA1.spindle", name: "Spindle", deviceType: "position", unit: "", unitType: "number" },
  { topic: "UK.SHF.BLD.Cell1.MA1.heat", name: "Heat", deviceType: "temperature", unit: "°C", unitType: "number" },
  { topic: "UK.SHF.BLD.Cell1.MA1.power", name: "Power", deviceType: "power", unit: "W", unitType: "number" },
  { topic: "UK.SHF.BLD.Cell1.MA1.vector", name: "Vector", deviceType: "vector", unit: "", unitType: "vector3" },
  { topic: "UK.SHF.BLD.humidity", name: "Humidity", deviceType: "humidity", unit: "%", unitType: "number" },
  { topic: "UK.SHF.BLD.Cell1.MA1.rpm", name: "Spindle speed", deviceType: "speed", unit: "rpm", unitType: "number" },
  { topic: "UK.SHF.BLD.Cell1.MA1.torque", name: "Torque", deviceType: "torque", unit: "Nm", unitType: "number" },
  { topic: "UK.SHF.BLD.Cell1.MA1.feed", name: "Feed rate", deviceType: "speed", unit: "mm/min", unitType: "number" },
  { topic: "UK.SHF.BLD.Cell1.MA1.coolant", name: "Coolant flow", deviceType: "flow", unit: "L/min", unitType: "number" },
  { topic: "UK.SHF.BLD.Cell1.MA1.vibration", name: "Vibration", deviceType: "acceleration", unit: "g", unitType: "vector3" },
  { topic: "UK.SHF.BLD.Cell1.MA2.power", name: "Power", deviceType: "power", unit: "W", unitType: "number" },
  { topic: "UK.SHF.BLD.Cell1.MA2.heat", name: "Heat", deviceType: "temperature", unit: "°C", unitType: "number" },
];

for (const wt of widgetTypes) {
  const existing = await prisma.widgetType.findFirst({ where: { component: wt.component } });
  if (!existing) await prisma.widgetType.create({ data: wt });
}

// devices belong to a project, so give every project the faked set
for (const project of await prisma.project.findMany({ select: { id: true } })) {
  for (const d of devices) {
    const existing = await prisma.device.findFirst({ where: { projectId: project.id, topic: d.topic } });
    if (!existing) await prisma.device.create({ data: { ...d, projectId: project.id } });
  }
}

await prisma.$disconnect();
