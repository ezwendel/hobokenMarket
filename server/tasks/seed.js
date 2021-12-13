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
  await db.dropDatabase(); // Drop the database before initalizing data to avoid duplicate data.

  console.log("Seeding database...\n");

  try {
    // Add Users
    const user1 = await usersData.createUser({
      name: { firstName: "Julius", lastName: "Randle" },
      username: "juliusrandle30",
      password: "password",
      profilePicture: null,
      emailAddress: "jrandle30@gmail.com",
    });
    const user1_id = user1._id.toString();

    const user2 = await usersData.createUser({
      name: { firstName: "RJ", lastName: "Barrett" },
      username: "rjbarrett",
      password: "password2",
      profilePicture: null,
      emailAddress: "rjbarrett@gmail.com",
    });
    const user2_id = user2._id.toString();

    const user3 = await usersData.createUser({
      name: { firstName: "Derrick", lastName: "Rose" },
      username: "drose.reborn",
      password: "password3",
      profilePicture: null,
      emailAddress: "drose@gmail.com",
    });
    const user3_id = user3._id.toString();

    const user4 = await usersData.createUser({
      name: { firstName: "Mitchell", lastName: "Robinson" },
      username: "mrobinson23",
      password: "password4",
      profilePicture: null,
      emailAddress: "mrobinson23@gmail.com",
    });
    const user4_id = user4._id.toString();

    console.log("getUserById:", await usersData.getUserById(user1_id));
    console.log("getAllUsers:", await usersData.getAllUsers());

    const item1 = await itemsData.createItem({
      name: "Item 1",
      description: "Testing createItem",
      sellerId: user1_id,
      itemPictures: null,
      categories: ["Electronics", "Home"],
    });
    const item1_id = item1._id.toString();

    console.log("getItems:", await itemsData.getAllItems());
    console.log("getItemById:", await itemsData.getItemById(item1_id));
    console.log(
      "getItemByCategory:",
      await itemsData.getItemsByCategory("Electronics")
    );
    console.log("deleteItemById:", await itemsData.deleteItemById(item1_id));

    // Create 50 items and add to users
    let count = 1;
    let categories = [
      "Home",
      "Electronics",
      "Clothing",
      "Furniture",
      "Art",
      "Entertainment",
      "Other",
    ];
    let user_id;
    for (let i = 1; i <= 50; i++) {
      if (count == 1) {
        count++;
        user_id = user1_id;
      } else if (count == 2) {
        count++;
        user_id = user2_id;
      } else if (count == 3) {
        count++;
        user_id = user3_id;
      } else if (count == 4) {
        count = 1;
        user_id = user4_id;
      }
      let new_item = await itemsData.createItem({
        name: `Item ${i}`,
        description:
          "Test item description. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        sellerId: user_id,
        itemPictures: null,
        categories: [
          categories[Math.floor(Math.random() * categories.length)],
          categories[Math.floor(Math.random() * categories.length)],
        ], // https://stackoverflow.com/questions/4550505/getting-a-random-value-from-a-javascript-array
      });
      const new_item_id = new_item._id.toString();
      console.log(
        "addItemToUser:",
        await usersData.addItemToUser(user_id, new_item_id)
      );
    }
  } catch (e) {
    console.log(e);
  }

  await dbConnection.closeConnection();

  // Finished seeding
  console.log("\nDatabase seeding complete.");
};

main().catch(console.log);
