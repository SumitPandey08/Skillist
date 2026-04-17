"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onboarding = exports.getCurrentUser = void 0;
const prisma_1 = require("../../lib/prisma");
const slugify_1 = __importDefault(require("slugify"));
const nanoid_1 = require("nanoid");
const clerk_sdk_node_1 = require("@clerk/clerk-sdk-node");
const getCurrentUser = async (req, res, next) => {
    const { userId } = req.auth;
    try {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ user });
    }
    catch (error) {
        next(error);
    }
};
exports.getCurrentUser = getCurrentUser;
const onboarding = async (req, res, next) => {
    const { userId } = req.auth;
    const { role, name, primarySkill, companyName, industry } = req.body;
    try {
        await prisma_1.prisma.user.upsert({
            where: { id: userId },
            update: { role },
            create: {
                id: userId,
                email: '',
                role
            },
        });
        if (role === 'student') {
            const slug = (0, slugify_1.default)(`${name}-${(0, nanoid_1.nanoid)(4)}`, { lower: true });
            await prisma_1.prisma.student.upsert({
                where: { id: userId },
                update: { name, slug, primarySkill },
                create: { id: userId, name, slug, primarySkill },
            });
        }
        else if (role === 'company') {
            await prisma_1.prisma.company.upsert({
                where: { id: userId },
                update: { name, companyName, industry },
                create: { id: userId, name, companyName, industry },
            });
        }
        // Update Clerk metadata
        await clerk_sdk_node_1.clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                onboardingComplete: true,
                role,
            },
        });
        res.json({ success: true });
    }
    catch (error) {
        next(error);
    }
};
exports.onboarding = onboarding;
//# sourceMappingURL=auth.controller.js.map