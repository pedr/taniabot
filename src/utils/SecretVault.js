const { v4: uuidv4 } = require('uuid');

const SecretVault = () => {
  const vals = [];

  return {
    generateNew: (data) => {
      const newSecret = {
        secret: uuidv4(),
        createdAt: new Date(),
        ...data
      }
      vals.push(newSecret);
      return newSecret.secret;
    },
    check: secret => {
      const found = vals.find(ele => ele.secret == secret);
      if (found) {
        const index = vals.findIndex(ele => ele.secret == secret);
        if (index > -1) {
          vals.splice(index, 1);
        }
        return { status: true, secret: found }
      
      } else {
        return { status: false, secret: null }

      }
    },

  }
}

module.exports = SecretVault;