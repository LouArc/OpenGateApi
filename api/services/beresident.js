const axios = require("axios");
const { parse } = require("cookie");

async function generateCookie(user, password) {
  const params = new URLSearchParams({ user, password, rem: 1 }),
    response = await axios.post(
      "https://app.beresident.mx/usuarios/login",
      params,
      {
        withCredentials: true,
        maxRedirects: 0,
        beforeRedirect: () => {
          console.log("Redirect...");
        },
        validateStatus: (status) => {
          return status === 302;
        },
        headers: {
          accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
          "accept-language": "en-US,en;q=0.9,es;q=0.8",
          "cache-control": "max-age=0",
          "content-type": "application/x-www-form-urlencoded",
          "sec-ch-ua":
            '"Chromium";v="122", "Not(A:Brand";v="24", "Microsoft Edge";v="122"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "document",
          "sec-fetch-mode": "navigate",
          "sec-fetch-site": "same-origin",
          "sec-fetch-user": "?1",
          "upgrade-insecure-requests": "1",
        },
      }
    ),
    cookies = parse(response.headers["set-cookie"][0]);

  return cookies.CAKEPHP;
}

async function openGate(token, id) {
  fetch(`https://app.beresident.mx/accesos/open2/${id}.json`, {
    headers: {
      accept: "*/*",
      "accept-language": "en,es;q=0.9",
      "sec-ch-ua":
        '"Chromium";v="122", "Not(A:Brand";v="24", "Microsoft Edge";v="122"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-requested-with": "XMLHttpRequest",
      Cookie: `"CAKEPHP=${token}"`,
    },
    referrer: "https://app.beresident.mx/usuarios/accesos",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: null,
    method: "POST",
    mode: "cors",
    credentials: "include",
  });
}

module.exports = { generateCookie, openGate };
