const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const app = express();
const ObjectID = require('mongodb').ObjectId;

require("dotenv").config();

// console.log(process.env);

// enables express to read info from forms

MongoClient.connect(process.env.MONGO_URI, {
  useUnifiedTopology: true,
})
  .then((client) => {
    console.log("Connected to Database");
    const db = client.db("console-games-library"); // renames the db
    const gamesCollection = db.collection("games"); //creates the collection

    // ========================
    // Middlewares
    // ========================
    app.set("view engine", "ejs");
    // Make sure you place body-parser before your CRUD handlers!
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
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
          res.render("index.ejs", { games: games }); //=
          console.log("this is " + games);
        })

        .catch((error) => console.log(error));
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
          { _id:new  
            ObjectID(request.body.id)},//search by id
          {
            $set: {
              // taken from ejs file variables and update these fields
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
          response.json("Like Added");
        })
        .catch((error) => console.error(error));
    });
  })
  .catch((error) => console.error(error));

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
