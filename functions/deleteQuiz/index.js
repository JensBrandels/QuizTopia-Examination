const { validateToken } = require("../../middleware/auth");
const { sendResponse, sendError } = require("../../responses/index");
const { db } = require("../../services/db");
const middy = require("@middy/core");

const handler = middy()
  .use(validateToken)
  .handler(async (event) => {
    try {
      const userId = event.userId;
      const { quizId } = event.pathParameters;

      // Fetch the quiz from the database
      const getParams = {
        TableName: "QuizTable",
        Key: {
          quizId: quizId,
        },
      };

      const quizData = await db.get(getParams);

      if (!quizData.Item) {
        return sendError(404, "Quiz not found");
      }

      const quiz = quizData.Item;

      // Check if the logged-in user is the owner of the quiz
      if (quiz.quizOwner !== userId) {
        return sendError(403, "You are not authorized to delete this quiz");
      }

      // Proceed to delete the quiz
      const deleteParams = {
        TableName: "QuizTable",
        Key: {
          quizId: quizId,
        },
      };

      await db.delete(deleteParams);
      return sendResponse(200, {
        message: "Quiz deleted successfully!",
      });
    } catch (error) {
      console.error("Error deleting quiz:", error);
      return sendError(500, `Internal Server Error: ${error.message}`);
    }
  });

module.exports = { handler };
