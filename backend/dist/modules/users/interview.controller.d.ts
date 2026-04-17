import { Response, NextFunction } from 'express';
export declare const createInterview: (req: any, res: Response, next: NextFunction) => Promise<void>;
export declare const getMockInterviewById: (req: any, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const addInterviewMessage: (req: any, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const completeInterview: (req: any, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
