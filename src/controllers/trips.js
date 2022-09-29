const database = require('../database');

const TripStatuses = ['STARTED', 'FINISHED', 'INIT'];

async function getAllTrips(userId) {
  const trips = await database.query('select * from trip where creator=?', [userId]);

  // eslint-disable-next-line no-restricted-syntax
  for await (const trip of trips) {
    const families_in_trip = await database.query('select familyId from families_in_trip where tripId=?', [trip.id]);
    trip.families = families_in_trip.map((family) => family.familyId);
  }

  return trips;
}

async function addFamilyToTrip(userId, tripId, familyId) {
  const result = await database.query('insert into families_in_trip (tripId, familyId, owner) VALUES (?, ?, ?)', [tripId, familyId, userId]);

  return result.affectedRows === 1;
}

async function removeFamilyFromTrip(userId, tripId, familyId) {
  const result = await database.query('delete from families_in_trip where tripId=? AND familyId=? AND owner=?', [tripId, familyId, userId]);

  return result.affectedRows === 1;
}

async function updateTripStatus(tripId, status) {
  const result = await database.query('update trip set status=? where id=?', [status, tripId]);

  return result.affectedRows === 1;
}

async function isFamiliesExists(userId, families) {
  // eslint-disable-next-line no-restricted-syntax
  for await (const familyId of families) {
    const result = await database.query('select * from families where id=? and owner=?', [familyId, userId]);
    if (result.length === 0) {
      return false;
    }
  }

  return true;
}

async function createTrip(userId, dest) {
  const result = await database.query('insert into trip (dest, creator) values (?,?)', [dest, userId]);

  return [result.affectedRows === 1, result.insertId];
}

module.exports = {
  TripStatuses,
  getAllTrips,
  addFamilyToTrip,
  removeFamilyFromTrip,
  updateTripStatus,
  isFamiliesExists,
  createTrip,
};
