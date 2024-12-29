# SpotiCloud

SpotiCloud is a project that integrates Spotify with SoundCloud, allowing users to stream their music seamlessly across Spoitfy and SoundCloud.

## Features

- **Spotify Integration**: Connect your Spotify account to controll the player via the web UI.
- **SoundCloud Integration**: SoundCloud Integration via Puppeteer functionality.
- **Auto-Pause**: Automatically pauses the playback of one service, if the other is getting active.
- **Automatic token generator**: Automatically generates a new Spotify token, if provided with the right credentials.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/jjannix/SpotiCloud.git
    ```
2. Navigate to the project directory:
    ```bash
    cd SpotiCloud
    ```
3. Install the dependencies:
    ```bash
    npm install
    ```
4. Setup config.json
    - Create a `config.json` file int the project root.
    - Add the following values
```json
      clientID: "YOUR_CLIENT_ID"
      clientSecret: "YOUR_CLIENT_SECRET"
      refreshToken: "YOUR_REFRESH_TOKEN"
      deviceID: "YOUR_DEVICE_ID"
      updateTimeMS:	3300000

      SOUNDCLOUD_URL: "YOUR_SOUNDCLOUD_PLAYLIST_URL"
```

## Usage

1. Start the application:
    ```bash
    npm start
    ```
2. Check if the token generation succeeded in the terminal.
3. Open your browser and go to `http://localhost:3000`.
4. Initialize the SoundCloud setup and enter your URL
5. Enjoy your music!