const axiosLib = require("axios");

const axios = axiosLib.create({
  baseURL: "https://api.imgur.com/3/",
  headers: {
    Authorization: "Client-ID a5236975b798a7c"
  }
});

function getRandomImage() {
  return axios
    .get("/gallery/t/random/0")
    .then(resp => {
      const {
        data: { data }
      } = resp;
      const randomId = _randomIntFromInterval(0, data.items.length);
      const item = data.items[randomId];
      const { title, is_album, link, images_count } = item;
      if (is_album) {
        const randomId = _randomIntFromInterval(0, item.images.length - 1);
        const image = item.images[randomId];
        const { link } = image;
        return { title, link };
      }
    })
    .catch(err => {
      console.error(err);
    });
}

function _randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}

module.exports = {
  getRandomImage
}