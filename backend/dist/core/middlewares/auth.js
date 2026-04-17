"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireCompany = exports.requireStudent = exports.requireAuth = void 0;
const clerk_sdk_node_1 = require("@clerk/clerk-sdk-node");
const prisma_1 = require("../../lib/prisma");
exports.requireAuth = (0, clerk_sdk_node_1.ClerkExpressWithAuth)();
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
exports.requireStudent = [
    exports.requireAuth,
    async (req, res, next) => {
        try {
            fs_1.default.appendFileSync(path_1.default.join(process.cwd(), 'auth_debug.log'), JSON.stringify({
                url: req.url,
                auth: req.auth,
                authHeader: req.headers.authorization
            }) + '\n');
        }
        catch (e) {
            // Ignore log errors
        }
        console.log("requireStudent auth debug:", req.auth, req.headers.authorization);
        const userId = req.auth?.userId;
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        const user = await prisma_1.prisma.user.findUnique({ where: { id: userId } });
        if (user?.role !== 'student') {
            return res.status(403).json({ error: 'Forbidden: Student access only' });
        }
        next();
    }
];
exports.requireCompany = [
    exports.requireAuth,
    async (req, res, next) => {
        const userId = req.auth?.userId;
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        const user = await prisma_1.prisma.user.findUnique({ where: { id: userId } });
        if (user?.role !== 'company') {
            return res.status(403).json({ error: 'Forbidden: Company access only' });
        }
        next();
    }
];
//# sourceMappingURL=auth.js.map