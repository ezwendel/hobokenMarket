/* Seed module to populate the database for testing.
 ---------------------------------------------------------------------------*/
const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const itemsData = data.items;
const { ObjectId } = require("mongodb");

const main = async () => {
  console.log("Connection to database...");
  const db = await dbConnection.connectToDb();
  await db.dropDatabase(); // Drop the database before initalizing data to avoid duplicate data.

  console.log("Seeding database...\n");

  try {
    const item1 = await itemsData.createItem({
      name: "Item 1",
      description: "Testing createItem",
      sellerId: new ObjectId().toString(),
      itemPictures: null,
      categories: ["Electronics", "Home"]
    });
    const item1_id = item1._id.toString();
  
    console.log("getItems:", await itemsData.getAllItems());
    console.log("getItemById:", await itemsData.getItemById(item1_id));
    console.log("getItemByCategory:", await itemsData.getItemsByCategory("Electronics"));
    console.log("deleteItemById:", await itemsData.deleteItemById(item1_id));
  } catch (e) {
    console.log(e);
  }

  await dbConnection.closeConnection();

  // Finished seeding
  console.log("\nDatabase seeding complete.");
};

main().catch(console.log);
