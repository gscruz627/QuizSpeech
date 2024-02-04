import jwt from "jsonwebtoken";

// JWT_SECRET Doesn't load if not in function scope, not sure why
export const verifyToken = async (req, res, next) => {
    const JWT_SECRET = process.env.JWT_SECRET;

    try {
        let token = req.header("Authentication");
        if (!token) return res.status(403).send("Access denied");

        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trimLeft();
        }

        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const optionalToken = async (req, res, next) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    try {
        let token = req.header("Authentication");
        if (!token) {
            next();
            return;
        };

        if (token && token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trimLeft();
        }
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}