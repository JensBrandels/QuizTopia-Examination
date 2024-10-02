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

      // Validate userId, quizId, and points
      if (!userId) {
        return sendError(400, "User ID is required");
      }
      if (!quizId || quizId.trim() === "") {
        return sendError(400, "Quiz ID is required");
      }
      if (
        points === undefined ||
        points === null ||
        isNaN(points) ||
        parseInt(points, 10) < 0
      ) {
        return sendError(400, "Points must be a non-negative number");
      }

      //make sure points is a valid number
      const parsedPoints = parseInt(points, 10);
      if (isNaN(parsedPoints) || parsedPoints < 0) {
        return sendError(400, "Points must be a non-negative number");
      }

      const leaderboardEntry = {
        leaderboardId: uuidv4(),
        quizId,
        userId,
        points,
      };

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
