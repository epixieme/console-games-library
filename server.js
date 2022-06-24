const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const app = express();
const ObjectID = require("mongodb").ObjectId;
const multer  = require('multer')

require("dotenv").config();

// enables express to read info from forms







const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
const upload = multer({ storage: storage })

MongoClient.connect(process.env.MONGO_URI, { useUnifiedTopology: true })
  .then((client) => {
    console.log("Connected to Database");
    const db = client.db("console-games-library"); // renames the db
    const gamesCollection = db.collection("games"); //creates the collection
   
 
// gamesCollection.insertMany([
//   {"title": "Horizon","release":'2017',"developer":"Guerilla Games","platform":"PS4"},
//   {"title": "Grand Theft Auto","release":'2013',"developer":"Rockstar Games","platform":"PS4"},
//   {"title": "Marvel's Spider-Man: Miles Morales","release":'2020',"developer":"Insomniac Games","platform":"PS4"},
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
    app.use('/uploads', express.static('uploads'));
    app.use(express.static(__dirname + '/public'));
    http://localhost:3004/profile-upload-single
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
      gamesCollection.find({ $text: { $search: search } })
      .toArray(function(err, results){
        // console.log(results);
            res.render("index.ejs", { games:results });// got to work out how to return to the main search page. maybe use a reset button that fetches get '/'
    });
    });// try rewrite this to the same as the get request above

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


app.post('/profile-upload-single', upload.single('profile-file'), function (req, res, next) {
  // req.file is the `profile-file` file
  // req.body will hold the text fields, if there were any
  console.log(JSON.stringify(req.file))
  console.log('what is this' + this)
  let response = '<a href="/">Home</a><br>'
  response += "Files uploaded successfully.<br>"
  response += `<img src="${req.file.path}" /><br>`
  res.send(response)
  
// res.render("index.ejs", { post:response});

})


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
          console.log("updated game");
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
