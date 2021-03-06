const { MessageEmbed } = require("discord.js");
const request = require("request");
const common = require("./common.js");
const weaponsUrl = "https://stat.ink/api/v2/weapon";

const bukiTypes = {
  シューター: "shooter",
  ブラスター: "blaster",
  シェルター: "brella",
  フデ: "brush",
  チャージャー: "charger",
  マニューバー: "maneuver",
  リールガン: "reelgun",
  ローラー: "roller",
  スロッシャー: "slosher",
  スピナー: "splatling"
};

const weaponTypes = {
  shooter: "shooter",
  blaster: "blaster",
  brella: "brella",
  brush: "brush",
  charger: "charger",
  maneuver: "maneuver",
  reelgun: "reelgun",
  roller: "roller",
  slosher: "slosher",
  splatling: "splatling"
};

module.exports = function handleBuki(command, msg) {
  if (command === "buki") {
    buki(msg);
  } else if (command === "weapon") {
    weapon(msg);
  }
};

function buki(msg) {
  var strCmd = msg.content.replace(/　/g, " ");
  const args = strCmd.split(" ");
  args.shift();

  let amount = 1;
  let bukiType = "";
  let isQuiz = false;

  if (args[0] === "help") {
    let txt =
      "ブキをランダムに抽選します\n\n" +
      "n個のブキをランダムに選びます\n```\nbuki n\n例: buki 3```\n" +
      "ブキを種類縛りでランダムに選びます\n```\nbuki 種類(" +
      Object.keys(bukiTypes).join(`・`) +
      ")\n例: buki シューター```\n";
    msg.channel.send({ content: txt });
  } else {
    if (bukiTypes[args[0]]) {
      // e.g. buki シューター
      bukiType = bukiTypes[args[0]];
      amount = 0;
    } else {
      // e.g. buki 8
      amount = Number(args[0]);
    }
    request.get(weaponsUrl, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        const weapons = JSON.parse(body);
        let bukis = weapons.filter(function(value) {
          if (bukiType !== "") {
            // 特定のbukiTypeが指定されているとき
            return bukiType === value.type.key;
          } else if (!~value.name.ja_JP.indexOf("ヒーロー")) {
            // } else {
            return true;
          }
        });
        let bukiNames = bukis.map(function(value) {
          return new MessageEmbed()
            .setTitle(value.name.ja_JP)
            .setAuthor(msg.author.username + "のブキ", msg.author.avatarURL())
            .addField(
              value.sub.name.ja_JP + " / " + value.special.name.ja_JP,
              value.name.en_US
            )
            .setColor(0xf02d7d);
        });
        console.log(amount);
        if (amount) {
          // var buki = random(size, amount).join('\n');
          var length = bukiNames.length;
          for (let i = 0; i < amount; i++) {
            let buki = bukiNames[Math.floor(Math.random() * length)];
            msg.channel.send({
              embeds: [buki]
            });
          }
        } else {
          var buki = common.random(bukiNames, 1)[0];
          msg.channel.send({ embeds: [buki] });
        }
      } else {
        msg.channel.send({ content: "なんかエラーでてるわ" });
      }
    });
  }
}

function weapon(msg) {
  var strCmd = msg.content.replace(/　/g, " ");
  const args = strCmd.split(" ");
  args.shift();

  let amount = 1;
  let bukiType = "";
  let isQuiz = false;

  if (args[0] === "help") {
    let txt =
      "Choose a weapon randomly\n```weapon```" +
      "Choose N weapons randomly\n```weapon n\ne.g. weapon 3```\n" +
      "Specify a type and choose at random\n```\nweapon type(" +
      Object.values(weaponTypes).join(`・`) +
      ")\ne.g. weapon shooter```\n";
    msg.channel.send({ content: txt });
  } else {
    if (weaponTypes[args[0]]) {
      // e.g. buki シューター
      bukiType = weaponTypes[args[0]];
      amount = 0;
    } else {
      // e.g. buki 8
      amount = Number(args[0]);
      if (amount > 10) {
        amount = 10;
        msg.channel.send({ content: "Up to 10 items can be output at a time" });
      }
    }
    request.get(weaponsUrl, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        const weapons = JSON.parse(body);
        let bukis = weapons.filter(function(value) {
          if (bukiType !== "") {
            // 特定のbukiTypeが指定されているとき
            return bukiType === value.type.key;
          } else {
            return true;
          }
        });
        let bukiNames = bukis.map(function(value) {
          return new MessageEmbed()
            .setTitle(value.name.en_US)
            .setAuthor(msg.author.username + "のブキ", msg.author.avatarURL())
            .addField(
              value.sub.name.en_US + " / " + value.special.name.en_US,
              value.name.ja_JP
            )
            .setColor(0xf02d7d);
        });
        if (amount) {
          // var buki = random(size, amount).join('\n');
          var length = bukiNames.length;
          for (let i = 0; i < amount; i++) {
            let buki = bukiNames[Math.floor(Math.random() * length)];
            msg.channel.send({
              embeds: [buki]
            });
          }
        } else {
          var buki = common.random(bukiNames, 1)[0];
          msg.channel.send({ embeds: [buki] });
        }
      } else {
        msg.channel.send({ content: "なんかエラーでてるわ" });
      }
    });
  }
}
