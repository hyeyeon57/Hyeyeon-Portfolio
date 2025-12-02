const mongoose = require('mongoose');
const Contact = require('../models/Contact.cjs');

const isConnected = () => mongoose.connection.readyState === 1;

const createContact = async (payload) => {
  if (!isConnected()) {
    return { ok: false, message: 'MongoDB에 연결되지 않았습니다.' };
  }
  const contact = await Contact.create(payload);
  return { ok: true, data: contact };
};

const listContacts = async ({ limit = 50, page = 1 }) => {
  if (!isConnected()) {
    return { ok: false, message: 'MongoDB에 연결되지 않았습니다.' };
  }

  const skip = (page - 1) * limit;
  const contacts = await Contact.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .lean();
  const total = await Contact.countDocuments();

  return { ok: true, data: contacts, total, page, limit };
};

const markAsRead = async (id) => {
  if (!isConnected()) {
    return { ok: false, message: 'MongoDB에 연결되지 않았습니다.' };
  }

  const contact = await Contact.findByIdAndUpdate(id, { read: true }, { new: true });
  if (!contact) {
    return { ok: false, status: 404, message: '연락을 찾을 수 없습니다.' };
  }
  return { ok: true, data: contact };
};

const deleteContact = async (id) => {
  if (!isConnected()) {
    return { ok: false, message: 'MongoDB에 연결되지 않았습니다.' };
  }

  const contact = await Contact.findByIdAndDelete(id);
  if (!contact) {
    return { ok: false, status: 404, message: '연락을 찾을 수 없습니다.' };
  }
  return { ok: true };
};

module.exports = {
  createContact,
  listContacts,
  markAsRead,
  deleteContact,
};
