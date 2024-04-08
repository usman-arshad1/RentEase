const express = require('express');
const router = express.Router();
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const {forEach} = require('async');
const code = require("../public/js/code_gen");

function getDate() {
  const date = new Date();

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
  // console.log(curr_date); // "29-02-2024"
}

async function validateInput(title, description) {
  const resData = {};

  if (!title) {
    resData['titleInvalid'] = 'Enter a title';
    return resData;
  } else if (title.length < 5) {
    resData['titleInvalid'] = 'Enter a title with a minimum of 5 characters';
    return resData;
  }

  if (!description) {
    resData['descriptionInvalid'] = 'Enter a description';
  } else if (description.length < 9) {
    resData['descriptionInvalid'] = 'Enter a description with a minimum of 10 characters';
  } 

  return resData;
}

async function newFeedback(req, res) {
  const existingToken = req.cookies.jwt;
  const {title, category, description} = req.body;

  // console.log(title);
  // console.log(category);
  // console.log(description);

  if (!existingToken) {
    console.log('user is not signed in.');
    return res.redirect('/login');
  }

  try {
    const decoded = jwt.verify(existingToken, process.env.JWT_SECRET);

    if (!decoded) {
      console.log('user\'s token has expired.');
      return res.redirect('/login');
    }
    const results = [];

    const user = await prisma.user.findUnique({
      where: {
        email: decoded.email,
      },
    });

    console.log(user);

    if (Object.is(user.property_fk, null)) {
      return res.redirect('/tenant-feedback');
    }

    const property = await prisma.properties.findUnique({
      where: {
        property_id: user.property_fk,
      },
    });

    const curr_date = getDate();
    // console.log(curr_date); // "29-02-2024"
    const unique_code = code.unique_code();
    console.log("code: " + unique_code)

    await prisma.feedback.create({
      data: {
        title: title,
        category: parseInt(category),
        description: description,
        date: curr_date,
        status: 1,
        property_fk: user.property_fk,
        user_id_fk: user.user_id,
        code: unique_code,
      },
    });
    return res.redirect('/tenant-feedback');
  } catch (err) {
    console.log(err);
    if (err.name === 'TokenExpiredError') {
      return res.redirect('/login');
    } else {
      console.error(err);
      return res.status(500).json({error: 'Internal server error'});
    }
  } finally {
    prisma.$disconnect();
  }
}

router.post('/', async function(req, res, next) {
  const {title, description} = req.body;
  const resData = await validateInput(title, description);

  if (Object.keys(resData).length > 0) {
    req.flash('errors', resData);
    return res.redirect('/new-feedback');
  }
  await newFeedback(req, res);
});

router.get('/', function(req, res, next) {
  const errorMsgs = req.flash('errors')[0] || {};

  res.render('new_feedback', {title: 'Tenant New Feedback', errorMsgs});
});

const base62_str = [
	"0",
	"1",
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
	"9",
	"A",
	"B",
	"C",
	"D",
	"E",
	"F",
	"G",
	"H",
	"I",
	"J",
	"K",
	"L",
	"M",
	"N",
	"O",
	"P",
	"Q",
	"R",
	"S",
	"T",
	"U",
	"V",
	"W",
	"X",
	"Y",
	"Z",
	"a",
	"b",
	"c",
	"d",
	"e",
	"f",
	"g",
	"h",
	"i",
	"j",
	"k",
	"l",
	"m",
	"n",
	"o",
	"p",
	"q",
	"r",
	"s",
	"t",
	"u",
	"v",
	"w",
	"x",
	"y",
	"z",
];

//Creates a random number between 1 million (4 char codeword) to 100 billion (7 char codeword), inclusive.
function unique_code() {
	let key = Math.floor(Math.random() * 1000000000) + 1000000;
	let hash_str = base62_encode(key);

	return hash_str;
}

//Takes a decimal number and returns a unique code for the shortURL
function base62_encode(key) {
	let hash_str = "";
	while (key > 0) {
		hash_str += base62_str[key % 62];
		key = Math.floor((key /= 62));
	}
	return hash_str;
}

module.exports = router;
