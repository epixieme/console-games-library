const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const app = express();
require("dotenv").config();
// console.log(process.env);

MongoClient.connect(process.env.MONGO_URI, {
  useUnifiedTopology: true,
})
  .then((client) => {
    console.log("Connected to Database");
    const db = client.db("console-games-library"); // renames the db
    const quotesCollection = db.collection("games"); //creates the collection

    // All your handlers here...

    app.get("/", (req, res) => {
      res.sendFile(__dirname + "/index.html");
    });
    app.post("/games", (req, res) => {
        quotesCollection.insertOne(req.body)
        .then(result => {
          console.log(result)
        })
        .catch(error => console.error(error))
    });

  })
  .catch((error) => console.error(error));

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Make sure you place body-parser before your CRUD handlers!
// enables express to read info from forms
app.use(bodyParser.urlencoded({ extended: true }));
