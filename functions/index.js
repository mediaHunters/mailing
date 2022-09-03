const functions = require("firebase-functions");
const sgMail = require("@sendgrid/mail");
const cors = require("cors");
const bodyParser = require("body-parser");
const request = require("request");

const express = require("express");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ origin: true }));

app.post("/send-email", (req, res, next) => {
  const { name, email, phone, message } = req.body;

  if (verifyUser(req)) {
    sgMail.setApiKey(process.env.SENDGRID_PRIVATE_KEY);
    
    const msg = {
      from: "hello.mediahunters@gmail.com",
      to: "hello.mediahunters@gmail.com",
      subject: `${email} - ${phone} | ${name}`,
      html: message,
    };

    sgMail.send(msg);
    res.json({
      success: true,
      msg: "valid user",
    });
  } else {
    res.json({
      success: false,
      msg: "invalid user",
    });
  }
});

function verifyUser(req, res) {
  if (!req.body.captcha) {
    return res.json({ success: false, msg: "Capctha is not checked" });
  }

  const verifyUrl = `${process.env.RECAPTCHA_API_URL}?secret=${process.env.RECAPTCHA_PRIVATE_KEY}&response=${req.body.captcha}`;

  return request(verifyUrl, (err, body) => {
    if (err) {
      console.log(err);
    }

    body = JSON.parse(body);
    return body.success;
  });
}

exports.app = functions.https.onRequest(app);
