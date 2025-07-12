# 🎵 Guide to Extract the Top 600 LATAM Albums

Retrieve albums from the **“600 Best LATAM Albums”** article using these lightweight JavaScript snippets in your browser console. Each script extracts an array of albums in the format: <b>Artist - Album</b>

> [spotify](#spotify-albums-script) - [youtube](#youtube-albums-script)

![600 latam list](og.png)

---

## 📋 Spotify Albums Script

```js
const getAlbums = (n = 0) => {
  const titles = Array.from(
    document.querySelectorAll(
      "h2.gb-headline.gb-headline-770ac6a1.gb-headline-text"
    )
  );

  const filteredTitles = titles.filter((title) => {
    const parent = title.closest("div").parentElement;
    const albumLink = parent.previousElementSibling?.querySelector("a");
    return (
      albumLink &&
      (albumLink.href.includes("spotify") ||
        albumLink.href.includes("songwhip"))
    );
  });

  const albums = filteredTitles.map((title) =>
    title.innerText
      .replace(/[«“]/g, "")
      .replace(/[»”]/g, " -")
      .replace(/\u2013|\u2014/g, ",") // Replace en dash/em dash with comma
      .replace(/\s+,/g, ",") // Remove spaces before commas
      .split(" - ")
      .reverse()
      .join(" - ")
  );

  return albums.slice(n * 10, n * 10 + 10);
};

getAlbums(0);
```

## 📋 YouTube Albums Script

```js
const getAlbums = (n = 0) => {
  const links = Array.from(document.querySelectorAll('a[href*="youtube"]')).map(
    (el) => el.href
  );

  return links.slice(n * 10, n * 10 + 10);
};

getAlbums(0);
```

## ⚡️ How to use

1. Open the 600discoslatam.com website
2. Open your browser console (Cmd+Option+J on Mac, Ctrl+Shift+J on Windows).
3. Paste one of the scripts above and press Enter.
4. Run getAlbums(0) to get the first 10 albums, getAlbums(1) for the next 10, and so on.

## 📦 Related

- [Edit script on GitHub](https://github.com/brandonporcel/spotify-save-album/edit/main/src/script.ts)
- [Spotify Save UI](https://spotify-save-album.onrender.com/)
- [600discoslatam.com](http://600discoslatam.com/)
