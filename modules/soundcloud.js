const puppeteer = require('puppeteer');
const SOUNDLOUD_URL = require('../config.json');
const { timeout } = require('puppeteer');

let browser;
let page;

const initSoundCloud = async (url = SOUNDLOUD_URL) => {
    browser = await puppeteer.launch({ headless: false });
    page = await browser.newPage();
    page.setDefaultTimeout(10000);

    try {
        await page.setViewport({ width: 981, height: 838 });
        await page.goto(url);
        console.log('Navigated to SoundCloud playlist.');
        await handleCookieBanner(page);
    } catch (error) {
        console.error('Error initializing SoundCloud:', error);
        throw error;
    }
};


const handleCookieBanner = async (page) => {
    try {
        const declineButton = await page.waitForSelector('#onetrust-reject-all-handler', { timeout: 5000 });
        await declineButton.click();
        console.log('Declined cookies.');
    } catch (error) {
        console.warn('Cookie banner not found or already declined.');
    }
};


const togglePlayback = async (play) => {
    try {
        const playButtonSelector = 'button.playControl';
        await page.waitForSelector(playButtonSelector, { timeout: 5000 });
        const playButton = await page.$(playButtonSelector);

        const isPlaying = await page.evaluate(button => button.classList.contains('playing'), playButton);
        if (play && !isPlaying) {
            await playButton.click();
        } else if (!play && isPlaying) {
            await playButton.click();
        }
    } catch (error) {
        console.error('Error toggling playback:', error);
    }
};


const skipTrack = async () => {
    try {
        const nextTrackButtonSelector = 'button.playControls__next';
        await page.waitForSelector(nextTrackButtonSelector, { timeout: 5000 });
        const nextTrackButton = await page.$(nextTrackButtonSelector);
        await nextTrackButton.click();
    } catch (error) {
        console.error('Error skipping track:', error);
    }
};


const previousTrack = async () => {
    try {
        const previousTrackButtonSelector = 'button.playControls__prev';
        await page.waitForSelector(previousTrackButtonSelector, { timeout: 5000 });
        const previousTrackButton = await page.$(previousTrackButtonSelector);
        await previousTrackButton.click();
    } catch (error) {
        console.error('Error skipping to previous track:', error);
    }
};


const toggleShuffle = async () => {
    try {

        const shuffleButtonSelector = 'button.shuffleControl';
        await page.waitForSelector(shuffleButtonSelector, { timeout: 5000 });
        const shuffleButton = await page.$(shuffleButtonSelector);


        await shuffleButton.click();
        console.log('Toggled shuffle.');
    } catch (error) {
        console.error('Error toggling shuffle:', error);
    }
};

const toggleLoop = async() => {
    try {
        const loopButtonSelector = 'button.loopControl';
        await page.waitForSelector(loopButtonSelector, {timeout: 5000});
        const loopButton = await page.$(loopButtonSelector);

        await loopButton.click();
        console.log('Toggled loop.');
    } catch (error) {
        console.error('Error toggling loop', error);
    }
};

const refreshPage = async () => {
    try {
        if (page) {
            await page.reload({ waitUntil: 'networkidle0' });
            console.log('Page refreshed successfully.');
            await handleCookieBanner(page);
        } else {
            console.error('Page not initialized');
        }
    } catch (error) {
        console.error('Error refreshing page:', error);
    }
};

const getCurrentTrack = async () => {
    try {
        const trackInfo = await page.evaluate(() => {
            const trackElement = document.querySelector('.playbackSoundBadge__titleLink');
            const artistElement = document.querySelector('.playbackSoundBadge__lightLink');
            const coverElement = document.querySelector('.playbackSoundBadge__avatarImage');
            const playButton = document.querySelector('button.playControl');
            
            if (!trackElement) return null;

            let name = trackElement.textContent.trim();
            let artist = artistElement ? artistElement.textContent.trim() : '';
            if (!artist || artist === name) {
                artist = 'Unknown Artist';
            }

            return {
                name,
                artist,
                coverUrl: coverElement ? coverElement.src : null,
                isPlaying: playButton ? playButton.classList.contains('playing') : false
            };
        });

        return trackInfo;
    } catch (error) {
        console.error('Error getting current track:', error);
        return null;
    }
};

module.exports = {
    initSoundCloud,
    togglePlayback,
    skipTrack,
    previousTrack,
    toggleShuffle,
    toggleLoop,
    refreshPage,
    getCurrentTrack
};
