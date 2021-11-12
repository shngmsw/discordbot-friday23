const { MessageEmbed } = require("discord.js");

module.exports = function handleHelp(msg) {
  var strCmd = msg.content.replace(/　/g, " ");
  strCmd = strCmd.replace("  ", " ");
  const args = strCmd.split(" ");
  args.shift();
  const embed = new MessageEmbed()
    .setTitle("BOTの使い方")
    .setColor(0x1bc2a5)
    .addField("ブキをランダムで選出", "```buki 複数の場合は数字を記入```")
    .addField("ブキ種別ごとのランダム選出方法を表示", "```buki help```")
    .addField("Choose a weapon randomly", "```weapon```")
    .addField("Choose a weapon randomly help", "```weapon help```")
    .addField("接続してるボイチャから数字分のヒトをランダム抽出", "```vpick 複数選出の場合は数字を記入```")
    .addField("プラベの観戦者を抽出", "```kansen 試合回数分の数字を記入```");
  msg.channel.send({ embeds: [embed] });
};
