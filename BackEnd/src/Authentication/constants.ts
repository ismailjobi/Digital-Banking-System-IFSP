const crypto = require('crypto');
 
// Generate a secure random string
const generateSecret = () => {
    return crypto.randomBytes(32).toString('hex');
};
export const jwtConstants = {
    secret: generateSecret(),
  }; 

//console.log(secret);