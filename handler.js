"use strict";

const bot = require("./dist/lib/bot").default;

const index = require("./dist/index").default;

const getResponseHeaders = () => {
  return {
    "Access-Control-Allow-Origin": "*",
  };
};

module.exports.hello = async (event) => {
  try {
    index();
    const body = JSON.parse(event.body);
    console.log(body);

    await bot.handleUpdate(body);

    return {
      statusCode: 200,
      headers: getResponseHeaders(),
      body: JSON.stringify({
        message: "Ok",
      }),
    };
  } catch (err) {
    console.log("Error: ", err);
    return {
      statusCode: err.statusCode ? err.statusCode : 500,
      headers: getResponseHeaders(),
      body: JSON.stringify({
        error: err.name ? err.name : "Exception",
        message: err.message ? err.message : "Unknown error",
      }),
    };
  }
};

module.exports.setWebhook = async (event) => {
  try {
    let url =
      "https://" +
      event.headers.Host +
      "/" +
      event.requestContext.stage +
      "/webhook";

    await bot.telegram.setWebhook(url);

    return {
      statusCode: 200,
      headers: getResponseHeaders(),
      body: JSON.stringify({ url: url }),
    };
  } catch (err) {
    console.log("Error: ", err);
    return {
      statusCode: err.statusCode ? err.statusCode : 500,
      headers: getResponseHeaders(),
      body: JSON.stringify({
        error: err.name ? err.name : "Exception",
        message: err.message ? err.message : "Unknown error",
      }),
    };
  }
};
