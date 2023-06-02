var jwt = require("jsonwebtoken");
require("dotenv").config();

const createAccesToken = (user) => {
  console.log(process.env.jwtSecret);
  return jwt.sign(user, process.env.jwtSecret);
};

const verifyToken = (req, res, next) => {
  const accessToken = req.headers["Authorization"];
  if (!accessToken) res.json("You dont have a token!");
  jwt.verify(accessToken, process.env.jwtSecret, (err) => {
    if (err) {
      res.json("Access denied!");
    } else {
      next();
    }
  });
};

module.exports = {
  createAccesToken,
  verifyToken,
};
