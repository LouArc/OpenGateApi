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
  const response = await fetch(
    `https://app.beresident.mx/accesos/open2/${id}.json`,
    {
      headers: {
        accept: "*/*",
        "accept-language": "en,es;q=0.9",
        "sec-ch-ua":
          '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
        "sec-ch-ua-arch": '"x86"',
        "sec-ch-ua-bitness": '"64"',
        "sec-ch-ua-full-version": '"122.0.6261.129"',
        "sec-ch-ua-full-version-list":
          '"Chromium";v="122.0.6261.129", "Not(A:Brand";v="24.0.0.0", "Google Chrome";v="122.0.6261.129"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-model": '""',
        "sec-ch-ua-platform": '"Windows"',
        "sec-ch-ua-platform-version": '"15.0.0"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest",
        cookie: `CAKEPHP=${token}`,
        Referer: "https://app.beresident.mx/usuarios/accesos",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "upgrade-insecure-requests": "1",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      },
      body: null,
      method: "POST",
      credentials: "include",
      mode: "cors",
    }
  );

  if (!response.ok) {
    response.json().message = "Failed open gate request";
    throw new Error(await response.json());
  }

  return await response.json();
}

async function gateStatus(token, id) {
  const response = await fetch(
    `https://app.beresident.mx/accesos/status/${id}.json`,
    {
      headers: {
        accept: "*/*",
        "accept-language": "en,es;q=0.9",
        "sec-ch-ua":
          '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
        "sec-ch-ua-arch": '"x86"',
        "sec-ch-ua-bitness": '"64"',
        "sec-ch-ua-full-version": '"122.0.6261.129"',
        "sec-ch-ua-full-version-list":
          '"Chromium";v="122.0.6261.129", "Not(A:Brand";v="24.0.0.0", "Google Chrome";v="122.0.6261.129"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-model": '""',
        "sec-ch-ua-platform": '"Windows"',
        "sec-ch-ua-platform-version": '"15.0.0"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest",
        cookie: `CAKEPHP=${token}`,
        origin: "https://app.beresident.mx",
        Referer: "https://app.beresident.mx/usuarios/accesos",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      },
      body: null,
      method: "POST",
    }
  );

  if (!response.ok) {
    response.json().message = "Failed to get gate status";
    throw new Error(await response.json());
  }

  if (response.json().open_request !== 1) {
    response.json().message = "Open request not received";
    throw new Error(await response.json());
  }

  return await response.json();
}

module.exports = { generateCookie, openGate, gateStatus };
