const database = require('../database');

async function getAllPayments(userId) {
  // eslint-disable-next-line no-return-await
  return await database.query('select * from payments where owner=?', [userId]);
}

async function getFamilyPayments(userId, familyId) {
  // eslint-disable-next-line no-return-await
  return await database.query('select * from payments where owner=? AND familyId=?', [userId, familyId]);
}

async function getTripPayments(userId, tripId) {
  // eslint-disable-next-line no-return-await
  return await database.query('select * from payments where owner=? AND tripId=?', [userId, tripId]);
}

async function getPaymentsOfEachFamilyInTrip(userId, tripId, familyId) {
  // eslint-disable-next-line no-return-await
  return await database.query('select * from payments where owner=? AND tripId=? AND familyId=?', [userId, tripId, familyId]);
}

async function createPayment(userId, tripId, familyId, cost, timestamp, description) {
  const result = await database.query('insert into payments (description, cost, familyId, tripId, owner, timestamp) VALUES (?,?,?,?,?,?)', [
    description || null,
    cost,
    familyId,
    tripId,
    userId,
    timestamp || new Date(),
  ]);

  return result.affectedRows === 1;
}

module.exports = {
  getAllPayments,
  getFamilyPayments,
  getTripPayments,
  getPaymentsOfEachFamilyInTrip,
  createPayment,
};
