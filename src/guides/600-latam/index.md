# 🎵 Guide to Extract the Top 600 LATAM Albums

This guide explains how to retrieve individual albums from the **"600 Best LATAM Albums"** article by inspecting elements on the webpage. Follow these steps to build an array of albums formatted as `Artist - Album`.

![600 latam list](1.png)
[cta edit](https://github.com/brandonporcel/spotify-save-album/edit/main/src/script.ts) <br/>
[cta code](https://github.com/brandonporcel/spotify-save-album/blob/test/src/guides/600-latam/index.md#-example-script)

---

## 🚀 Steps to Extract Albums

### 1. **Access the Album List**

Go to the official list: [600discoslatam.com](https://www.600discoslatam.com/)

### 2. **Inspect the Web Elements**

1. Open the browser's **Developer Tools**:
   - Press `F12` or `Ctrl + Shift + I` in Chrome.
2. Navigate to the **Elements** tab to inspect the structure of the page.

### 3. **Locate Album Titles**

Find the album container using the correct CSS selector. In this case, use:

```javascript
document.querySelectorAll(
  "h2.gb-headline.gb-headline-770ac6a1.gb-headline-text"
);
```

This selector targets the elements containing album titles and artist names.

### 4. Extract and Format Albums

Run the following script in the Console tab of the Developer Tools:

```js
const albums = Array.from(
  document.querySelectorAll(
    "h2.gb-headline.gb-headline-770ac6a1.gb-headline-text"
  )
)
  .map((el) => el.innerText)
  .map((text) => text.replace(/«|»/g, "").replace(/\n/g, " - "));

console.log(albums);
```

### 5. Save the Album List

Copy the resulting array and paste it into the `index.ts` file in the `ALBUMS` variable, so it looks like this:

```js
const albums = [
  "Ricardo Villalobos - Alcachofa",
  "Rata Blanca - Magos, espadas y rosas",
  ...
];
```

## 📋 Example Script

Here’s a simplified example to extract and display the first 10 albums:

```js
const albums = Array.from(
  document.querySelectorAll(
    "h2.gb-headline.gb-headline-770ac6a1.gb-headline-text"
  )
)
  .map((el) =>
    el.innerText
      .replace("«", "")
      .replace("»", " -")
      .split(" - ")
      .reverse()
      .join(" - ")
  )
  .slice(0, 10);

console.log(albums);
```

[cta edit](https://github.com/brandonporcel/spotify-save-album/edit/main/src/script.ts)
