const database = require('../database');

async function createFamily(userId, name, crowd) {
  const result = await database.query('insert into families (name, owner, crowd) VALUES (?,?,?)', [name, userId, crowd]);

  return result.affectedRows === 1;
}

async function getFamilies(userId) {
  // eslint-disable-next-line no-return-await
  return await database.query('select id, name, owner, crowd from families where owner=?', [userId]);
}

async function getFamily(userId, familyId) {
  // eslint-disable-next-line no-return-await
  return await database.query('select id, name, owner, crowd from families where owner=? AND id=?', [userId, familyId]);
}

async function editFamilyCrowd(userId, familyId, crowd) {
  const result = await database.query('update families set crowd=? where owner=? AND id=?', [crowd, userId, familyId]);

  return result.affectedRows === 1;
}

module.exports = {
  createFamily,
  getFamilies,
  getFamily,
  editFamilyCrowd,
};
