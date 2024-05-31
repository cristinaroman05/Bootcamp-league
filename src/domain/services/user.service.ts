import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import { generateToken } from "../../utils/token";
import { userOdm } from "../odm/user.odm";

export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let response = {};
    const totalElements = await userOdm.getUserCount();
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const user = await userOdm.getUserById(req.user.id);
    const freeUsers = (await userOdm.getFreeUsers(page, limit)) || [];
    const usersWithTeam = (await userOdm.getBusyUsers(page, limit)) || [];
    const teamUsers = (await userOdm.getTeamUsers(page, limit, user?.toObject().team)) || [];
    response = {
      totalItems: req.user.rol === "ADMIN" ? totalElements : req.user.rol === "MANAGER" ? teamUsers.length + freeUsers.length : teamUsers.length,
      totalPages: Math.ceil(totalElements / limit),
      currentPage: page,
      data: req.user.rol === "ADMIN" ? { usersWithTeam, freeUsers } : req.user.rol === "MANAGER" ? { teamUsers, freeUsers } : { teamUsers },
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userIdToShow = req.params.id;

    // Only for admins and same users
    if (req.user.rol !== "ADMIN" && req.user.id !== userIdToShow) {
      res.status(401).json({ error: "No tienes autorización para hacer esto" });
      return;
    }

    const user = await userOdm.getUserById(userIdToShow);

    if (user) {
      const temporalUser = user.toObject();
      res.json(temporalUser);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const createdUser = await userOdm.createUser({ ...req.body, rol: "PLAYER" });
    res.status(201).json(createdUser);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Only for admins
    if (req.user.rol !== "ADMIN") {
      res.status(401).json({ error: "No tienes autorización para hacer esto" });
      return;
    }

    const id = req.params.id;
    const userDeleted = await userOdm.deleteUser(id);
    if (userDeleted) {
      res.json(userDeleted);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id;
    const userToUpdate = await userOdm.getUserById(id);
    const userRequester = await userOdm.getUserById(req.user.id);
    let data = {};
    if (userToUpdate) {
      if (req.user.rol === "ADMIN") {
        data = req.body;
      } else if (req.user.rol === "MANAGER" && req.user.id !== id) {
        if (userRequester?.toObject().team?._id?.toString() === userToUpdate.toObject().team?._id?.toString()) {
          data = { team: null };
        } else if (userToUpdate.toObject().team === null) {
          data = { team: userRequester?.toObject().team };
        }
      } 
      Object.assign(userToUpdate, data);
      await userToUpdate.save();
      // Quitamos pass de la respuesta
      const userToSend: any = userToUpdate.toObject();
      delete userToSend.password;
      res.json(userToSend);
    } else {
      res.status(404).json({ error: "Usuario no encontrado" });
    }
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Se deben especificar los campos email y password" });
      return;
    }

    const user: any = await userOdm.getUserByEmailWithPassword(email);
    if (!user) {
      res.status(401).json({ error: "Email y/o contraseña incorrectos" });
      return;
    }

    // Comprueba la pass
    const userPassword: string = user.password;
    const match = await bcrypt.compare(password, userPassword);

    if (!match) {
      res.status(401).json({ error: "Email y/o contraseña incorrectos" });
      return;
    }

    // Generamos token JWT
    const jwtToken = generateToken(user._id.toString(), user.email);

    const userToSend = user.toObject();
    delete userToSend.password;

    res.status(200).json({
      token: jwtToken,
      user: userToSend,
    });
  } catch (error) {
    next(error);
  }
};

export const userService = {
  getUsers,
  getUserById,
  createUser,
  deleteUser,
  updateUser,
  login,
};
