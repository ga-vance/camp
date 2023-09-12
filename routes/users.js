const express = require("express");
const router = express.Router();
const User = require("../models/user");
const users = require("../controllers/users");
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const { storeReturnTo, validateUser } = require("../middleware");

router.get("/register", users.renderRegister);

router.post("/register", validateUser, catchAsync(users.register));

router.get("/login", users.renderLogin);

router.post(
    "/login",
    storeReturnTo,
    passport.authenticate("local", {
        failureFlash: true,
        failureRedirect: "/login",
    }),
    users.login
);

router.get("/logout", users.logout);

module.exports = router;
