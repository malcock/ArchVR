import { prisma } from "./prisma";

class ConfigService {
  getWidgetTypes() {
    return prisma.widgetType.findMany();
  }
}

export default new ConfigService();
