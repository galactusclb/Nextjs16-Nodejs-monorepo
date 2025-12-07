import { Request, Response, NextFunction } from 'express';

export function errorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.error('[Error]', err);

    // Customize based on error type
    if (err.name === 'ZodError') {
        res.status(400).json({ error: err.errors });
        return;
    }
    if (err.status) {
        res.status(err.status).json({ error: err.message });
        return;
    }

    //TODO: Handle auth based errors

    // Fallback
    res.status(500).json({ error: 'Internal Server Error' });
}