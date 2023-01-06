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
    res.sendStatus(201);
});

server.get("/tweets", (req, res) => {
    let page = 1;
    req.query.page ? page = parseInt(req.query.page) : false;
    if (!(page >= 1)) {
        return res.status(400).send("Informe uma página válida!");
    }
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

server.get("/tweets/:username", (req, res) => {
    const { username } = req.params;
    const userTweets = TWEETS.filter(e => {
        if (username === e.username) {
            return {
                ...e, avatar: USERS.find(u => u.username === e.username).avatar
            }
        }
    })
    res.send(userTweets);
});

server.post("/tweets", (req, res) => {
    const { tweet } = req.body;
    const { user } = req.headers;
    if (USERS.some(e => e.username === user)) {
        TWEETS.unshift({ tweet, username: user });
        res.sendStatus(201);
    } else {
        res.status(401).send("UNAUTHORIZED");
    }
});

server.listen(PORT, () => {
    console.log(`Server running on port number: ${PORT}`);
});