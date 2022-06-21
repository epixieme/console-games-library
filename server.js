const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const app = express();
const ObjectID = require("mongodb").ObjectId;

require("dotenv").config();

// enables express to read info from forms

MongoClient.connect(process.env.MONGO_URI, { useUnifiedTopology: true })
  .then((client) => {
    console.log("Connected to Database");
    const db = client.db("console-games-library"); // renames the db
    const gamesCollection = db.collection("games"); //creates the collection
    // gamesCollection.createIndex({ title: 1, release: -1 });
 
// gamesCollection.insertMany([
//   {"title": "Cafecito", "release": "A sweet and rich Cuban hot coffee made by topping an espresso shot with a thick sugar cream foam."},
//   {"title": "New Orleans Coffee", "release": "Cafe Noir from New Orleans is a spiced, nutty coffee made with chicory."},
//   {"title": "Affogato", "release": "An Italian sweet dessert coffee made with fresh-brewed espresso and vanilla ice cream."},
//   {"title": "Maple Latte", "release": "A wintertime classic made with espresso and steamed milk and sweetened with some maple syrup."},
//   {"title": "Pumpkin Spice Latte", "release": "It wouldn't be autumn without pumpkin spice lattes made with espresso, steamed milk, cinnamon spices, and pumpkin puree."}
// ])
    gamesCollection.createIndex({
      title: "text",
      release: "text",
      developer: "text",
      platform: "text",
  
    });

    // gamesCollection
    //   .find()

    // ========================
    // Middlewares
    // ========================
    app.set("view engine", "ejs");
    // Make sure you place body-parser before your CRUD handlers!
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(express.static("public")); // make public folder accessible
    // ========================
    // Routes
    // ========================
    // All your handlers here...

    app.get("/", (req, res) => {
      gamesCollection
        .find()
        .toArray()
        .then((games) => {
          res.render("index.ejs", { games: games }); // this is data from the mongodb collection
          // console.log("this is " + games);
        })

        .catch((error) => console.log(error));
    });

    app.get("/search", (req, res) => {// listens for post request in main.js
      //https://stackoverflow.com/questions/32673261/find-query-in-mongodb-dont-return-data
      //https://mongodb.github.io/node-mongodb-native/markdown-docs/queries.html#making-queries-with-find
     
      const { search} = req.query;
      console.log(req.query);
      gamesCollection.find({ $text: { $search: search } }).toArray(function(err, results){
        // console.log(results);
            res.render("index.ejs", { games:results });// got to work out how to return to the main search page. maybe use a reset button that fetches get '/'
    });
   
    });

    

    app.post("/games", (req, res) => {
      // takes in the action route from the form
      gamesCollection
        .insertOne(req.body) //inserts into db
        // why did leon add individuls eg req.body.title
        .then((result) => {
          console.log(result);
          res.redirect("/"); // this means to refresh page to display new item
        })
        .catch((error) => console.error(error));
    });

    app.put("/games", (request, response) => {
      console.log(request.body.id);
      db.collection("games")
        .updateOne(
          { _id: new ObjectID(request.body.id) }, //search and match by id
          {
            $set: {
              //updates the following docuent object properties and values the db
              title: request.body.title,
              release: request.body.release,
              platform: request.body.platform,
              developer: request.body.developer,
            },
          },
          {
            // sort: {_id: -1},
            upsert: true,
          }
        )
        .then((result) => {
          console.log("Added One Like");
          response.json("game updated");
          response.redirect("/"); // creates a refresh and does a get() gets the ejs with the new data added from games object. see get request above.
        })
        .catch((error) => console.error(error));
    });

    app.delete("/deleteGames", (request, response) => {
      db.collection("games")
        .deleteOne({ title: request.body.title })
        .then((result) => {
          console.log("checking");

          // console.log("Added One Like");
          response.json("game deleted");
          // res.redirect("/"); // creates a refresh and does a get() gets the ejs with the new data added from games object. see get request above.
        })
        .catch((error) => console.error(error));
    });
    // ========================
    // Listen
    // ========================

    const PORT = 3004;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`); // set up heroku part  process.env.PORT || PORT so heroku or local port
    });
  })
  .catch(console.error);
