const database = require('../database');

async function shareOfEachPerson(userId, tripId) {
  const costSumQuery = await database.query('select SUM(cost) as sum from payments where tripId=? AND owner=?', [tripId, userId]);
  const crowdSumQuery = await database.query('select SUM(crowd) as sum from families_in_trip left join families family on family.id = families_in_trip.familyId where family.owner=? AND tripId=?', [userId, tripId]);

  const costSum = Number(costSumQuery[0].sum);
  const crowdSum = Number(crowdSumQuery[0].sum);

  return (costSum / crowdSum);
}

async function shareOfEachFamily(userId, tripId, familyId) {
  const family = await database.query('select name,crowd from families_in_trip left join families family on family.id = families_in_trip.familyId where family.id=? AND tripId=?', [familyId, tripId]);
  const shareEachPerson = await shareOfEachPerson(userId, tripId);

  if (!family[0]) {
    throw new Error('family not found!');
  }

  return family[0].crowd * shareEachPerson;
}

async function debtOfEachFamily(userId, tripId, familyId) {
  const payments = await database.query('select SUM(cost) as sum from payments where tripId=? AND familyId=? AND owner=?', [
    tripId,
    familyId,
    userId,
  ]);

  const familyShare = await shareOfEachFamily(
    userId,
    tripId,
    familyId,
  );

  if (payments[0].sum === null) {
    payments[0].sum = 0;
  }

  return payments[0].sum - familyShare;
}

module.exports = {
  debtOfEachFamily,
  shareOfEachFamily,
  shareOfEachPerson,
};
