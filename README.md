# Save albums

little script that saves albums to own library
works only for oneself, download the repository and get

![image](https://github.com/user-attachments/assets/f4e83148-a018-43cc-ab59-7cf243a64a30)

## instalation
- create app in spotify developer dashboard
- get client id & client secret
- follow spotify demo example to get a refresh token that doesnt expire [/spotify/web-api-examples](https://github.com/spotify/web-api-examples). go to /authorization/authorization_code
- set .env vars
- `npm i` && set albums to save && `npm run dev`


### TODO

- UI (simple input and button)
- Add console logs to keep user updated
- Add verification that albums has been saved correctly
- Complete types
- Make guides explaining how get innerHTML from body for no devs.