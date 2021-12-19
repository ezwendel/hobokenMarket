/* Seed module to populate the database for testing.
---------------------------------------------------------------------------*/
const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const itemsData = data.items;
const usersData = data.users;
const { ObjectId } = require("mongodb");

const main = async () => {
  console.log("Connection to database...");
  const db = await dbConnection.connectToDb();
  // console.log(db);

  console.log("Running tests...\n");

  try {
    console.log("getItemsByCategory(): ", await itemsData.getItemsByCategory("other"));
  } catch (e) {
    console.log(e);
  }

  await dbConnection.closeConnection();

  // Finished seeding
  console.log("\nDatabase seeding complete.");
};

main().catch(console.log);
