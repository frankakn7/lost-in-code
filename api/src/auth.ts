import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

export enum role {
    ADMIN = "ADMIN",
    USER = "USER"
}

export const generateAuthToken = (id: string, role: string) => {
    const token = jwt.sign({ id, role }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '1d' });
    return token;
}


export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401); // if there isn't any token

    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err: any, user: any) => {
        if (err) return res.sendStatus(403);
        req.body.user = user;
        next();
    })
}

export const requireAdminRole = (req: Request, res: Response, next: NextFunction) => {
    if(req.body.user.role !== role.ADMIN) {
        return res.status(403).send("Forbidden: you don't have access to this resource");
    }
    next();
}

export const onlyAllowSelf = (req: Request, res: Response, next: NextFunction) => {
    if(req.body.user.id != req.params.id && req.body.user.role !== role.ADMIN) {
        console.log(req.body.user.id)
        console.log(req.params.id)
        return res.status(403).send("Forbidden: you don't have access to this resource");
    }
    next();
}
