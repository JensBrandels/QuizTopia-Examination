const { v4: uuidv4 } = require("uuid");
const { db } = require("../../services/db");
const { hashPassword } = require("../../services/hashPassword");
const { sendResponse, sendError } = require("../../responses/index");
const { getUserByName } = require("../../services/getUser");

// Function to validate request body
const validateRequestBody = (body) => {
  const requiredFields = [
    "username",
    "password",
    "email",
    "firstname",
    "lastname",
  ];

  //loop through it and check so that none of the required fields are empty
  for (const field of requiredFields) {
    if (!body[field] || body[field].trim() === "") {
      return {
        valid: false,
        message: `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } is required!`,
      };
    }
  }

  return { valid: true };
};

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);

    //validate the requestbody
    const validation = validateRequestBody(body);
    if (!validation.valid) {
      return sendError(400, validation.message);
    }

    const { username, password, email, firstname, lastname } = body;

    // Check if the username already exists within the QUsersTable
    const user = await getUserByName(username);
    if (user) {
      return sendError(
        400,
        "Username already exists. Please choose a different one."
      );
    }

    const hashedPassword = await hashPassword(password);

    // Create the new user
    await db.put({
      TableName: "QUsersTable",
      Item: {
        userId: uuidv4(),
        username: username,
        password: hashedPassword,
        email: email,
        firstname: firstname,
        lastname: lastname,
      },
    });

    return sendResponse(201, {
      message: "User created successfully!",
      user: {
        username,
        email,
        firstname,
        lastname,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return sendError(500, "An error occurred while creating the user.");
  }
};
