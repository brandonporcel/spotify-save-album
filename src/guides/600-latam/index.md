# 🎵 Guide to Extract the Top 600 LATAM Albums

This guide explains how to retrieve individual albums from the **"600 Best LATAM Albums"** article by inspecting elements on the webpage. Follow these steps to build an array of albums formatted as `Artist - Album`.

[cta code](https://github.com/brandonporcel/spotify-save-album/blob/main/src/guides/600-latam/index.md#-example-script)<br/>
[cta edit](https://github.com/brandonporcel/spotify-save-album/edit/main/src/script.ts) <br/>

![600 latam list](1.png)

---

## 📋 Example Script

Here’s a simplified example to extract and display the first 10 albums:

```js
const getAlbums = (n = 0) => {
  const a = Array.from(
    document.querySelectorAll(
      "h2.gb-headline.gb-headline-770ac6a1.gb-headline-text"
    )
  ).map((el) =>
    el.innerText
      .replace("«", "")
      .replace("»", " -")
      .replace("“", "")
      .replace("”", " -")
      .replace(/\u2013|\u2014/g, ",") // Reemplazar guion largo o mediano con coma
      .replace(/\s+,/g, ",") // Eliminar espacios antes de las comas
      .split(" - ")
      .reverse()
      .join(" - ")
  );

  const start = n * 10;
  const end = start + 10;
  return a.slice(start, end);
};

getAlbums(0);
```

[cta save ui](http://spotify-save-album.onrender.com/)<br/>
[600discoslatam.com](http://600discoslatam.com)<br/>
[cta edit script](https://github.com/brandonporcel/spotify-save-album/edit/main/src/script.ts)
