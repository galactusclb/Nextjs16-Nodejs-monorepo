import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import * as schemas from '../schemas/auth.schema';

export const validateBody = (schemaName: keyof typeof schemas) =>
  (req: Request, res: Response, next: NextFunction) => {
    const schema = schemas[schemaName] as AnyZodObject;
    try {
      schema.parse({ body: req.body });
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({ error: err.errors });
      }
    }
  };