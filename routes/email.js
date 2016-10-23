const express = require('express');
const router = express.Router();
const knex = require('../knex');
const nodemailer = require('nodemailer');
const ev = require('express-validation');
// const validations = require('../validations/users');
const { camelizeKeys, decamelizeKeys } = require('humps');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'DataGuruApp@gmail.com',
    pass: '6667b2d1aab6a00caa5aee5af8ad9f1465e567abf1c209d15727d57b3e8f6e5f'
});

function authorize (req, res, next) {
  jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(boom.create(401, 'Unauthorized'));
    }

    req.token = decoded;
    next();
  });
}

router.post('/email', authorize, (req, res, next) => {
  const { content } = req.body;
  const userId = req.token;

  knex('users')
  .where('id', userId)
  .then((row) => {
    const user = camelizeKeys(row);
    const mailOptions = {
      from: '"Data Guru 👥" <DataGuruApp@gmail.com>',
      to: user.email,
      subject: 'Your datasets have arrived 🤖',
      text: content
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return err;
      }

      res.send(info.response);
    });
  })
  .catch((err) => {
    next(err);
  });
});
