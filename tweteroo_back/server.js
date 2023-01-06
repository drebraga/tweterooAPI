import express from "express";
import cors from "cors";
import USERS from "./USERS.js";
import TWEETS from "./TWEETS.js";

const server = express();
const PORT = 5000;

server.use(express.json());
server.use(cors());

server.post("/sign-up", (req, res) => {
    const user = req.body;
    USERS.push(user);
    res.send("OK");
})

server.get("/tweets", (req, res) => {
    const lastTweets = [];
    const max = TWEETS.length < 10 ? TWEETS.length : 10;
    for (let i = 0; i < max; i++) {
        lastTweets.push({
            ...TWEETS[i], avatar: USERS.find(e => e.username === TWEETS[i].username).avatar
        });
    }
    console.log(lastTweets);
    res.send(lastTweets);
})

server.post("/tweets", (req, res) => {
    const tweet = req.body;
    TWEETS.unshift(tweet);
    res.send("OK");
})

server.listen(PORT, () => {
    console.log(`Server running on port number: ${PORT}`)
});