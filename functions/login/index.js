const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendResponse, sendError } = require("../../responses/index");
const { getUserByName } = require("../../services/getUser");

async function checkPassword(password, user) {
  console.log("password, user", password, user);
  const isCorrect = await bcrypt.compare(password, user.password); //this is the hashedpassword saved as password inside the userObject
  console.log("isCorrect", isCorrect);
  return isCorrect;
}

function signToken(user) {
  const token = jwt.sign({ userId: user.userId }, process.env.SECRET, {
    expiresIn: 3600, // Går ut om 60 min
  });

  return token;
}

exports.handler = async (event) => {
  try {
    const { username, password } = JSON.parse(event.body);

    // Validate that username and password are provided and not empty
    if (!username || username.trim() === "") {
      return sendError(400, "Username is required");
    }
    if (!password || password.trim() === "") {
      return sendError(400, "Password is required");
    }

    const user = await getUserByName(username);

    if (!user) {
      return sendError(401, "Wrong username or password");
    }

    const correctPassword = await checkPassword(password, user);

    if (!correctPassword) return sendError(401, "Wrong username or password");

    const token = signToken(user);

    return sendResponse(200, { success: true, token: token });
  } catch (error) {
    return sendError(500, error.message);
  }
};
