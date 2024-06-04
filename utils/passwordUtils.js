const bcrypt = require('bcrypt');
const saltRounds = 10;

function hashPassword(password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
      if (err) {
        reject(err);
      } else {
        resolve(hashedPassword);
      }
    });
  });
}

async function comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

module.exports = {
  hashPassword,
  comparePassword,
};