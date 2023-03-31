import mongoose, { Model } from "mongoose";
import * as argon2 from "argon2";
import * as jsonwebtoken from "jsonwebtoken";
import { MongoMemoryServer } from "mongodb-memory-server";

import { AuthInteractor } from "../AuthInteractor";
import { authMocks } from "./mocks";
import { userMocks } from "../../../controller/UserController/__test__/mocks";
import { IUser } from "../../../controller/UserController/UserControllerTypes";
import { userSchema } from "../../../entity/User";
import { UserController } from "../../../controller/UserController/userController";
import { RoleController } from "../../../controller/RoleController/roleController";
import { IRole, Role, roleSchema } from "../../../entity/Role";
import { roleMocks } from "../../../controller/RoleController/__test__/mocks";

let db: typeof mongoose;
let mongod: MongoMemoryServer;

describe("AuthInteractor", () => {
  let authInteractor: AuthInteractor;
  let userController: UserController;
  let userModel: Model<IUser>;
  let roleController: RoleController;
  let roleModel: Model<IRole>;

  let userId = userMocks.createMockUser().userId;
  const mockReq = { ...userMocks.createMockUserRequest(), userId };
  let mockUser = { ...userMocks.createMockUser(), userId };

  let roleId = roleMocks.createRandomRoleReq().roleId;
  const roleMockReq = { ...roleMocks.createRandomRoleReq(), roleId };

  const event = authMocks.mockAPIGatewayEvent({
    body: JSON.stringify(mockUser),
  });

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const mongoUri = mongod.getUri();
    db = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 1000,
      connectTimeoutMS: 500,
    });

    userModel = db.model<IUser, mongoose.Model<IUser>>("User", userSchema);
    roleModel = db.model<IRole, mongoose.Model<IRole>>("Role", roleSchema);

    authInteractor = new AuthInteractor(event, db);
    userController = new UserController(mockReq, db);
    roleController = new RoleController({}, db);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await db.connection.close(); //shutdown fix
    await mongod.stop();
  });

  let jsonwebtokenSpy: jest.SpyInstance;
  let argon2Spy: jest.SpyInstance;
  describe("signIn", () => {
    beforeEach(() => {
      argon2Spy = jest
        .spyOn(argon2, "verify")
        .mockImplementation(() => Promise.resolve(true));

      jsonwebtokenSpy = jest
        .spyOn(jsonwebtoken, "sign")
        .mockImplementation(() => "jwt_token");

      userController.fetchUserByUsername = jest
        .fn()
        .mockResolvedValue(mockUser);

      userController.fetchUsers = jest.fn().mockResolvedValue([]);

      userModel.findOne = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockUser),
        }),
      });

      userModel.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([]),
        }),
      });

      roleModel.prototype.save = jest.fn().mockReturnValue({});
      userModel.prototype.save = jest
        .fn()
        .mockReturnValue({ ...mockUser, password: "hashed-password" });
    });

    it("should return a jwt token and a userId when sign in successfully", async () => {
      const result = await authInteractor.signIn();
      expect(result).toEqual({
        token: "jwt_token",
        userId: mockUser.userId,
        status: 200,
        message: "Login exitoso",
      });
    });
    it("should return 401 when password is invalid", async () => {
      argon2Spy.mockReturnValue(false);
      const result = await authInteractor.signIn();
      expect(result).toEqual({
        status: 401,
        message: "Contraseña o Usuario Inválidos",
      });
    });

    it("should return 500 when fetching user fails", async () => {
      userModel.findOne = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockRejectedValue({ error: "error" }),
        }),
      });
      const result = await authInteractor.signIn();
      expect(result).toEqual({ status: 500, message: "Error en login" });
    });

    it("Should seed an user in case there are no users in the db", async () => {
      process.env.SEED_USERNAME = "seedUserTest";
      process.env.SEED_PASSWORD = "seedPasswordTest";
      process.env.SEED_ROLENAME = "seedRoleTest";
      process.env.SEED_ROLEACCESS = "8";

      userController = new UserController(
        {
          ...mockReq,
          userId,
          userName: process.env.SEED_USERNAME,
          password: process.env.SEED_PASSWORD,
        },
        db
      );

      userController.createUser = jest.fn().mockReturnValueOnce({
        message: "User creado exitosamente",
        user: {
          ...mockReq,
          userId,
          userName: process.env.SEED_USERNAME,
          password: process.env.SEED_PASSWORD,
        },
        status: 200,
      });

      roleController = new RoleController(
        {
          ...roleMockReq,
          roleId,
          roleName: process.env.SEED_ROLENAME,
          userAccess: parseInt(process.env.SEED_ROLEACCESS),
          receiptAccess: parseInt(process.env.SEED_ROLEACCESS),
        },
        db
      );

      roleController.createRole = jest.fn().mockReturnValueOnce({
        message: "Rol creado exitosamente",
        role: {
          ...roleMockReq,
          roleId,
          roleName: process.env.SEED_ROLENAME,
          userAccess: parseInt(process.env.SEED_ROLEACCESS),
          receiptAccess: parseInt(process.env.SEED_ROLEACCESS),
        },
        status: 200,
      });

      const result = await authInteractor.signIn();
      expect(result).toEqual({
        token: "jwt_token",
        userId: mockUser.userId,
        status: 200,
        message: "Login exitoso",
      });
    });

    it("Should return an error in case seeding the user fails", async () => {
      roleModel.prototype.save = jest.fn().mockRejectedValueOnce({});
      userModel.prototype.save = jest
        .fn()
        .mockRejectedValueOnce({ ...mockUser, password: "hashed-password" });

      process.env.SEED_USERNAME = "seedUserTest";
      process.env.SEED_PASSWORD = "seedPasswordTest";
      process.env.SEED_ROLENAME = "seedRoleTest";
      process.env.SEED_ROLEACCESS = "8";

      userController = new UserController(
        {
          ...mockReq,
          userId,
          userName: process.env.SEED_USERNAME,
          password: process.env.SEED_PASSWORD,
        },
        db
      );

      userController.createUser = jest.fn().mockRejectedValueOnce({
        message: "Error al crear el usuario",
        status: 500,
      });

      roleController = new RoleController(
        {
          ...roleMockReq,
          roleId,
          roleName: process.env.SEED_ROLENAME,
          userAccess: parseInt(process.env.SEED_ROLEACCESS),
          receiptAccess: parseInt(process.env.SEED_ROLEACCESS),
        },
        db
      );

      roleController.createRole = jest.fn().mockRejectedValueOnce({
        message: "Error al crear rol",
        status: 500,
      });

      const result = await authInteractor.signIn();
      expect(result).toEqual({
        message: "Error en login",
        status: 500,
      });
    });
  });
});
