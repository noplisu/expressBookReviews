const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({message: "Missing credentials"})
  }
  const user = users.find((user) => user.username == username && user.password == password);
  if (!user) {
    return res.status(400).json({message: "Wrong login or password"})
  }
 const token = jwt.sign({ data: username }, 'access', {expiresIn: 60*60});
  req.session.authorization = {token: token};
  return res.status(200).json({message: `Login successful`});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const username = req.user.data;
  const { review } = req.body;
  if(!username) {
    return res.status(400).json({message: "Not authorized"})
  }
  if(!books[isbn]) {
    return res.status(400).json({message: "Book not found"})
  }
  if(!review) {
    return res.status(400).json({message: "No review"})
  }
  books[isbn]["reviews"][username] = review;
  return res.status(201).json({message: "Review updated"})
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const username = req.user.data;
  if(!username) {
    return res.status(400).json({message: "Not authorized"})
  }
  if(!books[isbn]) {
    return res.status(400).json({message: "Book not found"})
  }
  books[isbn]["reviews"][username] = undefined;
  return res.status(201).json({message: "Review removed"})
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
