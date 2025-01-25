// src/utils/index.ts

import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export function checkDirAndCreate(dirPath: string): void {
  const absolutePath = join(process.cwd(), dirPath);

  if (!existsSync(absolutePath)) {
    mkdirSync(absolutePath, { recursive: true });
    console.log(`Directory created at ${absolutePath}`);
  } else {
    console.log(`Directory already exists at ${absolutePath}`);
  }
}
export const responseMessage = {
  success: (message: string, data?: object) => ({
    status: 'success',
    message,
    data,
  }),
  error: (message: string, error?: object) => ({
    status: 'error',
    message,
    error,
  }),
};
