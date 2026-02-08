import { Request, Response, NextFunction } from 'express';
import pino from 'pino';

const logger = pino();

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.status || err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    logger.error({
        err,
        method: req.method,
        url: req.url,
        body: req.body,
    });

    res.status(statusCode).json({
        error: {
            message,
            status: statusCode,
            timestamp: new Date().toISOString(),
        },
    });
};
