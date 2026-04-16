import { Request, Response, NextFunction } from 'express';
import { Webhook } from 'svix';
import { prisma } from '../../lib/prisma';

export const clerkWebhook = async (req: Request, res: Response, next: NextFunction) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    console.error('Missing CLERK_WEBHOOK_SECRET');
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  // svix headers
  const svix_id = req.headers['svix-id'] as string;
  const svix_timestamp = req.headers['svix-timestamp'] as string;
  const svix_signature = req.headers['svix-signature'] as string;

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({ error: 'Missing svix headers' });
  }

  // Get the payload
  const payload = req.body;
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: any;
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return res.status(400).json({ error: 'Webhook verification failed' });
  }

  const { id } = evt.data;
  const eventType = evt.type;

  try {
    if (eventType === 'user.created' || eventType === 'user.updated') {
      const { email_addresses, primary_email_address_id } = evt.data;
      const primaryEmail = email_addresses.find((email: any) => email.id === primary_email_address_id)?.email_address 
        || email_addresses[0]?.email_address;

      if (!primaryEmail) {
        return res.status(400).json({ error: 'No email address found' });
      }

      await prisma.user.upsert({
        where: { id: id! },
        update: {
          email: primaryEmail,
          updatedAt: new Date(),
        },
        create: {
          id: id!,
          email: primaryEmail,
        },
      });
    }

    if (eventType === 'user.deleted') {
      await prisma.user.delete({
        where: { id: id! },
      }).catch(err => {
        console.warn(`User ${id} already deleted or not found:`, err.message);
      });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};
