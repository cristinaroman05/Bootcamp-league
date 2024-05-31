enum CUSTOM_ROL {
  "PLAYER" = "PLAYER",
  "MANAGER" = "MANAGER",
  "ADMIN" = "ADMIN",
}

declare namespace Express {
  export interface Request {
    user: {
      rol: CUSTOM_ROL;
      id: string;
    };
  }
}
