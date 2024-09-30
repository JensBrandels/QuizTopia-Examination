const middy = require("@middy/core");
const { validateToken } = require("../../middleware/auth");
const { sendResponse, sendError } = require("../../responses/index");
const { db } = require("../../services/db");

async function getUser(userId) {
  try {
    console.log("Attempting to get user with ID:", userId);
    const result = await db.get({
      TableName: "QUsersTable",
      Key: {
        userId: userId,
      },
    });

    console.log("DynamoDB Result:", result);
    return result.Item; // Return the Item directly
  } catch (error) {
    console.error("Error fetching user from DynamoDB:", error);
    throw new Error("Failed to fetch user");
  }
}
const handler = middy()
  .use(validateToken)
  .handler(async (event) => {
    try {
      console.log("Event received:", event);

      const userId = event.userId; // Get userId from the validated token
      console.log("Fetching user with ID:", userId);

      const user = await getUser(userId);

      if (!user) {
        return sendError(404, "User not found");
      }

      return sendResponse({
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      return sendError(500, "Internal Server Error");
    }
  });

module.exports = { handler };
