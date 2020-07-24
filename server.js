const express = require("express");
const fs = require("fs");
const path = require("path");
const PORT = process.env.PORT || 3030;
const server = express();
var db = require("./db/db.json");
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

//Server to "use" all files in the public folder
server.use(express.static("public"));

//"get" respose from index.js
server.get("/assets/js/index.js"),
    function(request, response) {
        response.sendFile(path.join(__dirname, "public/assets/js/index.js"))
    }

//HTML route to "get" notes from notes.html
server.get("/notes", function(request, response) {
    response.sendFile(path.join(__dirname, "public/notes.html"));
});

//Route to "get" notes api
server.get("/api/notes", function(request, response) {
    return response.json(referDb);
});

//HTML route to "get" landing page index.html
server.get("*", function(request, response) {
    response.sendFile(path.join(__dirname, "public/index.html"));
});

//Create variable referDb to be used for manipulating note id's
var referDb = JSON.parse(fs.readFileSync(path.join(__dirname, "db/db.json"), (error, data) => {
    if (error) {
        throw error;
    }
}));

//Function for writing new note
const newNote = function(note) {
    fs.writeFileSync(path.join(__dirname, "db/db.json"), JSON.stringify(note), (error, data) => {
        if (error) {
            throw error;
        }
    })
};

//Creating post method to save all new notes in db.json
server.post("/api/notes", function(request, response) {
    let note = request.body;
    let id = referDb.length;
    note.id = id
    referDb.push(note);
    //Invoking newNote function passing the referDB variable so that created notes will be posted in the db.json
    newNote(referDb);
    response.json(referDb);
});

//Creating the delete method with the id as an identifier for each note to delete
server.delete("/api/notes/:id", function(request, response) {
    let deletedNoteId = request.params.id;
    let newId = 0;
    //Using filter method to referDb to filter out the deleted note id
    referDb = referDb.filter((newCreated) => { return newCreated.id != deletedNoteId })
        //Using a for of loop, create a new id to remaining notes then convert to string. Id's need to be incremented for every note.
    for (newCreated of referDb) {
        newCreated.id = newId.toString();
        newId++;
    }
    //Invoking newNote function passing the referDB variable to update db.json without the deleted notes
    newNote(referDb);
    response.json(referDb);
});

//Assigting port for server
server.listen(PORT, () => {
    console.log("Server listening on PORT " + PORT);
});