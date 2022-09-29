const database = require('../database');

async function getAllPayments(userId) {
  const payments = await database.query('select * from payments where owner=?', [userId]);

  return payments;
}

async function getFamilyPayments(userId, familyId) {
  const payments = await database.query('select * from payments where owner=? AND familyId=?', [userId, familyId]);

  return payments;
}

async function getTripPayments(userId, tripId) {
  const payments = await database.query('select * from payments where owner=? AND tripId=?', [userId, tripId]);

  return payments;
}

async function getPaymentsOfEachFamilyInTrip(userId, tripId, familyId) {
  const payments = await database.query('select * from payments where owner=? AND tripId=? AND familyId=?', [userId, tripId, familyId]);

  return payments;
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
