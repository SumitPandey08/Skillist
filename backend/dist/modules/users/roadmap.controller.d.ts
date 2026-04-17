import { Response, NextFunction } from 'express';
export declare const createRoadmap: (req: any, res: Response, next: NextFunction) => Promise<void>;
export declare const updateRoadmapStep: (req: any, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteRoadmap: (req: any, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
