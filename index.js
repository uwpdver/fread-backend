require("dotenv").config();
const express = require("express");
const OAuth = require("oauth");
const cors = require("cors");
const querystring = require("querystring");
const app = express();

app.use(cors());
app.use(express.json());

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const INOREADER_DOMAIN = process.env.INOREADER_DOMAIN;

app.get("/inoreader/authURI", (request, response) => {
  const CSRF_PROTECTION_STRING = "111";
  const authURI = `${INOREADER_DOMAIN}/oauth2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=read write&state=${CSRF_PROTECTION_STRING}`;
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
    `${INOREADER_DOMAIN}/`,
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
        return response.status(500).send(e.code);
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

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
