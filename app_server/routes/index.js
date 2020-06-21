const express = require("express");
const router = express.Router();
const {
  home,
  contacts,
  about,
  practice,
  forms,
  consultation,
  services,
  reviews,
  blog,
  admin,
} = require("../controllers");

router.get("/", home);
router.get("/contacts", contacts);
router.get("/about", about);
router.get("/practice", practice);
router.get("/forms", forms);

router.post("/consultation", consultation.addConsultation);

router.get("/services/price", services.price);
router.get("/services/legalentities", services.legalentities);
router.get("/services/individuals", services.individuals);

router.get("/reviews", reviews.reviewsPage);
router.post("/reviews", reviews.reviewAdd);
router.put("/reviews/:reviewId", reviews.reviewEdit);
router.delete("/reviews/:reviewId", reviews.reviewDelete);

router.get("/blog", blog.blogPage);
router.get("/blog/:postId", blog.postPage);

router.get("/admin", admin.adminAuth);
router.get("/admin/post", admin.postAddPage);
router.post("/admin/post", admin.postAdd);
router.get("/admin/post/:postId", admin.postEditPage);
router.put("/admin/post/:postId", admin.postEdit);
router.delete("/admin/post/:postId", admin.postDelete);

module.exports = router;
