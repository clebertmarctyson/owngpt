import { Role } from "@prisma/client";

export type ChatRequest = {
  content: string;
  model: string;
};

export type ChatResponse = {
  role: Role;
  content: string;
};

export type ApiError = {
  error: string;
};
