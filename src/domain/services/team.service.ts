import { Request, Response, NextFunction } from "express";
import { teamOdm } from "../odm/team.odm";

export const getTeams = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    

    // Ternario que se queda con el parametro si llega
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const teams = await teamOdm.getAllTeams(page, limit);

    // Num total de elementos
    const totalElements = await teamOdm.getTeamCount();

    const response = {
      totalItems: totalElements,
      totalPages: Math.ceil(totalElements / limit),
      currentPage: page,
      data: teams,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const getTeamById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const teamIdToShow = req.params.id;

    // Only for admins and managers
    if (req.user.rol !== "ADMIN" && req.user.rol !== "MANAGER") {
      res.status(401).json({ error: "No tienes autorización para hacer esto" });
      return;
    }

    const team = await teamOdm.getTeamById(teamIdToShow);

    if (team) {
      res.json(team);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
};

export const createTeam = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Only for admins
    if (req.user.rol !== "ADMIN") {
      res.status(401).json({ error: "No tienes autorización para hacer esto" });
      return;
    }

    const createdTeam = await teamOdm.createTeam(req.body);
    res.status(201).json(createdTeam);
  } catch (error) {
    next(error);
  }
};

export const deleteTeam = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Only for admins
    if (req.user.rol !== "ADMIN") {
      res.status(401).json({ error: "No tienes autorización para hacer esto" });
      return;
    }

    const id = req.params.id;
    const teamDeleted = await teamOdm.deleteTeam(id);
    if (teamDeleted) {
      res.json(teamDeleted);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
};

export const updateTeam = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Only for admins
    if (req.user.rol !== "ADMIN") {
      res.status(401).json({ error: "No tienes autorización para hacer esto" });
      return;
    }

    const id = req.params.id;
    const teamToUpdate = await teamOdm.getTeamById(id);
    if (teamToUpdate) {
      Object.assign(teamToUpdate, req.body);
      const teamSaved = await teamToUpdate.save();
      res.json(teamSaved);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
};

export const teamService = {
  getTeams,
  getTeamById,
  createTeam,
  deleteTeam,
  updateTeam,
};
