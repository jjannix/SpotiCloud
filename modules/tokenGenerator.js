const axios = require("axios");
const tokenConfig = require("../config.json");

let mainToken = "";

const generateToken = async (clientID, clientSecret, refreshToken) => {
    console.log("Attempting to generate token...");
    try {
        const response = await axios({
            method: "post",
            url: "https://accounts.spotify.com/api/token",
            headers: {
                Authorization: "Basic " + Buffer.from(clientID + ":" + clientSecret).toString("base64"),
                "Content-Type": "application/x-www-form-urlencoded",
            },
            data: new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: refreshToken,
            }).toString(),
        });
        
        const token = response.data.access_token;
        console.log("Token generated successfully:", token ? `${token.substring(0, 10)}...` : "NO TOKEN RECEIVED");
        console.log("Response data:", response.data);
        
        return token;
    } catch (error) {
        console.error("Error generating token:");
        if (error.response) {
            console.error("Response status:", error.response.status);
            console.error("Response data:", error.response.data);
        } else {
            console.error("Error:", error.message);
        }
        return null;
    }
};

const refreshTokens = async () => {
    console.log("Starting token refresh...");
    const mainConf = tokenConfig.tokenCredentials.main;
    console.log("Config loaded, client ID length:", mainConf.clientID.length);
    console.log("Refresh token length:", mainConf.refreshToken.length);
    
    const newToken = await generateToken(mainConf.clientID, mainConf.clientSecret, mainConf.refreshToken);
    console.log("New token received:", newToken ? `${newToken.substring(0, 10)}...` : "NO TOKEN");
    
    mainToken = newToken || mainToken;
    
    if (!mainToken) {
        console.error("Failed to refresh mainToken - token is null or undefined");
        throw new Error("Failed to generate token");
    }
    console.log("Token refresh completed. Token exists:", !!mainToken);
    console.log("Token starts with:", mainToken.substring(0, 10) + "...");
};

const startTokenRefresh = async () => {
    console.log("Starting initial token refresh...");
    try {
        await refreshTokens();
        console.log("Initial token refresh successful");
        setInterval(refreshTokens, tokenConfig.updateTimeMS);
        return Promise.resolve();
    } catch (error) {
        console.error("Error in startTokenRefresh:", error);
        throw error;
    }
};

const getMainToken = () => {
    console.log("Getting main token value. Token exists:", !!mainToken);
    if (mainToken) {
        console.log("Token starts with:", mainToken.substring(0, 10) + "...");
    }
    return mainToken;
};

module.exports = { startTokenRefresh, getMainToken };