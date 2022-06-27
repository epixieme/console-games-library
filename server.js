const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const app = express();
const ObjectID = require("mongodb").ObjectId;
const multer  = require('multer')
const {GridFsStorage} = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const crypto = require('crypto');
const mongoose =require('mongoose')
const path =require('path')



require("dotenv").config();


 //init gfs 
let gfs
const conn = mongoose.createConnection(process.env.MONGO_URI, { useUnifiedTopology: true }, (err,client)=>{
 
    console.log("Connected to Database");
    const db = conn.db
    const gamesCollection = db.collection("games"); //creates the collection
    conn.once('open', ()=>{
      //initialise stream
      gfs = Grid(conn.db,mongoose.mongo)
      gfs.collection('uploads')
    })
   
  

//create storage engine
const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});


const upload = multer({ storage })







 
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


    app.post('/upload',upload.single('file'),(req,res)=>{

      res.redirect("/")

    })
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

