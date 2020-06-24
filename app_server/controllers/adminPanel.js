const { API_SERVER, ADMIN_PASSWORD } = require("../../config");

const axios = require("axios");

const adminAuth = (req, res) => {
  const { isAdmin } = req.session;
  if (!isAdmin) {
    const { password } = req.query;

    if (password != ADMIN_PASSWORD) {
      return res.redirect("/");
    }
    req.session.isAdmin = true;
    return res.redirect("/admin");
  }

  res.render("admin", {
    active: "admin",
    isAdmin,
  });
};

const postAddPage = (req, res) => {
  const { isAdmin } = req.session;
  if (!isAdmin) {
    return res.redirect("/");
  }

  res.render("admin/postAdd", {
    active: "admin",
    isAdmin,
  });
};

const postAdd = async (req, res) => {
  const { isAdmin } = req.session;
  if (!isAdmin) {
    return res.redirect(307, "/");
  }
  try {
    const { data } = await axios.post(
      `${API_SERVER}/posts`,
      {
        ...req.body,
      },
      {
        headers: {
          Authorization: ADMIN_PASSWORD,
        },
      }
    );
    res.json(data);
  } catch (error) {
    const { data, status } = error.response;
    if (400 <= status < 500) {
      return res.status(status).json(data);
    }
    next(error);
  }
};

const postEditPage = async (req, res) => {
  const { isAdmin } = req.session;
  const { postId } = req.params;
  if (!isAdmin) {
    return res.redirect("/");
  }

  try {
    const { data } = await axios.get(
      encodeURI(`${API_SERVER}/posts/${postId}`)
    );

    const { post } = data;

    res.render("admin/postEdit/correctly", {
      active: "admin",
      isAdmin,
      post,
    });
  } catch (error) {
    const { status, data } = error.response;
    if (400 <= status < 500) {
      const { errors } = data;
      return res.render("admin/postEdit/error", {
        active: "admin",
        isAdmin,
        errors,
      });
    }
    next(error);
  }
};

const postEdit = async (req, res) => {
  const { isAdmin } = req.session;
  const { postId } = req.params;
  if (!isAdmin) {
    return res.redirect(307, "/");
  }
  try {
    const { data } = await axios.put(
      encodeURI(`${API_SERVER}/posts/${postId}`),
      {
        ...req.body,
      },
      {
        headers: {
          Authorization: ADMIN_PASSWORD,
        },
      }
    );

    res.json(data);
  } catch (error) {
    const { data, status } = error.response;
    if (400 <= status < 500) {
      return res.status(status).json(data);
    }
    next(error);
  }
};

const postDelete = async (req, res) => {
  const { isAdmin } = req.session;
  const { postId } = req.params;
  if (!isAdmin) {
    return res.redirect(307, "/");
  }
  try {
    const { status } = await axios.delete(
      encodeURI(`${API_SERVER}/posts/${postId}`),
      {
        headers: {
          Authorization: ADMIN_PASSWORD,
        },
      }
    );

    res.status(status).end();
  } catch (error) {
    const { status } = error.response;
    if (400 <= status < 500) {
      return res.status(status).end();
    }
    next(error);
  }
};

module.exports = {
  adminAuth,
  postAddPage,
  postAdd,
  postEditPage,
  postEdit,
  postDelete,
};
