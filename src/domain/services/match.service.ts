/* eslint-disable no-unmodified-loop-condition */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import { Request, Response, NextFunction } from "express";
import { matchOdm } from "../odm/match.odm";
import { teamOdm } from "../odm/team.odm";
import { IMatchCreate } from "../entities/match.entity";
import { IClassificationCreate } from "../entities/classification.entity";
import { classificationOdm } from "../odm/classification.odm";

export const getMatches = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Only for admins
    if (req.user.rol !== "ADMIN") {
      res.status(401).json({ error: "No tienes autorización para hacer esto" });
      return;
    }

    // Ternario que se queda con el parametro si llega
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const matches = await matchOdm.getAllMatches();

    // Num total de elementos
    const totalElements = await matchOdm.getMatchCount();

    const response = {
      totalItems: totalElements,
      totalPages: Math.ceil(totalElements / limit),
      currentPage: page,
      data: matches,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const getMatchById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const matchIdToShow = req.params.id;

    // Only for admins
    if (req.user.rol !== "ADMIN") {
      res.status(401).json({ error: "No tienes autorización para hacer esto" });
      return;
    }

    const match = await matchOdm.getMatchById(matchIdToShow);

    if (match) {
      res.json(match);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
};

export const createMatch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Only for admins
    if (req.user.rol !== "ADMIN") {
      res.status(401).json({ error: "No tienes autorización para hacer esto" });
      return;
    }

    const team = await teamOdm.getAllNameTeams();
    /* const response = {
      data: team,
    }; */

    const teams: any[] = [];

    // Iterar sobre los objetos
    team.forEach((objeto) => {
      // Acceder a las propiedades del objeto
      const id = objeto._id;
      teams.push(id);

      // Hacer algo con los datos...
    });

    const orderTeam = [...teams];

    for (let i = orderTeam.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      [orderTeam[i], orderTeam[j]] = [orderTeam[j], orderTeam[i]];
    }

    const matchForEveryTeam = [];
    const firstLeg = [];
    const secondLeg = [];
    const firstLegRounds: any[] = [];
    const secondLegRounds: any[] = [];
    let actRound: string | any[] = [];
    let firstLegRound = 1;
    let secondLegRound = orderTeam.length;
    const fecha = new Date(2023, 7 - 1, 25);

    for (let i = 0; i < orderTeam.length; i++) {
      for (let j = 0; j < orderTeam.length; j++) {
        if (i !== j) {
          matchForEveryTeam.push([orderTeam[i], orderTeam[j]]);
        }
      }
    }

    for (let i = 0; i < matchForEveryTeam.length; i++) {
      if (i % 2 === 0) {
        firstLeg.push(matchForEveryTeam[i]);
      } else {
        secondLeg.push(matchForEveryTeam[i]);
      }
    }

    const namesSet = new Set<string>();

    for (let i = firstLeg.length - 1; i >= 0; i--) {
      const index = Math.floor(Math.random() * firstLeg.length);

      const matchToOrder = firstLeg[index];

      if (!namesSet.has(matchToOrder[0]) && !namesSet.has(matchToOrder[1]) && !actRound.includes(firstLeg[index]) && !firstLegRounds.includes(firstLeg[index])) {
        actRound.push(firstLeg[index]);
        namesSet.add(matchToOrder[0]);
        namesSet.add(matchToOrder[1]);
        const score = "No disputado";
        const numActRound = firstLegRound;
        const year = fecha.getFullYear();
        const month = fecha.getMonth();
        const day = fecha.getDate();

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const match: IMatchCreate = {
          localTeam: matchToOrder[0],
          awayTeam: matchToOrder[1],
          score,
          round: numActRound,
          winner: "",
          matchDate: `${day}/${month}/${year}`,
        };
        await matchOdm.createMatch(match);
      } else {
        i++;
      }

      console.log("Jornada Actual");
      console.log(actRound);

      if (actRound.length === orderTeam.length / 2) {
        firstLegRounds.push(actRound);
        actRound = [];
        namesSet.clear();
        fecha.setDate(fecha.getDate() + 7);
        firstLegRound++;
      }
    }

    for (let i = secondLeg.length - 1; i >= 0; i--) {
      const index = Math.floor(Math.random() * secondLeg.length);

      const matchToOrder = secondLeg[index];

      if (!namesSet.has(matchToOrder[0]) && !namesSet.has(matchToOrder[1]) && !actRound.includes(firstLeg[index]) && !firstLegRounds.includes(firstLeg[index])) {
        actRound.push(firstLeg[index]);
        namesSet.add(matchToOrder[0]);
        namesSet.add(matchToOrder[1]);
        const score = "No disputado";
        const numActRound = secondLegRound;
        const year = fecha.getFullYear();
        const month = fecha.getMonth();
        const day = fecha.getDate();

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const match: IMatchCreate = {
          localTeam: matchToOrder[0],
          awayTeam: matchToOrder[1],
          score,
          round: numActRound,
          winner: "",
          matchDate: `${day}/${month}/${year}`,
        };
        await matchOdm.createMatch(match);
      } else {
        i++;
      }

      console.log("Jornada Actual");
      console.log(actRound);

      if (actRound.length === orderTeam.length / 2) {
        secondLegRounds.push(actRound);
        actRound = [];
        namesSet.clear();
        fecha.setDate(fecha.getDate() + 7);
        secondLegRound++;
      }
    }

    for (let i = 0; i < teams.length; i++) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const classification: IClassificationCreate = {
        team: teams[i],
        points: 0,
        matchPlayed: 0,
        matchWin: 0,
        matchDraw: 0,
        matchLost: 0,
        goalsScored: 0,
        goalsAgainst: 0,
      };

      await classificationOdm.createClassification(classification);
    }
    res.status(201).json();
  } catch (error) {
    next(error);
  }
};

export const deleteMatch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Only for admins
    if (req.user.rol !== "ADMIN") {
      res.status(401).json({ error: "No tienes autorización para hacer esto" });
      return;
    }

    const id = req.params.id;
    const matchDeleted = await matchOdm.deleteMatch(id);
    if (matchDeleted) {
      res.json(matchDeleted);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
};

export const updateMatch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Only for admins
    if (req.user.rol !== "ADMIN") {
      res.status(401).json({ error: "No tienes autorización para hacer esto" });
      return;
    }

    const id = req.params.id;
    const matchToUpdate = await matchOdm.getMatchById(id);
    if (matchToUpdate) {
      Object.assign(matchToUpdate, req.body);
      const matchSaved = await matchToUpdate.save();
      res.json(matchSaved);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
};

export const matchService = {
  getMatches,
  getMatchById,
  createMatch,
  deleteMatch,
  updateMatch,
};
