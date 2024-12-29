const express = require('express');
const { resumeSpotify, pauseSpotify, skipSpotify, prevSpotify, toggleShuffle: toggleSpotifyShuffle } = require('./modules/spotify');
const { togglePlayback, skipTrack, previousTrack, toggleShuffle: toggleSoundCloudShuffle } = require('./modules/soundcloud');
const app = express();

app.use(express.json());
app.use(express.static('public'));

let soundCloudInitialized = false;

app.post('/spotify/play', async (req, res) => {
    try {
        await resumeSpotify();
        if (soundCloudInitialized) await togglePlayback(false);
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

app.post('/spotify/pause', async (req, res) => {
    try {
        await pauseSpotify();
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

app.post('/spotify/skip', async (req, res) => {
    try {
        await skipSpotify();
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

app.post('/spotify/prev', async (req, res) => {
    try {
        await prevSpotify();
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

app.post('/spotify/shuffle', async (req, res) => {
    try {
        const state = req.body.state;
        await toggleSpotifyShuffle(state);
        res.json({ shuffleState: state });
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

app.post('/soundcloud/init', async (req, res) => {
    try {
        soundCloudInitialized = true;
        const url = req.body.url || null;
        await require('./modules/soundcloud').initSoundCloud(url);
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

app.post('/soundcloud/play', async (req, res) => {
    try {
        await togglePlayback(true);
        await pauseSpotify();
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

app.post('/soundcloud/pause', async (req, res) => {
    try {
        await togglePlayback(false);
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

app.post('/soundcloud/skip', async (req, res) => {
    try {
        await skipTrack();
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

app.post('/soundcloud/prev', async (req, res) => {
    try {
        await previousTrack();
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});


app.post('/soundcloud/shuffle', async (req, res) => {
    try {
        const state = req.body.state;
        await toggleSoundCloudShuffle();
        res.json({ shuffleState: state });
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
