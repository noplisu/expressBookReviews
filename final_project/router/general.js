const axios = require('axios');
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  if(!username) {
    return res.status(400).json({message: "Username missing"});
  }
  if(!password) {
    return res.status(400).json({message: "Password missing"});
  }
  const user = users.find((user) => user.username == username);
  if(user) {
    return res.status(400).json({message: "User already exists"});
  }
  users.push({ username, password });
  return res.status(201).json({message: "User registered!"});
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  const webBooks = await new Promise((resolve, reject) => {
    resolve(books);
  })
  return res.status(200).json(JSON.stringify(webBooks));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  const { isbn } = req.params;
  const book = await new Promise((resolve, reject) => {
    resolve(books[isbn]);
  });
  return res.status(200).json(JSON.stringify(book));
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  const { author } = req.params;
  const filtered = await new Promise((resolve, reject) => {
    resolve(Object.values(books).filter((book) => book["author"] == author));
  });
  return res.status(200).json(JSON.stringify(filtered));
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  const { title } = req.params;
  const filtered = await new Promise((resolve, reject) => {
    resolve(Object.values(books).filter((book) => book["title"] == title));
  })
  return res.status(200).json(JSON.stringify(filtered));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const { isbn } = req.params;
  const reviews = books[isbn]["reviews"];
  return res.status(200).json(JSON.stringify(reviews));
});

module.exports.general = public_users;
