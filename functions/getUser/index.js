// const middy = require("@middy/core");
// const { validateToken } = require("../../middleware/auth");
// const { sendResponse, sendError } = require("../../responses/index");
// const { getUserById } = require("../../services/getUser");

// const handler = middy()
//   .use(validateToken)
//   .handler(async (event) => {
//     try {
//       console.log("Event received:", event);

//       const userId = event.userId; // Get userId from the validated token
//       console.log("Fetching user with ID:", userId);

//       const user = await getUserById(userId);

//       if (!user) {
//         return sendError(404, "User not found");
//       }

//       return sendResponse(200, {
//         userId: user.userId,
//         firstname: user.firstname,
//         lastname: user.lastname,
//         email: user.email,
//       });
//     } catch (error) {
//       console.error("Error fetching user:", error);
//       return sendError(500, "Internal Server Error");
//     }
//   });

// module.exports = { handler };
