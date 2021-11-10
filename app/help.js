module.exports = function handleHelp(msg) {
  var strCmd = msg.content.replace(/　/g, " ");
  strCmd = strCmd.replace("  ", " ");
  const args = strCmd.split(" ");
  args.shift();
  msg.channel.send("", {
    embed: {
      author: {
        name: "ブキチの使い方",
        icon_url:
          "https://cdn.glitch.com/4ea6ca87-8ea7-482c-ab74-7aee445ea445%2Fthumbnails%2Fbukichi.jpg"
      },
      color: 0x1bc2a5,
      fields: [
        {
          name: "ランダム系コマンド",
          value:
            "ブキをランダムで選出：```buki 複数の場合は数字を記入```\n" +
            "ブキ種別ごとのランダム選出方法を表示：```buki help```\n" +
            "Choose a weapon randomly:```weapon```\n" +
            "Choose a weapon randomly help:```weapon help```\n"
        },
        {
          name: "選択肢の中からランダム選出",
          value: "```pick 複数選出の場合は数字を記入 選択肢を半スペ空け or 改行して記入```"
        },
        {
          name: "接続してるボイチャから数字分のヒトをランダム抽出",
          value: "```vpick 複数選出の場合は数字を記入```"
        },
        {
          name: "プラベの観戦者を抽出",
          value: "```kansen 試合回数分の数字を記入```"
        }
      ]
    }
  });
};
