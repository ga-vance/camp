const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: "64fbdff4b643f7039cf5d9bb",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ],
            },
            title: `${sample(descriptors)} ${sample(places)}`,
            description:
                "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sed sapiente a, aspernatur dicta vel ex voluptatibus, earum tenetur quidem beatae consequatur voluptatem porro voluptas quod, eveniet delectus dolor odio facere.",
            price,
            images: [
                {
                    url: "https://res.cloudinary.com/dvfreypc6/image/upload/v1694620239/YelpCamp/qrt0bqmdyt6lc7mdjkfs.jpg",
                    filename: "YelpCamp/qrt0bqmdyt6lc7mdjkfs",
                },
                {
                    url: "https://res.cloudinary.com/dvfreypc6/image/upload/v1694620242/YelpCamp/s5x9so7hchaggxb1vw83.jpg",
                    filename: "YelpCamp/s5x9so7hchaggxb1vw83",
                },
            ],
        });
        await camp.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});
