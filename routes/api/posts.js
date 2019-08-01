const app = require("express");
const router = app.Router();
const Post = require("../../models/Post");
const authentication = require("../../middlewears/auth");

router.get("/", (req, res) => {
    Post.find()
        .then(data => {
            res.send(data);
        })
        .catch(err => console.log(err)); 
});

router.post("/", authentication, (req, res) => {
    console.log(req.user);
    req.body.author = req.user.username;
        var post = new Post(req.body);
        post.save()
        .then(data => {
            console.log('Post Created')
            res.json({
                message: 'Post Create Sucessfully!',
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