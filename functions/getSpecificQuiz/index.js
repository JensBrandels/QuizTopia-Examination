const { sendResponse, sendError } = require("../../responses/index");
const { db } = require("../../services/db");

const handler = async (event) => {
  try {
    const { quizId } = event.pathParameters;

    const params = {
      TableName: "QuizTable",
      Key: {
        quizId: quizId,
      },
    };

    const quizData = await db.get(params);

    if (!quizData.Item) {
      return sendError(404, "Quiz not found");
    }

    const quiz = quizData.Item;

    return sendResponse(200, quiz);
  } catch (error) {
    console.error("Error retrieving quiz:", error);
    return sendError(500, "Internal Server Error");
  }
};

module.exports = { handler };
