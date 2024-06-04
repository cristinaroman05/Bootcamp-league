import { mongoConnect } from "../src/domain/repositories/mongo-repository";
import mongoose from "mongoose";
import { appInstance } from "../src/index";
import request from "supertest";
import { IUserCreate, User, ROL } from "../src/domain/entities/user.entity";
import { app } from "../src/server";

describe("User controller", () => {
  const adminUserMock: IUserCreate = {
    email: "admin@mail.com",
    password: "12345678",
    firstName: "SUPER",
    lastName: "ADMIN",
    rol: ROL.ADMIN,
  };

  const managerUserMock: IUserCreate = {
    email: "manager1@mail.com",
    password: "12345678",
    firstName: "Manager",
    lastName: "Number 1",
    rol: ROL.MANAGER,
  };

  const playerUserMock: IUserCreate = {
    email: "player1@mail.com",
    password: "12345678",
    firstName: "Player",
    lastName: "Number 1",
  };

  let adminToken: string;
  let managerToken: string;
  let playerToken: string;
  let createdUserId: string;

  beforeAll(async () => {
    await mongoConnect();
    await User.collection.drop();
    await new User(adminUserMock).save();
    await new User(managerUserMock).save();
    await new User(playerUserMock).save();
    console.log("Eliminados todos los usuarios");
  });

  afterAll(async () => {
    await mongoose.connection.close();
    appInstance.close();
  });

  it("POST /user/login", async () => {
    // WRONG LOGIN -> 401
    const wrongCredentials = { email: adminUserMock.email, password: "NOT VALID" };
    const wrongResponse = await request(app).post("/user/login").send(wrongCredentials).expect(401);
    expect(wrongResponse.body.token).toBeUndefined();

    // MANAGER LOGIN OK -> 200
    const managerCredential = { email: managerUserMock.email, password: managerUserMock.password };
    const managerResponse = await request(app).post("/user/login").send(managerCredential).expect(200);
    expect(managerResponse.body.token).toBeDefined();
    managerToken = managerResponse.body.token;

    // ADMIN LOGIN OK -> 200
    const adminCredentials = { email: adminUserMock.email, password: adminUserMock.password };
    const adminResponse = await request(app).post("/user/login").send(adminCredentials).expect(200);
    expect(adminResponse.body.token).toBeDefined();
    adminToken = adminResponse.body.token;

    // PLAYER LOGIN OK -> 200
    const playerCredentials = { email: playerUserMock.email, password: playerUserMock.password };
    const playerResponse = await request(app).post("/user/login").send(playerCredentials).expect(200);
    expect(playerResponse.body.token).toBeDefined();
    playerToken = playerResponse.body.token;
  });

  it("POST /user", async () => {
    const userToCreate = { ...playerUserMock, email: "player2@mail.com" };

    // Logged with admin -> 201
    const response = await request(app).post("/user").send(userToCreate).expect(201);
    expect(response.body).toHaveProperty("_id");
    expect(response.body.email).toBe(userToCreate.email);
    expect(response.body.firstName).toBe(userToCreate.firstName);
    expect(response.body.lastName).toBe(userToCreate.lastName);

    createdUserId = response.body._id;
  });

  it("GET /user", async () => {
    // Not logged -> 401
    await request(app).get("/user").expect(401);

    // Logged with player -> 200
    const playerResponse = await request(app).get("/user").set("Authorization", `Bearer ${playerToken}`).expect(200);
    expect(playerResponse.body.data?.teamUsers?.length).toBeDefined();

    // Logged with manager -> 200
    const managerResponse = await request(app).get("/user").set("Authorization", `Bearer ${managerToken}`).expect(200);
    expect(managerResponse.body.data?.teamUsers?.length).toBeDefined();
    expect(managerResponse.body.data?.freeUsers?.length).toBeDefined();

    // Logged with admin -> 200
    const adminResponse = await request(app).get("/user").set("Authorization", `Bearer ${adminToken}`).expect(200);
    expect(adminResponse.body.data?.usersWithTeam?.length).toBeDefined();
    expect(adminResponse.body.data?.freeUsers?.length).toBeDefined();
  });

  it("GET /user/:id", async () => {
    // Not logged -> 401
    await request(app).get(`/user/${createdUserId}`).expect(401);

    // Logged with manager -> 401
    const managerResponse = await request(app).get(`/user/${createdUserId}`).set("Authorization", `Bearer ${managerToken}`).expect(401);
    expect(managerResponse.body.error).toBeDefined();

    // Logged with admin -> 200
    const adminResponse = await request(app).get(`/user/${createdUserId}`).set("Authorization", `Bearer ${adminToken}`).expect(200);
    expect(adminResponse.body.firstName).toBeDefined();
  });

  it("PUT /user/id", async () => {
    const updatedData = { firstName: "MODIFIED" };

    // Not logged -> 401
    await request(app).put(`/user/${createdUserId}`).send(updatedData).expect(401);

    // Logged with admin -> 200
    const adminResponse = await request(app).put(`/user/${createdUserId}`).send(updatedData).set("Authorization", `Bearer ${adminToken}`).expect(200);
    expect(adminResponse.body.firstName).toBe(updatedData.firstName);
  });

  it("DELETE /user/id", async () => {
    // Not logged -> 401
    await request(app).delete(`/user/${createdUserId}`).expect(401);

    // Logged with manager -> 401
    await request(app).delete(`/user/${createdUserId}`).set("Authorization", `Bearer ${managerToken}`).expect(401);

    // Logged with admin -> 200
    const adminResponse = await request(app).delete(`/user/${createdUserId}`).set("Authorization", `Bearer ${adminToken}`).expect(200);
    expect(adminResponse.body._id).toBe(createdUserId);
  });
});
