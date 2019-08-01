const app = require("express");
const router = app.Router();
const Post = require("../../models/Post");
const authentication = require("../../middlewears/auth");

router.post("/", authentication, (req, res) => {
    console.log(req.user);
    req.body.author = req.user.username;
    Post.findOne({ _id: req.body.id, "proposals.author": req.user.username })
        .then(data => {
            if (data)
                res.status(409).json({ "msg": "Alreday Sumbitted Proposal!" });
            else {
                Post.findOneAndUpdate(
                    { _id: req.body.id },
                    { $push: { proposals: req.body } },
                    function (error, success) {
                        if (error) {
                            res.json(error);
                        } else {
                            res.status(200).json({ "msg": "Updated Sucessfully" });
                        }
                    }
                )
            }
        })
        .catch(err => res.json(err));
});

module.exports = router;