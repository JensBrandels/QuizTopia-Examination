const { sendResponse, sendError } = require("../../responses");
const { db } = require("../../services/db");

exports.handler = async () => {
  try {
    const params = {
      TableName: "QuizTable",
    };

    const result = await db.scan(params);
    const quizzes = result.Items;

    return sendResponse(200, { success: true, quizzes: quizzes });
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return sendError({
      success: false,
      message: "An error occurred while fetching quizzes.",
    });
  }
};
