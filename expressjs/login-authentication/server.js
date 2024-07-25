const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const PORT = 3000;

const users = [];

app.use(express.json());

app.get("/users", (req, res) => {
	res.json(users);
});

app.post("/users/create", async (req, res) => {
	const { username, password } = req.body;

	const user = users.find((user) => user.username === username);

	if (user) {
		return res.send(`User with username ${username} already exists`);
	}

	try {
		const hashedPassword = await bcrypt.hash(password, 10);
		users.push({ username: username, password: hashedPassword });
		res.sendStatus(201);
	} catch {
		res.sendStatus(500);
	}
});

app.post("/users/login", async (req, res) => {
	const { username, password } = req.body;

	const user = users.find((user) => user.username === username);

	if (!user) {
		return res.status(400).send("user not found");
	}

	try {
		if (await bcrypt.compare(password, user.password)) {
			res.status(201).send("Login Successful");
		} else {
			res.send("Incorrect username and password");
		}
	} catch {
		res.sendStatus(500);
	}
});

app.listen(PORT, () => {
	console.log(`server listening on port ${PORT}`);
});
