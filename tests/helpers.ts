import { readFileSync, existsSync, readdirSync } from "fs";
import { resolve } from "path";

export const ROOT = resolve(import.meta.dirname, "..");

export const readFile = (path: string): string => readFileSync(path, "utf-8");

export const fileExists = (path: string): boolean => existsSync(path);

export const listDir = (path: string): string[] =>
  readdirSync(path, { recursive: false }) as string[];
