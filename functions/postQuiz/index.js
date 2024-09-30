const middy = require("@middy/core");
const { validateToken } = require("../../middleware/auth");
const { sendResponse, sendError } = require("../../responses/index");
const { getUserById } = require("../../services/getUser");
const { v4: uuidv4 } = require("uuid");
const { db } = require("../../services/db");

const handler = middy()
  .use(validateToken)
  .handler(async (event) => {
    try {
      const userId = event.userId; // Get userId from the validated token

      const user = await getUserById(userId);
      if (!user) {
        return sendError(404, "User not found");
      }
      console.log("user", user.userId);
      const { quizname } = JSON.parse(event.body);

      const newQuiz = {
        quizId: uuidv4(),
        quizOwner: userId,
        quizname: quizname,
        questions: [],
      };

      await db.put({
        TableName: "QuizTable",
        Item: newQuiz,
      });

      return sendResponse(201, {
        message: "Quiz created successfully!",
        quiz: newQuiz,
      });
    } catch (error) {
      console.error("Detailed error", error);
      return sendError(500, "Internal Server Error");
    }
  });

module.exports = { handler };
