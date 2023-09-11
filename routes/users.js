const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const ExpressError = require("../utils/ExpressError");
const { userSchema } = require("../schemas.js");
const { storeReturnTo } = require("../middleware");

const validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

router.get("/register", (req, res) => {
    res.render("users/register");
});

router.post(
    "/register",
    validateUser,
    catchAsync(async (req, res, next) => {
        try {
            const { email, username, password } = req.body.user;
            const user = new User({ email, username });
            const registeredUser = await User.register(user, password);
            req.login(registeredUser, (err) => {
                if (err) {
                    return next(err);
                }
                req.flash("success", "Welcome to Yelp Camp!");
                res.redirect("/campgrounds");
            });
        } catch (e) {
            req.flash("error", e.message);
            res.redirect("/register");
        }
    })
);

router.get("/login", (req, res) => {
    res.render("users/login");
});

router.post(
    "/login",
    storeReturnTo,
    passport.authenticate("local", {
        failureFlash: true,
        failureRedirect: "/login",
    }),
    (req, res) => {
        req.flash("success", "Welcome Back!");
        const redirectUrl = res.locals.returnTo || "/campgrounds";
        res.redirect("redirectUrl");
    }
);

router.get("/logout", (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash("success", "Goodbye!");
        res.redirect("/campgrounds");
    });
});

module.exports = router;
