const generateReferralCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = 8;
  let referralCode = '';
  for (let i = 0; i < length; i++) {
      referralCode += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return referralCode;
}

module.exports = {
  generateReferralCode
}
