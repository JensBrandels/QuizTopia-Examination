const jwt = require("jsonwebtoken");

const validateToken = {
  before: async (request) => {
    try {
      const authHeader = request.event.headers.authorization;

      if (!authHeader) {
        throw new Error("Token missing");
      }

      const token = authHeader.replace("Bearer ", "");
      const data = jwt.verify(token, process.env.SECRET);
      request.event.userId = data.userId;

      console.log("Token validated. User ID:", request.event.userId);
      return request.response;
    } catch (error) {
      console.error("Token validation error:", error.message);
      throw new Error("Unauthorized: Invalid or missing token");
    }
  },
};

module.exports = { validateToken };
