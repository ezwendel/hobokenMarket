# Hoboken Marketplace
## CS 554 Final Project

Team Members
- Ali Kolenovic
- Andrew Johnson
- Elijah Wendel
- Francis Borja
- Junhong Wu

## For running the project with Docker:
1. Install Docker at https://www.docker.com/get-started (You may need to make a free account).
2. Open a terminal in the root directory of the project and run the command docker-compose build
3. Once that finishes, run the command `docker-compose up`. This will start the containers, and might take a while.
4. If everything seems to be running, navigate to `localhost:3000` in your browser to open the website.
5. When finished, `^C` in the terminal to close the app and run the command `docker-compose down` to remove the containers that have been made.

## For running the project with Node:
Before starting, you will need to have node.js, the package manager npm, MongoDB, and Redis installed. Ensure that a MongoDB server is running on port `localhost:27017`, and a Redis server on port `localhost:6379`.
### Starting the Server
1. In the root of the project, `cd` to `/server`, and use `npm install` in the terminal to install all node module dependencies.
2. Use `npm run seed` in the terminal to run the seed script to populate the database with template data.
3. Use `npm start` to start the server on `localhost:4000`.
### Starting the Client
1. In the root of the project, `cd` to `/client`, and use `npm install` in the terminal to install all node module dependencies.
2. Use `npm start` to start the client.
3. Wait for a browser or tab to open on `localhost:3000`, or enter `localhost:3000` to enter the website.
4. You should now be free to browse the website!

### Seed Script
There are 4 preset users created by seed script:
1. User 1
    - Username: juliusrandle30
    - Email: jrandle30@gmail.com
    - Password: password
2. User 2
    - Username: rjbarrett
    - Email: rjbarrett@gmail.com
    - Password: password2
3. User 3
    - Username: drose.reborn
    - Email: drose@gmail.com
    - Password: password3
4. User 4
    - Username: mrobinson23
    - Email: mrobinson23@gmail.com
    - Password: password4

The seed script also creates 100 items with random categories.