const PLAYLISTS = {};

function saveYtbLink(msg, match) {
  const realId = getVideoID(match[1]);
  const chatId = msg.chat.id;

  if (!PLAYLISTS[chatId]) {
    PLAYLISTS[chatId] = {
      chatId,
      videos: [],
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

function getVideoID(input) {
  let cleanInput = input.includes("//") ? input.split("//")[1] : undefined;

  if (!cleanInput) {
    return undefined;
  }
  let id = "";
  if (cleanInput.includes("youtube.com/watch?v=")) {
    id = input.split("?v=")[1];
  } else if (cleanInput.includes("youtu.be/")) {
    id = input.split("youtu.be/")[1];
  } else {
    return undefined;
  }

  const a = id.includes(" ") ? id.split(" ")[0] : id;
  const b = a.includes("&") ? a.split("&")[0] : a;

  return b;
}

function generatePlaylistLink(list) {
  const startOfUrl = "https://www.youtube.com/watch_videos?video_ids=";
  return startOfUrl + list.videos.join(",");
}
module.exports = {
  saveYtbLink,
  getPlaylist,
};
