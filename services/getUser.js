const { db } = require("./db");

const getUserByName = async (username) => {
  console.log("username", username);
  const { Items } = await db.query({
    TableName: "QUsersTable",
    IndexName: "QUsernameIndex",
    KeyConditionExpression: "username = :username",
    ExpressionAttributeValues: {
      ":username": username,
    },
  });
  console.log("QueryItems", Items);
  return Items[0];
};

async function getUserById(userId) {
  try {
    console.log("Attempting to get user with ID:", userId);
    const result = await db.get({
      TableName: "QUsersTable",
      Key: {
        userId: userId,
      },
    });

    console.log("DynamoDB Result:", result);
    return result.Item; // Return the Item directly
  } catch (error) {
    console.error("Error fetching user from DynamoDB:", error);
    throw new Error("Failed to fetch user");
  }
}

module.exports = { getUserByName, getUserById };
