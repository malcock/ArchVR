import { Prisma, Scene } from "@prisma/client";
import { db } from "../utils/db";
import { NodeTransform } from "../types/Transform";

class SceneService {
  create(name: string, projectId: string) {
    return db.scene.create({
      data: {
        projectId,
        name,
        Nodes: {
          create: {
            name: "Root",
          },
        },
      },
    });
  }

  update(data: Scene, sceneId: string) {
    return db.scene.update({
      where: {
        id: sceneId,
      },
      data,
    });
  }

  get(id: string) {
    return db.scene
      .findUniqueOrThrow({
        where: {
          id,
        },
        include: {
          Nodes: {
            include: {
              File: true,
            },
          },
        },
      })
      .then((res) => {
        return res;
      });
  }

  count(
    projectId: string | undefined = undefined,
    name: string | undefined = undefined
  ) {
    return db.scene.count({
      where: {
        ...(projectId && { projectId }),
        ...(name && {
          name: {
            contains: name,
          },
        }),
      },
    });
  }

  list(
    projectId: string,
    name: string | undefined = undefined,
    take: number = 10,
    skip: number = 0,
    orderBy:
      | Prisma.Enumerable<Prisma.SceneOrderByWithRelationInput>
      | undefined = undefined
  ) {
    return db.scene.findMany({
      where: {
        projectId,
        ...(name && { name: { contains: name } }),
      },
      take,
      skip,
      orderBy,
    });
  }

  addNode(
    sceneId: string,
    name: string,
    transform?: string | NodeTransform,
    parentId?: string,
    fileId?: string
  ) {
    console.log("I MADE A NODE!");
    return db.node
      .create({
        data: {
          name,
          parentId,
          sceneId,
          fileId,
          ...(transform && {
            transform:
              typeof transform === "string" || transform instanceof String
                ? (transform as string)
                : transform.toJson(),
          }),
        },
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

const sceneService = new SceneService();

export default sceneService;
