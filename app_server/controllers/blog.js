const { API_SERVER, POSTS_PER_PAGE } = require("../../config");

const axios = require("axios");

const blogPage = async (req, res) => {
  const { isAdmin } = req.session;
  const { data } = await axios.get(`${API_SERVER}/posts`, {
    params: { ...req.query, perPage: POSTS_PER_PAGE },
  });

  const { posts, pages, page } = data;

  res.render("blog/blog", { active: "blog", posts, page, pages, isAdmin });
};

const postPage = async (req, res) => {
  const { isAdmin } = req.session;
  const { postId } = req.params;

  const { data } = await axios.get(`${API_SERVER}/posts/${postId}`);

  const { post } = data;

  res.render("blog/post", { active: "", post, isAdmin });
};

module.exports = {
  blogPage,
  postPage,
};
