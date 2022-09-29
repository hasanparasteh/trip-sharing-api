const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const database = require('../database');

async function getUser(username) {
  const user = await database.query('select * from users where username=?', [username]);

  if (user.length === 0 || !user[0].status || user[0].status !== 'ACTIVE') {
    return false;
  }

  return true;
}

async function createUser(username, password) {
  const result = await database.query('insert into users (username, password, status) values (?, ?, ?)', [username, password, 'ACTIVE']);

  return result.affectedRows === 1;
}

async function isUserExists(username) {
  const result = await database.query('select username from users where username=?', [username]);
  if (result.length !== 0) {
    return true;
  }

  return false;
}

async function isPasswordValid(password, hash) {
  if (!(await bcrypt.compare(password, hash))) {
    return false;
  }

  return true;
}

async function createToken(data, key) {
  return jwt.sign(data, key, undefined, undefined);
}

async function hashPassword(password) {
  const hash = await bcrypt.hash(password, 10);
  return hash;
}

module.exports = {
  getUser,
  isPasswordValid,
  createToken,
  hashPassword,
  createUser,
  isUserExists,
};
