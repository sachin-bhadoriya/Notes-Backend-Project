const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true}))
app.use(express.static(path.join(__dirname, "public")));


app.get('/', function (req, res) {
    fs.readdir(`./files`, function(err, files){
        res.render("index", {files: files.reverse()});
    })
})


app.post('/create', function (req, res) {
    const content = (`Title: ${req.body.noteTitle}\n\nDescription: ${req.body.noteDesc}`);
    fs.writeFile(`./files/${req.body.fileName.split(" ").join("")+".txt"}`, content, function(err){
        res.redirect("/")
    })
})

app.get('/read/:filename', function (req, res) {
    fs.readFile(`./files/${req.params.filename}`, "utf-8", function(err, filedata) {
        if (err) {
            return res.status(500).send("Error reading file");
        }

        const lines = filedata.split("\n");
        const noteTitle = lines[0]?.replace("Title: ", "").trim();
        const noteDesc = lines.slice(2).join("\n").replace("Description: ", "").trim();

        res.render('read', {
            fileName: req.params.filename,
            filedata: {
                noteTitle,
                noteDesc
            }
        });
    });
});


app.listen(3000);