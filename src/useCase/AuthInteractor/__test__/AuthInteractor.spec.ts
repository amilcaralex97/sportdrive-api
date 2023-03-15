import { Mockgoose } from "mockgoose";
import mongoose, { Model } from "mongoose";
import * as argon2 from "argon2";
import * as jsonwebtoken from "jsonwebtoken";

import { AuthInteractor } from "../AuthInteractor";
import { authMocks } from "./mocks";
import { UserController } from "../../../controller/UserController/UserController";
import { userMocks } from "../../../controller/UserController/__test__/mocks";
import { IUser } from "../../../controller/UserController/UserControllerTypes";
import { userSchema } from "../../../entity/User";

let mockgoose: Mockgoose = new Mockgoose(mongoose);
let db: typeof mongoose;

describe("AuthInteractor", () => {
  let authInteractor: AuthInteractor;
  let userController: UserController;
  let userModel: Model<IUser>;

  let userId = userMocks.createMockUser().userId;
  let mockUser = { ...userMocks.createMockUser(), userId };

  const event = authMocks.mockAPIGatewayEvent({
    body: JSON.stringify(mockUser),
  });
  const mockReq = { ...userMocks.createMockUserRequest(), userId };

  beforeAll(async () => {
    await mockgoose.prepareStorage();
    db = await mongoose.connect("mongodb://foobar/baz", {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 120000,
    });
    userModel = db.model<IUser, mongoose.Model<IUser>>("User", userSchema);
    authInteractor = new AuthInteractor(event, db);
    userController = new UserController(mockReq, db);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await db.connection.close(); //shutdown fix
    await mockgoose.shutdown();
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

      userModel.findOne = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockUser),
        }),
      });
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
  });
});
