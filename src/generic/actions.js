// all messages
function logMessages(message) {
  console.log(message);
}

// /echo "whatever"
function echo(_, match) {
  return match[1]; // the captured "whatever"
}

// days since last hxh cap
function hxh() {
  const lastHxH = new Date("2018-11-26");
  const today = new Date();
  const milliSinceHxH = today - lastHxH;
  // that is what it takes to calculate on js milli, seconds, min, hours
  const daysSinceHxH = Math.ceil(milliSinceHxH / (1000 * 60 * 60 * 24));

  const neverForget = `sdds cap, ${daysSinceHxH} dias sem cap`;
  return neverForget;
}

// commands list
function commands() {
  const commands = [
    "/hxh",
    "/synch",
    "/synch_livre",
    "/ytb [link]",
    "/playlist",
    "/bet",
    "/bet_result",
    "/quote",
    "/quotes",
    "/quotes [msg]",
    "/meme",
  ];
  return commands.join("\n");
}

module.exports = {
  logMessages,
  echo,
  hxh,
  commands,
};
