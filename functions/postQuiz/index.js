const middy = require("@middy/core");
const { validateToken } = require("../../middleware/auth");
const { sendResponse, sendError } = require("../../responses/index");
const { getUserById } = require("../../services/getUser");
const { v4: uuidv4 } = require("uuid");
const { db } = require("../../services/db");

// Function to validate the request body for creating a quiz
const validateQuizBody = (body) => {
  const quizname = body.quizname;
  if (!quizname || quizname.trim() === "") {
    return {
      valid: false,
      message: "Quizname is required!",
    };
  }
  return { valid: true };
};

// Function to check if a quiz with the same name already exists
const checkQuizNameExists = async (quizname) => {
  const params = {
    TableName: "QuizTable",
    IndexName: "QuizIndex",
    KeyConditionExpression: "quizname = :quizname",
    ExpressionAttributeValues: {
      ":quizname": quizname,
    },
  };

  const result = await db.query(params);
  return result.Items.length > 0;
};

const handler = middy()
  .use(validateToken)
  .handler(async (event) => {
    try {
      const userId = event.userId;

      const user = await getUserById(userId);
      if (!user) {
        return sendError(404, "User not found");
      }

      //use the validation on the body here
      const body = JSON.parse(event.body);
      const validation = validateQuizBody(body);
      if (!validation.valid) {
        return sendError(400, validation.message);
      }

      const { quizname } = body;

      // Check if the quizname already exists
      const quizNameExists = await checkQuizNameExists(quizname);
      if (quizNameExists) {
        return sendError(
          400,
          "Quizname already exists. Please choose a different one."
        );
      }

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
