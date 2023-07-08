const client = require("./client");
const bcrypt = require('bcrypt');

// database functions

// user functions
async function createUser({ username, password }) {
  const user = await getUserByUsername(username);
  if (user) {
    console.log("from user", username);
    console.log(user);
    
    throw new Error(`User ${user.username} is already taken.`)
  }
  if (password.length < 8) {
    throw new Error("Password Too Short!")
  }  
  const SALT_COUNT = 10;
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
  const {rows:[newUser] } = await client.query(
    `INSERT INTO users(username, password) VALUES($1, $2) RETURNING id, username;`, [username, hashedPassword]
  )
  return newUser;
}

async function getUser({ username, password }) {
  const user = await getUserByUsername(username);
  if (!user){
    throw new Error("There is no account with this username")
  }
  const hashedPassword = user.password;

  let passwordsMatch = await bcrypt.compare(password, hashedPassword);
  if (passwordsMatch) {
    delete user['password'];
    return user;
  } else {
    // throw new Error("Username and Password do not match")
    return null;
  }
}

async function getUserById(userId) {
  const { rows: [ user ] } = await client.query(`
  SELECT id, username
  FROM users WHERE id = $1;
  `, [userId]);
  if (user) {
    return user;
  }
    return null;
}

async function getUserByUsername(username) {
  try {
    const { rows: [user] } = await client.query(`
      SELECT id, username, password
      FROM users
      WHERE username=$1;
    `, [username]);

    return user;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
