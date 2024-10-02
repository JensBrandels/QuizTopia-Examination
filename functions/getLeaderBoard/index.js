const { sendResponse, sendError } = require("../../responses/index");
const { db } = require("../../services/db");

const handler = async (event) => {
  try {
    const { quizId } = event.pathParameters;

    const params = {
      TableName: "leaderboardTable",
      IndexName: "QuizIndex",
      KeyConditionExpression: "quizId = :quizId",
      ExpressionAttributeValues: {
        ":quizId": quizId,
      },
    };

    const data = await db.query(params);

    //sort the entries from highest points first
    const sortedEntries = data.Items.sort((a, b) => b.points - a.points);

    return sendResponse(200, sortedEntries);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return sendError(500, "Internal Server Error");
  }
};

module.exports = { handler };
