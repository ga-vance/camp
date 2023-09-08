const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const path = require("path");
const methodOverride = require("method-override");
const campgrounds = require("./routes/camprounds");
const reviews = require("./routes/reviews");

const PORT = 3000;

mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Connected to Database");
});
const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/reviews", reviews);

app.get("/", (req, res) => {
    res.render("home");
});

app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something has gone terribly wrong!";
    res.status(statusCode).render("error", { err });
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
