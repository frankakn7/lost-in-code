import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export enum role {
    ADMIN = 'ADMIN',
    USER = 'USER',
}

export const generateAuthToken = (
    id: string,
    role: string,
    username: string,
    res: Response
) => {
    const token = jwt.sign(
        { id, role, username },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1d' }
    );

    // Set the JWT in an HttpOnly cookie
    res.cookie('token', token, {
        httpOnly: true,
        path: '/',
        // secure: true, // Uncomment this line if you're on HTTPS
        expires: new Date(Date.now() + 60 * 60 * 24 * 1000), // 1 day
    });
};

export const authenticateToken = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = req.cookies.token;

    if (token == null) {
        // return res.sendStatus(401); // if there isn't any token
        return res
            .status(401)
            .json({ error: 'Unauthorized: no token was given' }); // if there isn't any token
    }

    jwt.verify(
        token,
        process.env.JWT_SECRET || 'your-secret-key',
        (err: any, user: any) => {
            // if (err) return res.sendStatus(403);
            if (err) return res.status(403).json({ error: 'Forbidden' });
            req.body.user = user;
            next();
        }
    );
};

export const requireAdminRole = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (req.body.user.role !== role.ADMIN) {
        return res
            .status(403)
            .json({
                error: "Forbidden: you don't have access to this resource",
            });
    }
    next();
};

export const onlyAllowSelf = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (
        req.body.user.id != req.params.id &&
        req.body.user.role !== role.ADMIN
    ) {
        return res
            .status(403)
            .json({
                error: "Forbidden: you don't have access to this resource",
            });
    }
    next();
};

// The new login check route
export const loginCheck = (req: Request, res: Response) => {
    const token = req.cookies.token;

    // if (token == null) return res.sendStatus(401); // if there isn't any token
    if (token == null)
        return res
            .status(401)
            .json({ error: 'Unauthorized: no token was given' });

    jwt.verify(
        token,
        process.env.JWT_SECRET || 'your-secret-key',
        (err: any, user: any) => {
            // if (err) return res.sendStatus(403);
            if (err) return res.status(403).json({ error: 'Forbidden' });

            // If token is valid, return user details
            res.json({ user });
        }
    );
};
