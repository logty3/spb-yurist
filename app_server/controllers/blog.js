const { API_SERVER, POSTS_PER_PAGE, ADMIN_PASSWORD } = require("../../config");

const axios = require("axios");
const moment = require("moment");
moment.locale("ru");

const blogPage = async (req, res, next) => {
  const { isAdmin } = req.session;
  try {
    const { data } = await axios.get(`${API_SERVER}/posts`, {
      params: { page: 1, ...req.query, perPage: POSTS_PER_PAGE },
    });
    console.log(data);
    const { posts, pages, page } = data;

    res.render("blog/blog/correctly", {
      active: "blog",
      posts,
      page,
      pages,
      moment,
      isAdmin,
    });
  } catch (error) {
    const { status, data } = error.response;
    if (400 <= status < 500) {
      const { errors } = data;
      return res.status(status).render("blog/blog/error", {
        active: "blog",
        isAdmin,
        errors,
      });
    }
    next(error);
  }
};

const postPage = async (req, res, next) => {
  const { isAdmin } = req.session;
  const { postId } = req.params;
  if (!req.session.visited) {
    req.session.visited = {};
  }
  try {
    const { data } = await axios.get(
      encodeURI(`${API_SERVER}/posts/${postId}`),
      {
        params: {
          visited: req.session.visited[postId],
        },
      }
    );
    if (!req.session.visited[postId]) {
      req.session.visited[postId] = true;
    }

    const { post } = data;

    res.render("blog/post/correctly", {
      active: "blog",
      post,
      moment,
      isAdmin,
    });
  } catch (error) {
    const { status, data } = error.response;
    if (400 <= status < 500) {
      const { errors } = data;
      return res.status(status).render("blog/post/error", {
        active: "blog",
        isAdmin,
        errors,
      });
    }
    next(error);
  }
};

module.exports = {
  blogPage,
  postPage,
};
