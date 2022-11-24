const bcrypt = require("bcrypt");
const saltRounds = 10;

class account {
  createPassword(password) {
    const hash = bcrypt.hashSync(password, saltRounds);
    // console.log(hash)
    return hash;
  }

  checkPassword(password, hash) {
    const result = bcrypt.compareSync(password, hash);
    // console.log(result)
    return result;
  }
}

module.exports = new account();
