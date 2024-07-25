const express = require("express");
const mongoose = require("mongoose");
const app = express();

mongoose.connect("mongodb://localhost/urlShortener");
const UrlShortener = require("./models/urlShortener.js");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
	const urls = await UrlShortener.find();
	res.render("index", { urls: urls });
});

app.post("/shorten", async (req, res) => {
	await UrlShortener.create({ full: req.body.fullUrl });

	res.redirect("/");
});

app.get("/delete/:shortUrl", async (req, res) => {
	try {
		await UrlShortener.deleteOne({ short: req.params.shortUrl });
		res.redirect("/");
	} catch {
		res.status(500).send("Could not delete");
	}
});

app.get("/:shortURL", async (req, res) => {
	const urlObject = await UrlShortener.findOne({ short: req.params.shortURL });
	if (!urlObject) return res.status(404).send("short url not found");
	urlObject.clicks++;
	urlObject.save();
	res.redirect(urlObject.full);
});

app.listen(process.env.PORT || 3000);
