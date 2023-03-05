const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const database = require('../database');

async function getUser(username) {
  const user = await database.query('select * from users where username=?', [username]);

  return user;
}

async function createUser(username, password) {
  const result = await database.query('insert into users (username, password, status) values (?, ?, ?)', [username, password, 'ACTIVE']);

  return result.affectedRows === 1;
}

async function isUserExists(username) {
  const result = await database.query('select username from users where username=?', [username]);
  return result.length !== 0;
}

async function isPasswordValid(password, hash) {
  // eslint-disable-next-line no-return-await
  return await bcrypt.compare(password, hash);
}

async function createToken(data, key) {
  return jwt.sign(data, key, undefined, undefined);
}

async function hashPassword(password) {
  // eslint-disable-next-line no-return-await
  return await bcrypt.hash(password, 10);
}

module.exports = {
  getUser,
  isPasswordValid,
  createToken,
  hashPassword,
  createUser,
  isUserExists,
};
