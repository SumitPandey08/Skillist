"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clerkWebhook = void 0;
const svix_1 = require("svix");
const prisma_1 = require("../../lib/prisma");
const clerkWebhook = async (req, res, next) => {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
    if (!WEBHOOK_SECRET) {
        console.error('Missing CLERK_WEBHOOK_SECRET');
        return res.status(500).json({ error: 'Webhook secret not configured' });
    }
    // svix headers
    const svix_id = req.headers['svix-id'];
    const svix_timestamp = req.headers['svix-timestamp'];
    const svix_signature = req.headers['svix-signature'];
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return res.status(400).json({ error: 'Missing svix headers' });
    }
    // Get the payload
    const payload = req.body;
    const body = JSON.stringify(payload);
    const wh = new svix_1.Webhook(WEBHOOK_SECRET);
    let evt;
    try {
        evt = wh.verify(body, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        });
    }
    catch (err) {
        console.error('Error verifying webhook:', err);
        return res.status(400).json({ error: 'Webhook verification failed' });
    }
    const { id } = evt.data;
    const eventType = evt.type;
    try {
        if (eventType === 'user.created' || eventType === 'user.updated') {
            const { email_addresses, primary_email_address_id } = evt.data;
            const primaryEmail = email_addresses.find((email) => email.id === primary_email_address_id)?.email_address
                || email_addresses[0]?.email_address;
            if (!primaryEmail) {
                return res.status(400).json({ error: 'No email address found' });
            }
            await prisma_1.prisma.user.upsert({
                where: { id: id },
                update: {
                    email: primaryEmail,
                    updatedAt: new Date(),
                },
                create: {
                    id: id,
                    email: primaryEmail,
                },
            });
        }
        if (eventType === 'user.deleted') {
            await prisma_1.prisma.user.delete({
                where: { id: id },
            }).catch(err => {
                console.warn(`User ${id} already deleted or not found:`, err.message);
            });
        }
        res.status(200).json({ success: true });
    }
    catch (err) {
        next(err);
    }
};
exports.clerkWebhook = clerkWebhook;
//# sourceMappingURL=webhooks.controller.js.map