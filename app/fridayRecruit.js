const { MessageEmbed } = require("discord.js");
const { fridaysIntl } = require("./fridaysIntl.js");
const e = require("express");
const RECRUIT_NUM = process.env.MAX_MEMBER_NUM || 9;
const fs = require("fs");
const { Console } = require("console");
const JSON_PATH = "./data/recruit.json";
module.exports = {
  createRecruit,
  checkResult,
  addReaction,
  removeReaction
};
const INIT_EMBED = new MessageEmbed()
  .setTitle(formatDate(new Date()))
  .setDescription(`23:00～ @${RECRUIT_NUM}`)
  .setColor(0xffdd00);

function createRecruit(msg) {
  let rawdata = fs.readFileSync(JSON_PATH);
  let _recruits = JSON.parse(rawdata);
  let today = new Date();
  let fridays = getAllFridays(today);
  let newEmbed = new MessageEmbed(INIT_EMBED);

  msg.channel.send({ content: "@everyone 今月のプラベ予定です。" });
  for (let f = 0; f < fridays.length; f++) {
    let recruitDate = formatDate(fridays[f]);
    msg.channel.send({ embeds: [newEmbed.setTitle(recruitDate)] }).then(m => {
      _recruits[m.id] = {
        date: recruitDate,
        isClose: false,
        members: []
      };
      let data = JSON.stringify(_recruits, null, 2);
      fs.writeFileSync(JSON_PATH, data);
      m.react("✅");
    });
  }
  msg.delete();
}

function checkResult(msg) {
  let rawdata = fs.readFileSync(JSON_PATH);
  let _recruits = JSON.parse(rawdata);
  let today = new Date();
  let tommorow = formatDate(today.getDate() + 1);
  for (let recruit in _recruits) {
    let data = _recruits[recruit];
    let openRecruit = data["isClose"] == false && data["date"] == tommorow;

    let notificationChannel = msg.guild.channels.cache.find(
      channel => channel.id === process.env.CHANNEL_ID_NOTIFICATION
    );
    if (openRecruit && data["members"].length < RECRUIT_NUM) {
      notificationChannel.send({
        content: `@everyone ${data["date"]}のプラベ、まだ人数足りてないです😭😭😭`
      });
    }
  }
}

async function addReaction(msg, userId) {
  let rawdata = fs.readFileSync(JSON_PATH);
  let _recruits = JSON.parse(rawdata);
  if (_recruits[msg.id] == undefined) return;
  let membersList = _recruits[msg.id].members;
  if (!membersList.includes(userId)) {
    membersList.push(userId);
  }

  let atNum = RECRUIT_NUM - membersList.length;
  const receivedEmbed = msg.embeds[0];
  let newEmbed = new MessageEmbed(receivedEmbed);
  newEmbed.setTitle(_recruits[msg.id].date).setColor(0xffdd00);

  if (membersList.length == RECRUIT_NUM) {
    _recruits[msg.id] = {
      date: _recruits[msg.id].date,
      isClose: true,
      members: membersList
    };
    newEmbed.setDescription(
      `23:00～ 〆` + getMemberMentions(_recruits[msg.id].members)
    );
  } else if (membersList.length > RECRUIT_NUM) {
    // 10人目は何もしない
    return;
  } else {
    _recruits[msg.id] = {
      date: _recruits[msg.id].date,
      isClose: false,
      members: membersList
    };
    newEmbed.setDescription(
      `23:00～ @${atNum}` + getMemberMentions(_recruits[msg.id].members)
    );
  }

  let data = JSON.stringify(_recruits, null, 2);
  fs.writeFileSync(JSON_PATH, data);
  msg.edit({ embeds: [newEmbed] }).catch(console.error);
}

function removeReaction(msg, userId) {
  let rawdata = fs.readFileSync(JSON_PATH);
  let _recruits = JSON.parse(rawdata);
  if (_recruits[msg.id] == undefined) return;
  let membersList = _recruits[msg.id].members;

  let idx = membersList.indexOf(userId);
  if (idx >= 0) {
    membersList.splice(idx, 1);
  }
  _recruits[msg.id] = {
    date: _recruits[msg.id].date,
    isClose: false,
    members: membersList
  };

  let atNum = RECRUIT_NUM - membersList.length;
  const receivedEmbed = msg.embeds[0];
  let newEmbed = new MessageEmbed(receivedEmbed);
  newEmbed.setDescription(
    `23:00～ @${atNum}` + getMemberMentions(_recruits[msg.id].members)
  );
  newEmbed.setTitle(_recruits[msg.id].date).setColor(0xffdd00);

  let data = JSON.stringify(_recruits, null, 2);
  fs.writeFileSync(JSON_PATH, data);
  msg.edit({ embeds: [newEmbed] }).catch(console.error);
}

function formatDate(dt) {
  var y = dt.getFullYear();
  var m = ("00" + (dt.getMonth() + 1)).slice(-2);
  var d = ("00" + dt.getDate()).slice(-2);
  return y + "." + m + "." + d;
}

function getMemberMentions(members) {
  let mentionString = "";
  for (let i = 0; i < members.length; i++) {
    const member = members[i];
    mentionString = mentionString + `\n<@${member}> `;
  }
  return mentionString;
}

const getAllFridays = today => {
  const beginDate = getFirstDayoftheMonth(today);
  const endDate = getLastDayoftheMonth(today);
  let fridaysCount = fridaysIntl(beginDate, endDate);
  let fridayList = [];
  for (let i = 0; i < fridaysCount; i++) {
    fridayList.push(
      new Date(today.getFullYear(), today.getMonth(), today.getDate() + i * 7)
    );
  }
  return fridayList;
};

const getFirstDayoftheMonth = today => {
  return new Date(today.getFullYear(), today.getMonth(), 1);
};

const getLastDayoftheMonth = today => {
  return new Date(today.getFullYear(), today.getMonth() + 1, 0);
};
