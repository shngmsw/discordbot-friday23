// Discord bot implements
require('dotenv').config()
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] , partials: ['MESSAGE', 'CHANNEL', 'REACTION']});

const fridayRecruit = require("./fridayRecruit.js");
const Handler = require("./handler.js");
client.login(process.env.DISCORD_BOT_TOKEN);

client.on("messageCreate", async msg => {
  if (msg.author.bot || msg.member.permissions.has("ADMINISTRATOR")) {
    // ランダムマッチング
    if (msg.content === "friday recruit") {
      fridayRecruit.createRecruit(msg);
    }
    if (msg.content === "friday result") {
      await fridayRecruit.checkResult(msg);
      msg.delete().catch(error => {
        // Only log the error if it is not an Unknown Message error
        if (error.code !== 10008) {
          console.error("Failed to delete the message:", error);
        }
      });
    }
    return;
  }
  Handler.call(msg);
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageReactionAdd", async (reaction, user) => {
  // When a reaction is received, check if the structure is partial
  if (reaction.partial) {
    // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
    try {
      await reaction.fetch();
    } catch (error) {
      console.error("Something went wrong when fetching the message:", error);
      return;
    }
  }
  if (!user.bot) {
    if (reaction.emoji.name == '✅') {
      await fridayRecruit.addReaction(reaction.message, user.id);
    }
  }
});

client.on("messageReactionRemove", async (reaction, user) => {
  if (!user.bot) {
    await fridayRecruit.removeReaction(reaction.message, user.id);
  }
});
