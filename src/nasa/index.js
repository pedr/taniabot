const axios = require("axios");

const NASA_API_KEY = "aT49BPcFdIwMKtg2uWRK1G4BU1eNHQyOmhT2H7sZ";

const getImage = (date) => {
  const baseUrl = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}&&hd=true`;
  return axios.get(`${baseUrl}${date ? `&date=${date}` : ""}`);
};

async function pictureOfTheDay(msg) {
  const chatId = msg.chat.id;

  let dateToFind = "";

  const dateRegex = new RegExp(/(\d\d\d\d)-(\d\d?)-(\d\d?)/);

  const regexResult = dateRegex.exec(msg.text);

  if (regexResult && regexResult.length > 0) {
    dateToFind = regexResult[0];
  }

  const { data } = await getImage(dateToFind);

  if (data) {
    return `${data.url} - ${data.explanation}${data.hdurl ? `\n - Imagem em HD: ${data.hdurl}` : ""}`;
  }
}

module.exports = {
  pictureOfTheDay,
};
