import { Response, NextFunction } from 'express';
export declare const syncAll: (req: any, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getIntelligence: (req: any, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
