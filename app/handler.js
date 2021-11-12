const handleBuki = require("./buki.js");
const handleHelp = require("./help.js");
const handlePick = require("./pick.js");
const handleVoicePick = require("./vpick.js");

module.exports = {
  call: call
};

function call(msg) {
  var strCmd = msg.content.replace(/　/g, " ");
  const args = strCmd.split(" ");
  const command = args.shift().toLowerCase();

  switch (command) {
    case "pick":
      handlePick(msg);
      break;
    case "vpick":
      handleVoicePick(msg);
      break;
    case "buki":
    case "weapon":
      handleBuki(command, msg);
      break;
    case "help":
      handleHelp(msg);
      break;
  }
}
