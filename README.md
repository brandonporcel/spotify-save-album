# Save albums

<i>[cta edit](https://github.com/brandonporcel/spotify-save-album/edit/main/src/index.ts)</i>

little script that saves albums to own library
works only for oneself, download the repository and get

![image](https://github.com/user-attachments/assets/f4e83148-a018-43cc-ab59-7cf243a64a30)

## instalation

- create app in spotify developer dashboard
- get client id & client secret
- follow spotify demo example to get a refresh token that doesnt expire [/spotify/web-api-examples](https://github.com/spotify/web-api-examples). go to /authorization/authorization_code
- set .env vars
- `npm i` && set albums to save && `npm run dev`

#### example albums list

```js
const albums = [
  "Stevie Wonder - Songs in the Key of Life (1976)",
  "Natalia Lafourcade - De Todas las Flores (2022)",
];
```

### TODO

- UI (simple input and button)
- Add console logs to keep user updated
- Add verification that albums has been saved correctly
- Complete types
- Make guides explaining how get innerHTML from body for no devs.
- Fix ghaction to push unsaved albumts txt
- Escapar las tildes de los títulos en la validación
