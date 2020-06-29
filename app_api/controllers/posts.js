const { Posts } = require("../models");
const { ADMIN_PASSWORD } = require("../../config");
const { validator } = require("../../utils");

const postAdd = async (req, res) => {
  const { title, body } = req.body;

  const { authorization: password } = req.headers;

  if (password !== ADMIN_PASSWORD) {
    return res.status(403).json({
      ok: false,
      errors: [{ message: "access denied" }],
    });
  }

  const errors = [
    ...validator({
      exists: true,
      min: 5,
      excludeRegEx: /[^A-Za-zА-Яа-я\s]/,
      max: 50,
    })(title, "title"),
    ...validator({ exists: true, min: 100, max: 10000 })(body, "body"),
  ];

  if (errors.length > 0) {
    return res.status(400).json({
      ok: false,
      errors,
    });
  }

  try {
    const post = await Posts.create({
      title,
      body,
    });

    res.json({
      ok: true,
      post,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      ok: false,
      errors: [{ message: "Internal server error" }],
    });
  }
};

const postsGet = async (req, res) => {
  let { page, perPage } = req.query;

  const errors = [
    ...validator({ exists: true, isNum: true, min: 1 })(page, "page"),
    ...validator({ exists: true, isNum: true, min: 1, max: 1000 })(
      perPage,
      "perPage"
    ),
  ];
  if (errors.length > 0) {
    return res.status(400).json({
      ok: false,
      errors,
    });
  }

  page = +page;
  perPage = +perPage;

  try {
    const count = await Posts.countDocuments();
    const pages = Math.ceil(count / perPage);
    let posts = await Posts.find()
      .sort({ postId: -1 })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .select({ title: 1, body: 1, createdAt: 1, postId: 1, visitors: 1 });
    if (count > perPage) {
      if (posts.length == 0) {
        const last = count % perPage || perPage;

        posts = await Posts.find()
          .skip(count - last)
          .sort({ postId: -1 })
          .select({ title: 1, body: 1, createdAt: 1, postId: 1, visitors: 1 });
      }
    } else {
      posts = await Posts.find()
        .skip(count)
        .sort({ postId: -1 })
        .select({ title: 1, body: 1, createdAt: 1, postId: 1, visitors: 1 });
    }

    res.status(200).json({ ok: true, posts, pages, page });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      errors: [{ message: "Internal server error" }],
    });
  }
};

const postGet = async (req, res) => {
  const { postId } = req.params;

  if (!req.session.visited) {
    req.session.visited = {};
  }

  const errors = [
    ...validator({
      exists: true,
      isNum: true,
      isPositive: true,
    })(postId, "postId"),
  ];

  if (errors.length > 0) {
    return res.status(400).json({
      ok: false,
      errors,
    });
  }

  try {
    const post = await Posts.findOne({ postId }).select({
      title: 1,
      body: 1,
      createdAt: 1,
      postId: 1,
      visitors: 1,
    });
    if (!req.session.visited[postId]) {
      await Posts.findOneAndUpdate({ postId }, { $inc: { visitors: 1 } });
      req.session.visited[postId] = true;
    }
    if (!post)
      return res.status(404).json({
        ok: false,
        errors: [{ message: "post not found" }],
      });
    res.json({
      ok: true,
      post,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      errors: [{ message: "Internal server error" }],
    });
  }
};

const postEdit = async (req, res) => {
  const { postId } = req.params;

  const { title, body } = req.body;

  const { authorization: password } = req.headers;

  if (password !== ADMIN_PASSWORD) {
    return res.status(403).json({
      ok: false,
      errors: [{ message: "access denied" }],
    });
  }

  const errors = [
    ...validator({
      exists: true,
      excludeRegEx: /[^A-Za-zА-Яа-я\s]/,
      min: 5,
      max: 50,
    })(title, "title"),
    ...validator({ exists: true, min: 100, max: 10000 })(body, "body"),
    ...validator({
      exists: true,
      isNum: true,
      isPositive: true,
    })(postId, "postId"),
  ];

  if (errors.length > 0) {
    return res.status(400).json({
      ok: false,
      errors,
    });
  }

  try {
    const post = await Posts.findOneAndUpdate(
      { postId },
      { title, body },
      {
        new: true,
      }
    ).select({ title: 1, body: 1, createdAt: 1, postId: 1, visitors: 1 });

    if (!post) {
      return res.status(404).json({
        ok: false,
        errors: [{ message: "post not found" }],
      });
    }
    res.json({
      ok: true,
      post,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      ok: false,
      errors: [{ message: "Internal server error" }],
    });
  }
};

const postDelete = async (req, res) => {
  const { postId } = req.params;
  const { authorization: password } = req.headers;

  if (password !== ADMIN_PASSWORD) {
    return res.status(403).end();
  }

  const errors = [
    ...validator({
      exists: true,
      isNum: true,
      isPositive: true,
    })(postId, "postId"),
  ];

  if (errors.length > 0) {
    return res.status(404).end();
  }

  try {
    const { deletedCount } = await Posts.deleteOne({ postId });

    if (deletedCount == 0) {
      return res.status(404).end();
    }
    res.status(200).end();
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
};

module.exports = {
  postAdd,
  postsGet,
  postGet,
  postEdit,
  postDelete,
};
