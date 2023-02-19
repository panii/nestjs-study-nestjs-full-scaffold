// to make the file a module and avoid the TypeScript error
export {}

declare global {
  namespace Express {
    export interface Request {
      requestID?: string;
      clientIP?: string;
      startTime?: number;
      userId?: number;
    }
  }
}