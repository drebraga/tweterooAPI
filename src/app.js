import express, { query } from "express";
import cors from "cors";
import USERS from "./USERS.js";
import TWEETS from "./TWEETS.js";

const server = express();
const PORT = 5000;
const MAXSHOW = 10;

server.use(express.json());
server.use(cors());

server.post("/sign-up", (req, res) => {
    const user = req.body;
    USERS.push(user);
    res.status(201).send("OK");
});

server.get("/tweets", (req, res) => {
    const page = parseInt(req.query.page);
    const lastTweets = [];
    const min = 0 + (MAXSHOW * (page - 1));
    const max = TWEETS.length < MAXSHOW * page ? TWEETS.length : MAXSHOW * page;
    for (let i = min; i < max; i++) {
        lastTweets.push({
            ...TWEETS[i], avatar: USERS.find(e => e.username === TWEETS[i].username).avatar
        });
    }
    res.send(lastTweets);
});

server.post("/tweets", (req, res) => {
    const { tweet } = req.body;
    const { user } = req.headers;
    if (USERS.some(e => e.username === user)) {
        TWEETS.unshift({ tweet, username: user });
        res.status(201).send("OK");
    } else {
        res.status(401).send("UNAUTHORIZED");
    }
});

server.listen(PORT, () => {
    console.log(`Server running on port number: ${PORT}`);
});