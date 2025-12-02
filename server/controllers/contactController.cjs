const { ok, fail } = require('../utils/httpResponse.cjs');
const {
  createContact,
  listContacts,
  markAsRead,
  deleteContact,
} = require('../services/contactService.cjs');

const postContact = async (req, res) => {
  const result = await createContact(req.body);
  if (!result.ok) {
    return res.json({ success: false, error: result.message });
  }
  return ok(res, { data: result.data });
};

const getContacts = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 50;
  const page = parseInt(req.query.page, 10) || 1;

  const result = await listContacts({ limit, page });
  if (!result.ok) {
    return res.json({ success: false, error: result.message });
  }
  return ok(res, {
    data: result.data,
    total: result.total,
    page: result.page,
    limit: result.limit,
  });
};

const putReadContact = async (req, res) => {
  const result = await markAsRead(req.params.id);
  if (!result.ok) {
    return fail(res, result.status || 500, result.message);
  }
  return ok(res, { data: result.data });
};

const deleteContactById = async (req, res) => {
  const result = await deleteContact(req.params.id);
  if (!result.ok) {
    return fail(res, result.status || 500, result.message);
  }
  return ok(res, { message: '연락이 삭제되었습니다.' });
};

module.exports = {
  postContact,
  getContacts,
  putReadContact,
  deleteContactById,
};
