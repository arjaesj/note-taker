const express = require("express");
const fs = require("fs");
const path = require("path");
const PORT = process.env.PORT || 3030;
const server = express();
const db = require("./db/db.json");
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// Server to "use" all files in the public folder
server.use(express.static("public"));

// "get" respose from index.js
server.get("/assets/js/index.js"), function (request, response){
  response.sendFile(path.join(__dirname, "public/assets/js/index.js"))
}

// HTML route to "get" notes from notes.html
server.get("/notes", function (request, response) {
  response.sendFile(path.join(__dirname, "public/notes.html"));
});

//Route to get notes api
server.get("/api/notes", function (request, response) {
 return response.json(referDb);
});

// HTML route to "get" index.html
server.get("*", function (request, response) {
  response.sendFile(path.join(__dirname, "public/index.html"));
});

// create variable referDb so we can manipulate later on with ID's
const referDb = JSON.parse(fs.readFileSync(path.join(__dirname, "/db/db.json"), (err, data) => {
  if (err) {
    throw err;
  }
}));

// function for writing using writefilesync
const newNote = function(note) {
  fs.writeFileSync(path.join(__dirname, "/db/db.json"), JSON.stringify(note),(err, data) => {
    if (err) {
      throw err;
    }
  })
};

// creating post method
server.post("/api/notes", function(request, response) {
  let note = request.body;
  let id = seeDb.length;
  note.id = id
  seeDb.push(note);
  //writing the new note to the DB
  newNote(referDb);
  response.json(referDb);
});

// setting delete, with id placeholder
server.delete("/api/notes/:id", function(request, response){
  let parsedId = request.params.id;
  let newId = 0;
  //using filter method to add to referDb if the id's do not match a previousely placed.
  referDb = referDb.filter((newCreated) => { return newCreated.id != parsedId })
  //creating a for of loop using the previous seeDb convenience variable, and newly
  for (newCreated of referDb){
    newCreated.id = newId.toString();
    newId ++;
  }
  writeNewNote(referDb);
  response.json(referDb);
});

// setting server.listen to port
server.listen(PORT, () => {
  console.log("server listening on PORT " + PORT);
});
