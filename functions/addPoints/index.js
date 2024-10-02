const middy = require("@middy/core");
const { validateToken } = require("../../middleware/auth");
const { sendResponse, sendError } = require("../../responses/index");
const { db } = require("../../services/db");
const { v4: uuidv4 } = require("uuid");

const handler = middy()
  .use(validateToken)
  .handler(async (event) => {
    try {
      const userId = event.userId; // from validated token
      const { quizId, points } = JSON.parse(event.body);

      console.log("Received request to add points:", {
        quizId,
        points,
        userId,
      });

      const leaderboardEntry = {
        leaderboardId: uuidv4(),
        quizId,
        userId,
        points,
      };

      console.log("Leaderboard Entry:", leaderboardEntry);

      // Store the points in the leaderboard table
      await db.put({
        TableName: "leaderboardTable",
        Item: leaderboardEntry,
      });

      return sendResponse(201, {
        message: "Points added successfully!",
        leaderboardEntry,
      });
    } catch (error) {
      console.error("Error adding points:", error);
      return sendError(500, "Internal Server Error");
    }
  });

module.exports = { handler };
