require("dotenv").config();
const axios = require('axios');
const discord_url = process.env.discord_url;
// //ヘッダーなどの設定
const config = {
  headers: {
    Accept: "application/json",
    "Content-type": "application/json",
  },
};

//送信するデータ
const postData = {
  username: "ちゃまの秘書",
  content: "friday result",
};

module.exports.result = async () => {
  await axios.post(discord_url, postData, config);
};
