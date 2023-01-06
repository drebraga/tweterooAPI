import express from "express";
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
    res.send("OK");
})

server.get("/tweets", (req, res) => {
    const lastTweets = [];
    const max = TWEETS.length < MAXSHOW ? TWEETS.length : MAXSHOW;
    for (let i = 0; i < max; i++) {
        lastTweets.push({
            ...TWEETS[i], avatar: USERS.find(e => e.username === TWEETS[i].username).avatar
        });
    }
    res.send(lastTweets);
})

server.post("/tweets", (req, res) => {
    const tweet = req.body;
    if (USERS.some(e => e.username === tweet.username)) {
        TWEETS.unshift(tweet);
        res.send("OK");
    } else {
        res.send("UNAUTHORIZED");
    }

})

server.listen(PORT, () => {
    console.log(`Server running on port number: ${PORT}`)
});