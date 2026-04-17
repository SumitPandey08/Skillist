import { Request, Response, NextFunction } from 'express';
export declare const uploadResume: (req: any, res: Response, next: NextFunction) => Promise<void>;
export declare const getParsingStatus: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
