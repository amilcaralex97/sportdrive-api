import { verify } from "argon2";
import mongoose from "mongoose";
import { APIGatewayEvent } from "aws-lambda";
import { sign, SignOptions } from "jsonwebtoken";

import {
  AuthInteractorInterface,
  SignInDTO,
  SignInRequest,
} from "./AuthInteractorTypes";
import {
  IUser,
  UserDTO,
} from "../../controller/UserController/UserControllerTypes";
import { eventParser } from "../../helpers/jsonHelper";
import { UserController } from "../../controller/UserController/userController";
import { parseEnv } from "../../helpers/envHelper";
import { RoleController } from "../../controller/RoleController/roleController";

export class AuthInteractor implements AuthInteractorInterface {
  private userController;
  private body: SignInRequest;
  private db: typeof mongoose;

  constructor(event: APIGatewayEvent, db: typeof mongoose) {
    this.userController = new UserController(eventParser(event), db);
    this.body = eventParser(event);
    this.db = db;
  }

  /**
   * signIn
   */
  public async signIn() {
    let res;
    try {
      if (process.env.SEED_USERNAME) {
        const users = await this.userController.fetchUsers();
        if (!users.users?.length) {
          res = await this.createSeedUser();
          if (res && res.user && res.status === 200) {
            return await this.loginValidator(res);
          }
          return { status: 500, message: "Error en login" };
        }
      }
      res = await this.userController.fetchUserByUsername();

      if (res && res.user) {
        return await this.loginValidator(res);
      }
    } catch (error) {
      return { status: 500, message: "Error en login" };
    }

    return { status: 500, message: "Error en login" };
  }

  /**
   * loginValidator
   */
  private async loginValidator(res: UserDTO): Promise<SignInDTO> {
    let jwtToken;
    try {
      const validPassword = await verify(
        res.user!.password,
        this.body.password
      );

      if (!validPassword) {
        return {
          status: 401,
          message: "Contraseña o Usuario Inválidos",
        };
      }

      jwtToken = this.generateToken(res.user!);

      return {
        token: jwtToken,
        userId: res.user!.userId,
        status: 200,
        message: "Login exitoso",
      };
    } catch (error) {
      return { status: 500, message: "Error en login" };
    }
  }

  /**
   * generateToken
   */
  private generateToken(user: IUser) {
    const signInOptions: SignOptions = {
      expiresIn: "8h",
    };

    return sign(
      { userId: user.userId },
      process.env.PRIVATE_KEY as string,
      signInOptions
    );
  }

  /**
   * verify
   */
  public verify() {
    try {
      return {
        status: 200,
        message: "Usuario Verificado",
        isVerified: true,
      };
    } catch (error) {
      return {
        status: 500,
        message: "Error en login",
        isVerified: false,
      };
    }
  }

  /**
   * verify
   */
  private async createSeedUser(): Promise<UserDTO> {
    try {
      const seedUser = await parseEnv();
      const seedRoleInstance = new RoleController(
        {
          roleName: seedUser["SEED_ROLENAME"],
          receiptAccess: parseInt(seedUser["SEED_ROLEACCESS"]),
          userAccess: parseInt(seedUser["SEED_ROLEACCESS"]),
        },
        this.db
      );

      const role = await seedRoleInstance.createRole();

      const seedUserInstance = new UserController(
        {
          userName: seedUser["SEED_USERNAME"],
          password: seedUser["SEED_PASSWORD"],
          name: seedUser["SEED_USERNAME"],
          roleId: role.role?.roleId!,
        },
        this.db
      );

      const user = await seedUserInstance.createUser();

      return user;
    } catch (error) {
      // Maneja el error lanzado por createUser
      console.error("Error al crear el usuario:", error);
      return {
        status: 500,
        message: "Error al crear el usuario",
      };
    }
  }
}
