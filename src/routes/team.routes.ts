import express from "express";
import { teamService } from "../domain/services/team.service";
import { isAuth } from "../utils/auth.middleware";

// Router propio de usuarios
export const teamRouter = express.Router();

teamRouter.get("/", isAuth, teamService.getTeams);
teamRouter.get("/:id", isAuth, teamService.getTeamById);
teamRouter.post("/", isAuth, teamService.createTeam);
teamRouter.delete("/:id", isAuth, teamService.deleteTeam);
teamRouter.put("/:id", isAuth, teamService.updateTeam);
