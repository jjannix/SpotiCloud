const axios = require("axios");
const { startTokenRefresh, getMainToken } = require("./tokenGenerator");
const { deviceID } = require("../config.json");

const resumeSpotify = async () => {
    console.log("Attempting to resume Spotify...");
    try {
        const access_token = getMainToken();
        console.log("Token retrieved:", access_token ? "Token exists" : "No token");

        if (!access_token) {
            console.error("Spotify token not available. Check tokenGenerator implementation.");
            throw new Error("Spotify token unavailable");
        }

        console.log("Making request to Spotify API...");
        console.log("Using device ID:", deviceID);

        await axios({
            method: 'put',
            url: `https://api.spotify.com/v1/me/player/play?device_id=${deviceID}`,
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log("Successfully resumed Spotify playback");
    } catch (error) {
        console.error("Error resuming Spotify:", error);
        if (error.response) {
            console.error("Response status:", error.response.status);
            console.error("Response data:", error.response.data);
        }
        throw error;
    }
};

const pauseSpotify = async () => {
    console.log("Attempting to pause Spotify...");
    try {
        const access_token = getMainToken();
        console.log("Token retrieved:", access_token ? "Token exists" : "No token");

        if (!access_token) {
            console.error("Spotify token not available. Check tokenGenerator implementation.");
            throw new Error("Spotify token unavailable");
        }

        console.log("Making request to Spotify API...");
        console.log("Using device ID:", deviceID);

        await axios({
            method: 'put',
            url: `https://api.spotify.com/v1/me/player/pause?device_id=${deviceID}`,
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json'
            }
        });
        console.log("Successfully paused Spotify playback");
    } catch (error) {
        console.error("Error pausing Spotify:", error);
        if (error.response) {
            console.error("Response status:", error.response.status);
            console.error("Response data:", error.response.data);
        }
        throw error;
    }
};

const skipSpotify = async () => {
    console.log("Attempting to skip to next track...");
    try {
        const access_token = getMainToken();
        console.log("Token retrieved:", access_token ? "Token exists" : "No token");

        if (!access_token) {
            console.error("Spotify token not available. Check tokenGenerator implementation.");
            throw new Error("Spotify token unavailable");
        }

        console.log("Making request to Spotify API...");
        console.log("Using device ID:", deviceID);

        await axios({
            method: 'post',
            url: `https://api.spotify.com/v1/me/player/next?device_id=${deviceID}`,
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json'
            }
        });
        console.log("Successfully skipped to next track");
    } catch (error) {
        console.error("Error skipping track:", error);
        if (error.response) {
            console.error("Response status:", error.response.status);
            console.error("Response data:", error.response.data);
        }
        throw error;
    }
};

const prevSpotify = async () => {
    console.log("Attempting to go to previous track...");
    try {
        const access_token = getMainToken();
        console.log("Token retrieved:", access_token ? "Token exists" : "No token");

        if (!access_token) {
            console.error("Spotify token not available. Check tokenGenerator implementation.");
            throw new Error("Spotify token unavailable");
        }

        console.log("Making request to Spotify API...");
        console.log("Using device ID:", deviceID);

        await axios({
            method: 'post',
            url: `https://api.spotify.com/v1/me/player/previous?device_id=${deviceID}`,
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json'
            }
        });
        console.log("Successfully went to previous track");
    } catch (error) {
        console.error("Error going to previous track:", error);
        if (error.response) {
            console.error("Response status:", error.response.status);
            console.error("Response data:", error.response.data);
        }
        throw error;
    }
};

const toggleShuffle = async (state = null) => {
    console.log("Attempting to toggle shuffle mode...");
    try {
        const access_token = getMainToken();
        console.log("Token retrieved:", access_token ? "Token exists" : "No token");

        if (!access_token) {
            console.error("Spotify token not available. Check tokenGenerator implementation.");
            throw new Error("Spotify token unavailable");
        }


        if (state === null) {
            const response = await axios({
                method: 'get',
                url: 'https://api.spotify.com/v1/me/player',
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            });
            state = !response.data.shuffle_state;
        }

        console.log("Making request to Spotify API...");
        console.log("Setting shuffle state to:", state);

        await axios({
            method: 'put',
            url: `https://api.spotify.com/v1/me/player/shuffle?state=${state}&device_id=${deviceID}`,
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json'
            }
        });
        console.log(`Successfully ${state ? 'enabled' : 'disabled'} shuffle mode`);
        return state;
    } catch (error) {
        console.error("Error toggling shuffle mode:", error);
        if (error.response) {
            console.error("Response status:", error.response.status);
            console.error("Response data:", error.response.data);
        }
        throw error;
    }
};

const init = async () => {
    console.log("Starting initialization...");
    try {
        await startTokenRefresh();
        console.log("Token refresh completed, attempting to resume Spotify...");
        await resumeSpotify();
        console.log("Initialization completed successfully");
    } catch (error) {
        console.error("Failed to initialize Spotify player:", error);
    }
};

const getCurrentTrack = async () => {
    console.log("Getting current track information...");
    try {
        const access_token = getMainToken();
        if (!access_token) {
            throw new Error("Spotify token unavailable");
        }

        const response = await axios({
            method: 'get',
            url: 'https://api.spotify.com/v1/me/player/currently-playing',
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        });

        if (response.data) {
            const track = response.data.item;
            return {
                name: track.name,
                artist: track.artists.map(artist => artist.name).join(', '),
                album: track.album.name,
                coverUrl: track.album.images[0]?.url,
                isPlaying: response.data.is_playing
            };
        }
        return null;
    } catch (error) {
        console.error("Error getting current track:", error);
        throw error;
    }
};

setTimeout(() => {
    console.log("Starting main execution...");
    init();
}, 1000);

module.exports = {
    resumeSpotify,
    pauseSpotify,
    skipSpotify,
    prevSpotify,
    toggleShuffle,
    init,
    getCurrentTrack
};