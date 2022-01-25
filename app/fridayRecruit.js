const { MessageEmbed } = require("discord.js");
const { fridaysIntl, getWeekOfDay } = require("./fridaysIntl.js");
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
  let firstFriday = getWeekOfDay(
    today.getFullYear(),
    today.getMonth() + 1,
    1,
    5
  );
  let fridays = getAllFridays(firstFriday);
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
  let date = new Date();
  date.setDate(date.getDate() + 1);
  let tommorow = formatDate(date);
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
    } else if (openRecruit && data["members"].length == RECRUIT_NUM) {
      notificationChannel.send({
        content: `@everyone ${data["date"]}のプラベ、人数集まりましたので開催します！`
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

  let notificationChannel = msg.guild.channels.cache.find(
    channel => channel.id === process.env.CHANNEL_ID_NOTIFICATION
  );
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
    notificationChannel.send({
      content: `@everyone ${_recruits[msg.id].date}のプラベ、人数集まりましたので開催します！`
    });
  } else if (membersList.length > RECRUIT_NUM) {
    // 10人目以降は何もしない
    return;
  } else {
    _recruits[msg.id] = {
      date: _recruits[msg.id].date,
      isClose: false,
      members: membersList
    };
    newEmbed.setDescription(
      `23:00～ @${atNum}` + getMemberMentions(_recruits[msg.id].members, msg)
    );
  }

  let data = JSON.stringify(_recruits, null, 2);
  fs.writeFileSync(JSON_PATH, data);
  msg.edit({ embeds: [newEmbed] }).catch(console.error);
}

async function removeReaction(msg, userId) {
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
    `23:00～ @${atNum}` + getMemberMentions(_recruits[msg.id].members, msg)
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

function getMemberMentions(members, msg) {
  let mentionString = "";
  for (let i = 0; i < members.length; i++) {
    const member = members[i];
    let memberObj = msg.guild.members.cache.get(member);
    let name = memberObj.user.username;
    mentionString = mentionString + `\n${name}`;
  }
  return mentionString;
}

const getAllFridays = firstFriday => {
  const beginDate = getFirstDayoftheMonth(firstFriday);
  const endDate = getLastDayoftheMonth(firstFriday);
  let fridaysCount = fridaysIntl(beginDate, endDate);
  let fridayList = [];
  for (let i = 0; i < fridaysCount; i++) {
    fridayList.push(
      new Date(
        firstFriday.getFullYear(),
        firstFriday.getMonth(),
        firstFriday.getDate() + i * 7
      )
    );
  }
  return fridayList;
};

const getFirstDayoftheMonth = today => {
  return new Date(today.getFullYear(), today.getMonth(), 1);
};

const getLastDayoftheMonth = today => {
  return new Date(today.getFullYear(), today.getMonth() + 1, 0, 1);
};
