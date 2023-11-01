import { Prisma, Device } from "@prisma/client";
import { db } from "../utils/db";
import * as bcrypt from "bcrypt";

import { nanoid } from "nanoid";

class DeviceService {
  async create(
    deviceName: string,
    deviceType: string,
    organisationId: string,
    sceneId?: string,
    transform?: string
  ) {
    const username = nanoid(12);

    return db.device.create({
      data: {
        username,
        name: deviceName,
        deviceType,
        organisationId,
        sceneId,
        transform,
      },
    });
  }

  async findDeviceByUsername(username: string) {
    return db.device.findFirstOrThrow({
      where: {
        username,
      },
    });
  }

  async generateCredentials(deviceId: string) {
    const password = nanoid(20);
    const device = await db.device.update({
      where: { id: deviceId },
      data: {
        password: bcrypt.hashSync(password, 12),
      },
    });

    return { username: device.username, password };
  }

  update(deviceId: string, data: Device) {
    return db.device.update({
      where: {
        id: deviceId,
      },
      data,
    });
  }

  get(id: string) {
    return db.device.findFirstOrThrow({
      where: {
        id,
      },
    });
  }

  delete(id: string) {
    return db.device.delete({
      where: {
        id,
      },
    });
  }

  count(
    organisationId: string | undefined = undefined,
    sceneId: string | undefined = undefined,
    name: string | undefined = undefined
  ) {
    return db.device.count({
      where: {
        ...(organisationId && { organisationId }),
        ...(sceneId && { sceneId }),
        ...(name && {
          name: {
            contains: name,
          },
        }),
      },
    });
  }

  list(
    organisationId: string | undefined = undefined,
    name: string | undefined = undefined,
    sceneId: string | undefined = undefined,
    take: number = 10,
    skip: number = 0,
    orderBy:
      | Prisma.Enumerable<Prisma.DeviceOrderByWithRelationInput>
      | undefined = undefined
  ) {
    return db.device.findMany({
      where: {
        ...(organisationId && { organisationId }),
        ...(name && {
          name: {
            contains: name,
          },
        }),
        ...(sceneId && { sceneId }),
      },
      take,
      skip,
      orderBy,
    });
  }
}

const deviceService = new DeviceService();

export default deviceService;
