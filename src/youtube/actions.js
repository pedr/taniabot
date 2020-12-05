const PLAYLISTS = {};

const { getVideoID, generatePlaylistLink } = require("./helpers");

function saveYtbLink(msg, match) {

  const realId = getVideoID(match[1]);
  const chatId = msg.chat.id;

  if (!PLAYLISTS[chatId]) {
    PLAYLISTS[chatId] = {
      chatId,
      videos: []
    };
  }

  if (realId !== undefined) {
    PLAYLISTS[chatId].videos.push(realId);
  }
}


function getPlaylist(msg) {

  const chatId = msg.chat.id;

  if (!PLAYLISTS[chatId]) {
    return;
  }

  return generatePlaylistLink(PLAYLISTS[chatId]);
}

module.exports = {
  saveYtbLink,
  getPlaylist
};
