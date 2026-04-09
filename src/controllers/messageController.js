import mongoose from 'mongoose';
import Message from '../models/Message.js';
import nodemailer from 'nodemailer';

function createTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS } =
    process.env;
  if (!SMTP_HOST || !SMTP_USER) return null;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: SMTP_SECURE === 'true',
    auth:
      SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
  });
}

async function maybeSendEmail({ name, email, message }) {
  const to = process.env.CONTACT_TO_EMAIL;
  const transporter = createTransport();
  if (transporter && to) {
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
      to,
      replyTo: email,
      subject: `Portfolio contact from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
      html: `<p><b>${name}</b> &lt;${email}&gt;</p><p>${message.replace(/\n/g, '<br/>')}</p>`,
    });
  }
}

export async function createMessage(req, res, next) {
  try {
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const text = String(req.body.message || '').trim();

    const doc = await Message.create({ name, email, message: text });

    try {
      await maybeSendEmail({ name, email, message: text });
    } catch (mailErr) {
      console.warn('Contact email failed (message still saved):', mailErr.message);
    }

    res.status(201).json({
      message: 'Thanks — your message was received.',
      id: doc._id,
    });
  } catch (e) {
    next(e);
  }
}

export async function listMessages(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;
    const filter = {};
    if (req.query.unreadOnly === 'true') {
      filter.read = false;
    }
    const [data, total] = await Promise.all([
      Message.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Message.countDocuments(filter),
    ]);
    res.json({
      data,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    });
  } catch (e) {
    next(e);
  }
}

export async function deleteMessage(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid message id' });
    }
    const removed = await Message.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ message: 'Message not found' });
    res.json({ message: 'Deleted', id });
  } catch (e) {
    next(e);
  }
}

export async function markMessageRead(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid message id' });
    }
    const read = req.body.read !== false;
    const doc = await Message.findByIdAndUpdate(
      id,
      { read },
      { new: true }
    ).lean();
    if (!doc) return res.status(404).json({ message: 'Message not found' });
    res.json(doc);
  } catch (e) {
    next(e);
  }
}
