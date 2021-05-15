const express = require("express");
const OAuth = require("oauth");
const cors = require("cors");
const querystring = require("querystring");
const app = express();

app.use(cors());
app.use(express.json());

const CLIENT_ID = "999999350";
const CLIENT_SECRET = "W3k5ED46RSJme0mOhaRQXYe1mAdZwi3w";
const REDIRECT_URI = "http://localhost:3000/oauth";

app.get("/inoreader/authURI", (request, response) => {
  const CSRF_PROTECTION_STRING = "111";
  const qs = querystring.stringify({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: 'read write',
    state: CSRF_PROTECTION_STRING,
  })
  const authURI = `https://www.innoreader.com/oauth2/auth?${qs}`;
  return response.json({
    message: "create success",
    data: {
      auth_uri: authURI,
    },
  });
});

app.get("/inoreader/token", (request, response) => {
  const { code = "" } = request.query;

  var OAuth2 = OAuth.OAuth2;
  var oauth2 = new OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    "https://www.innoreader.com/",
    "oauth2/auth",
    "oauth2/token",
    null
  );
  oauth2.getOAuthAccessToken(
    code,
    {
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    },
    function (e, access_token, refresh_token, results) {
      if (e) {
        console.log("e: ", e);
      } else {
        console.log("bearer: ", access_token);
        console.log(typeof response.json);
        return response.json({
          message: "create success",
          data: { token: access_token },
        });
      }
    }
  );
});

const PORT = 3777;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
