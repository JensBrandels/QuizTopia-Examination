const { v4: uuidv4 } = require("uuid");
const { validateToken } = require("../../middleware/auth");
const { sendResponse, sendError } = require("../../responses/index");
const middy = require("@middy/core");
const { db } = require("../../services/db");

const handler = middy()
  .use(validateToken)
  .handler(async (event) => {
    try {
      const userId = event.userId;
      const { quizId, question, answer, location } = JSON.parse(event.body);

      //making sure we have all we need and are not empty strings
      if (
        !quizId ||
        !question ||
        !answer ||
        !location ||
        !location.longitude ||
        !location.latitude ||
        question.trim() === "" ||
        answer.trim() === ""
      ) {
        return sendError(400, "Missing required fields or empty strings");
      }

      //find the quiz inside table here
      const getParams = {
        TableName: "QuizTable",
        Key: {
          quizId: quizId,
        },
      };

      const quizData = await db.get(getParams);
      const quiz = quizData.Item;

      if (!quiz) {
        return sendError(404, "Quiz not found");
      }

      //check so that the owner of the quiz is the same as the user trying to make question
      if (quiz.quizOwner !== userId) {
        return sendError(
          403,
          "Permission Denied: You are not the owner of this quiz."
        );
      }

      // Check for duplicate question
      const questionExists = quiz.questions.some(
        (q) => q.question.trim().toLowerCase() === question.trim().toLowerCase()
      );

      if (questionExists) {
        return sendError(400, "Question already exists in this quiz.");
      }

      //Make the new question
      const newQuestion = {
        questionId: uuidv4(),
        question: question,
        answer: answer,
        location: {
          longitude: location.longitude,
          latitude: location.latitude,
        },
      };

      //add new question to existing array
      const updatedQuestions = [...quiz.questions, newQuestion];

      //Update the existing quiz inside the QuizTable
      const updateParams = {
        TableName: "QuizTable",
        Key: {
          quizId: quizId,
        },
        UpdateExpression: "set questions = :questions",
        ExpressionAttributeValues: {
          ":questions": updatedQuestions,
        },
        ReturnValues: "UPDATED_NEW",
      };

      await db.update(updateParams);

      return sendResponse(200, {
        message: "Question added successfully!",
        updatedQuiz: updatedQuestions,
      });
    } catch (error) {
      console.error("Detailed error", error);
      return sendError(500, "Internal Server Error");
    }
  });

module.exports = { handler };
