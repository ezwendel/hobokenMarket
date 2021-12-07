/* Seed module to populate the database for testing.
 ---------------------------------------------------------------------------*/
 const dbConnection = require('../config/mongoConnection');
 const data = require('../data/');
 const itemsData = data.items;
 const { ObjectId } = require("mongodb");

 const main = async () => {
     const db = await dbConnection();
     await db.dropDatabase(); // Drop the database before initalizing data to avoid duplicate data.
 
     console.log("Seeding database...\n");

     const item1 = await itemsData.createItem("Item 1", "Testing createItem" , (new ObjectId).toString(), null, ["Electronics", "Home"]);
     const item1_id = item1._id.toString();
 
     // Finished seeding
     console.log("\nDatabase seeding complete.");
     await db.serverConfig.close();
 }
 
 main().catch(console.log);
 