const app = require("express");
const router = app.Router();
const Book = require("../../models/Book");
const authentication = require("../../middlewears/auth");

router.get("/", (req, res) => {
    Book.find()
        .then(data => {
            res.send(data);
        })
        .catch(err => console.log(err)); 
});

router.post("/", authentication, (req, res) => {
    console.log(req.user);
    req.body.addedBy = req.user.email;
        var book = new Book(req.body);
        book.save()
        .then(data => {
            console.log('Book Created')
            res.json({
                message: 'Book Create Sucessfully!',
            });
        })
        .catch(err => {
            console.log(err);
            res.json({
                message: err.message,
            })
        })
});

router.get("/myfeed", authentication, (req, res) => {
    if (req.user.type == 2) {
        Post.find()
            .then(data => {
                res.send(data);
            })
            .catch(err => console.log(err));
    }
    if (req.user.type == 1) {
        Post.find({ author: req.user.username })
            .then(data => {
                res.send(data);
            })
            .catch(err => console.log(err));
    }
});

module.exports = router;