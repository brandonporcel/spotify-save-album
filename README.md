# Save Albums

A small script to save albums to your personal Spotify library. This project is designed for individual use and makes it easy to automate adding albums to your Spotify library.

[guides](https://github.com/brandonporcel/spotify-save-album?tab=readme-ov-file#-guides) 
## ![image](https://github.com/user-attachments/assets/f4e83148-a018-43cc-ab59-7cf243a64a30)

## 📦 Installation

### 1. **Create an app on Spotify Dashboard**

Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/) and create a new app to obtain your **Client ID** and **Client Secret**.

### 2. **Get a refresh token**

Follow the [Spotify official example](https://github.com/spotify/web-api-examples) to generate a refresh token that doesn’t expire:

- Navigate to the `/authorization/authorization_code` folder in the example.
- Complete the flow to get a token and save it for use in this project.

### 3. **Set up environment variables**

Create a `.env` file in the project root directory with the following content:

```env
CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret
REFRESH_TOKEN=your_refresh_token
REDIRECT_URI=http://localhost:8888/callback
```

### 4. **Install dependencies**

Run the following command to install the project dependencies:

```bash
npm install
```

### 5. **Set the list of albums**

Edit the configuration file to add the albums you want to save:

```js
const albums = [
  "Stevie Wonder - Songs in the Key of Life (1976)",
  "Natalia Lafourcade - De Todas las Flores (2022)",
];
```

### 6. **Run index**

```js
npm run dev
```

## 📋 TODO List

- [ ] FIX RYM GUIDES. format has to be artist - album (year)[optional]
- [x] UI (User Interface): Add an input field and a button for easier album entry.
- [ ] Guides: Create guides for non-developers explaining how to extract innerHTML from a webpage.
- [ ] GitHub Action: Fix the action to upload a .txt file with unsaved albums.
- [ ] Add multi-language support for prompts (EN)
- [ ] Add IA feature to determine if found album its same than the search one
- [ ] For 600latam: add another script for only get albums on playlist or albums who are only on youtube

#### 🛠️ Technologies Used

- Node js
- Spotify Web API SDK

## 📚 Guides

### 600 LATAM
- [list](https://github.com/brandonporcel/spotify-save-album/blob/main/src/guides/600-latam/index.md)

### RYM

- [chart](https://github.com/brandonporcel/spotify-save-album/blob/main/src/guides/rym/chart/chart.md)
- [playlist](https://github.com/brandonporcel/spotify-save-album/blob/main/src/guides/rym/playlist/playlist.md)

## 📝 Contributing

Open! Make a pr

## 📝 Feedback

I’d love to hear your thoughts! Contact me via [mail](mailto:brandon7.7porcel@gmail.com) or [linkedin](https://www.linkedin.com/in/brandonporcel/)
