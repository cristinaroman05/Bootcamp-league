
import { User, IUserCreate, ROL } from "../domain/entities/user.entity";
import { Team, ITeamCreate } from "../domain/entities/team.entity";
import { mongoConnect } from "../domain/repositories/mongo-repository";
import bcrypt from "bcrypt";

// Mock data for users
const usersData: Array<Omit<IUserCreate, "team"> & { team: string; }> = [
  {
    email: "cristina@gmail.com",
    password: "12345678",
    firstName: "Cristina",
    lastName: "Roman",
    team: "Real Madrid",
    rol: ROL.PLAYER,
  },
  {
    email: "maria@gmail.com",
    password: "password1",
    firstName: "Maria",
    lastName: "Gomez",
    team: "Sevilla FC",
    rol: ROL.MANAGER,
  },
  {
    email: "john@gmail.com",
    password: "password2",
    firstName: "John",
    lastName: "Doe",
    team: "Betis",
    rol: ROL.ADMIN,

  },
  {
    email: "jane@gmail.com",
    password: "password3",
    firstName: "Jane",
    lastName: "Smith",
    team: "Atletico",
  },
  {
    email: "lucas@gmail.com",
    password: "password4",
    firstName: "Lucas",
    lastName: "Brown",
    team: "Real Madrid",
  },
  {
    email: "ana@gmail.com",
    password: "password5",
    firstName: "Ana",
    lastName: "Lopez",
    team: "Barcelona",
  },
  {
    email: "mike@gmail.com",
    password: "password6",
    firstName: "Mike",
    lastName: "Wilson",
    team: "Getafe",
  },
  {
    email: "sara@gmail.com",
    password: "password7",
    firstName: "Sara",
    lastName: "Johnson",
    team: "Murcia",
  },
  {
    email: "david@gmail.com",
    password: "password8",
    firstName: "David",
    lastName: "Pérez",
    team: "Paris Saint-Germain",
  },
  {
    email: "emma@gmail.com",
    password: "password9",
    firstName: "Emma",
    lastName: "Taylor",
    team: "Paris Saint-Germain",
  },
];
// Mock data for teams
const teamsData: ITeamCreate[] = [
  
  { name: "Betis", alias: "Verdiblancos", players: [] },
  { name: "Atlético", alias: "Colchoneros", players: [] },
  { name: "Real Madrid", alias: "Merengues", players: [] },
  { name: "Barcelona", alias: "Culés", players: [] },
  { name: "Sevilla FC", alias: "Sevillistas", players: [] },
  { name: "Getafe", alias: "Azulones", players: [] },
  { name: "Murcia", alias: "Pimentoneros", players: [] },
  { name: "Paris Saint-Germain", alias: "Les Parisiens", players: [] },
];
const seedDatabase = async (): Promise<void> => {
  await mongoConnect();
  try {
    // Limpiar las colecciones
    await User.deleteMany({});
    await Team.deleteMany({});
    // Insert teams
    const createdTeams = await Team.insertMany(teamsData);
    // Dictionary for teams
    const teamsDict: Record<string, any> = createdTeams.reduce((acc: Record<string, any>, team) => {
      acc[team.name] = team._id;
      return acc;
    }, {});
    // Encriptar contraseñas antes de insertar usuarios
    const saltRounds = 10;
    const usersWithTeamIds = await Promise.all(
      usersData.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);
        return {
          ...user,
          password: hashedPassword,
          team: teamsDict[user.team],
        };
      })
    );
    const createdUsers = await User.insertMany(usersWithTeamIds);
    // Update teams with created users
    for (const user of createdUsers) {
      await Team.findByIdAndUpdate(user.team, { $push: { players: user._id } });
    }
    console.log("Database seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database", error);
    process.exit(1);
  }
};
void seedDatabase();