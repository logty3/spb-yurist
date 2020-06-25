const { OUT_MAIL: user, TO_MAIL: to, PASSWORD: pass } = require("../../config");
const nodemailer = require("nodemailer");
const { validator } = require("../../utils");
const dns = require("dns");
const { promisify } = require("util");

const addConsultation = async (req, res) => {
  const { name, number, question } = req.body;
  let { email } = req.body;
  const errors = [
    ...validator({ exists: true, min: 2, max: 32 })(name, "name"),
    ...validator({ exists: true, regEx: /^8\(\d{3}\)\d{3}-\d{2}-\d{2}$/ })(
      number,
      "number"
    ),
    ...validator({ exists: true, min: 5, max: 200 })(question, "question"),
  ];
  try {
    await promisify(dns.resolve)(email.split("@")[1], "MX");
  } catch (error) {
    if (error.code === "ENOTFOUND") {
      errors.push({ key: "email", message: "not verified" });
      email = undefined;
    }
  }

  if (errors.length > 1) {
    return res.status(400).json({
      ok: false,
      errors,
    });
  }
  if (
    errors.length == 1 &&
    (errors[0].key == "name" || errors[0].key == "question")
  ) {
    return res.status(400).json({
      ok: false,
      errors,
    });
  }
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user,
      pass,
    },
  });

  const myMailOptions = {
    to,
    from: user,
    subject: "Консультация",
    html: `
    <p>
      ${name} хочет связаться по следующему вопросу:
      ${question}
      Можно связаться следующим путём: ${number || email}
    </p>
    `,
  };
  let toMailOptions = {};
  if (email) {
    toMailOptions = {
      to: email,
      from: user,
      subject: "Консультация",
      html: `
    <p>
    Спасибо за обращение. В ближайшее время с вами свяжется наш юрист.
      <p>
    `,
    };
  }
  transporter.on("error", (err) => {
    console.log(err);
  });
  try {
    if (email) {
      await transporter.sendMail(toMailOptions);
    }

    await transporter.sendMail(myMailOptions);

    res.json({
      ok: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      ok: false,
      errors: [{ message: "Internal server error" }],
    });
  }
};

module.exports = {
  addConsultation,
};
