import { Response, NextFunction } from 'express';
export declare const getCurrentUser: (req: any, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const onboarding: (req: any, res: Response, next: NextFunction) => Promise<void>;
