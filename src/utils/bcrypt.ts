const bcrypt = require("bcrypt");

const hashPasswordUsingBcrypt = async (plainPassword: string) => {
  try {
    const saltRounds = 10;
    const hash = await bcrypt.hash(plainPassword, saltRounds);
    return hash;
  } catch (err) {
    console.error("Error hashing password:", err);
  }
};

const comparePasswords = async (
  inputPassword: string,
  hashedPasswordFromDB: string
) => {
  try {
    const result = await bcrypt.compare(inputPassword, hashedPasswordFromDB);
    console.log("result", result);
    return result;
  } catch (err) {
    console.error("Error comparing passwords:", err);
  }
};

export { comparePasswords, hashPasswordUsingBcrypt };
