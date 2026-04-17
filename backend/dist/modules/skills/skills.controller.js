"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSkill = exports.listSkills = void 0;
const prisma_1 = require("../../lib/prisma");
const nanoid_1 = require("nanoid");
const listSkills = async (req, res, next) => {
    try {
        const skills = await prisma_1.prisma.skill.findMany({
            orderBy: { name: 'asc' }
        });
        res.json(skills);
    }
    catch (error) {
        next(error);
    }
};
exports.listSkills = listSkills;
const createSkill = async (req, res, next) => {
    const { name, category } = req.body;
    try {
        const skill = await prisma_1.prisma.skill.create({
            data: {
                id: (0, nanoid_1.nanoid)(),
                name,
                category
            }
        });
        res.status(201).json(skill);
    }
    catch (error) {
        next(error);
    }
};
exports.createSkill = createSkill;
//# sourceMappingURL=skills.controller.js.map