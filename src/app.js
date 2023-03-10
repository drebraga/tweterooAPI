import express from "express";
import cors from "cors";
import USERS from "./USERS.js";
import TWEETS from "./TWEETS.js";

const server = express();
const PORT = 5000;
const MAXSHOW = 10;
const CREATED = 201;
const BADREQUEST = 400;
const UNAUTHORIZED = 401;
const IS_STRING = "string";

server.use(express.json());
server.use(cors());

server.post("/sign-up", (req, res) => {
    const user = req.body;
    if (!user.username || !user.avatar || typeof user.username !== IS_STRING || typeof user.avatar !== IS_STRING) {
        return res.status(BADREQUEST).send("Todos os campos são obrigatórios!");
    }
    USERS.push(user);
    return res.sendStatus(CREATED);
});

server.get("/tweets", (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    if (page < 1) {
        return res.status(BADREQUEST).send("Informe uma página válida!");
    }
    const lastTweets = [];
    const min = 0 + (MAXSHOW * (page - 1));
    const max = TWEETS.length < MAXSHOW * page ? TWEETS.length : MAXSHOW * page;
    for (let i = min; i < max; i++) {
        lastTweets.push({
            ...TWEETS[i], avatar: USERS.find(e => e.username === TWEETS[i].username).avatar
        });
    }
    return res.send(lastTweets);
});

server.get("/tweets/:username", (req, res) => {
    const { username } = req.params;
    const userTweets = TWEETS.filter(e => {
        if (username === e.username) {
            return {
                ...e, avatar: USERS.find(u => u.username === e.username).avatar
            };
        } else {
            return false;
        }
    });
    res.send(userTweets);
});

server.post("/tweets", (req, res) => {
    const { tweet } = req.body;
    const { user } = req.headers;
    if (!user || !tweet || typeof user !== IS_STRING || typeof tweet !== IS_STRING) {
        return res.status(BADREQUEST).send("Todos os campos são obrigatórios!");
    } else if (USERS.some(e => e.username === user)) {
        TWEETS.unshift({ tweet, username: user });
        return res.sendStatus(CREATED);
    } else {
        return res.sendStatus(UNAUTHORIZED);
    }
});

server.listen(PORT, () => {
    console.log(`Server running on port number: ${PORT}`);
});