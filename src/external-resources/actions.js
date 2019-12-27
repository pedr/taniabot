const { getRandomImage } = require('./helpers')

function getImgurImage() {
  return getRandomImage()
    .then(({ title, link }) => {
      return `titulo: ${title}\n${link}`      
    })
    .catch(err => {
      return "algo deu errado"
    })
}

module.exports = {
  getImgurImage
}