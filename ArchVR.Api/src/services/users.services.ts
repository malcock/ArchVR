import { hashSync } from "bcrypt";
import { db } from "../utils/db";

class UserService {
  findUserByEmail(email: string) {
    return db.user.findUnique({
      where: {
        email,
      },
      include: {
        Organisations: true,
      },
    });
  }

  findUserById(id: string) {
    return db.user.findUnique({
      where: {
        id,
      },
      include: {
        Organisations: true,
      },
    });
  }

  createUserByEmailAndPassword(user: { email: string; password: string }) {
    user.password = hashSync(user.password, 12);
    return db.user.create({
      data: user,
    });
  }
}

const userService = new UserService();

export default userService;
