const express = require("express");
const router = express.Router();
const { reviews, posts } = require("../controllers");

router.get("/reviews", reviews.reviewsGet);
router.get("/reviews/:reviewId", reviews.reviewGet);
router.post("/reviews", reviews.reviewAdd);
router.put("/reviews/:reviewId", reviews.reviewEdit);
router.delete("/reviews/:reviewId", reviews.reviewDelete);

router.get("/posts", posts.postsGet);
router.get("/posts/:postId", posts.postGet);
router.post("/posts", posts.postAdd);
router.put("/posts/:postId", posts.postEdit);
router.delete("/posts/:postId", posts.postDelete);

module.exports = router;
