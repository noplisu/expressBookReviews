const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(express.json());

app.use("/customer",session({
  secret:"isab987y239fhafsoidgf978w234",
  resave: true,
  saveUninitialized: true
}))

app.use("/customer/auth/*", function auth(req,res,next){
  if (req.session.authorization) {
    let token = req.session.authorization['token'];
    jwt.verify(token, 'access', (error, user) => {
      if (!error) {
        req.user = user;
        next();
      }
      else {
        return res
          .status(403)
          .json({ message: "User not authenticated" });
      }
    });
  }
  else {
    return res
      .status(403)
      .json({ message: "User not authenticated" });
  }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
