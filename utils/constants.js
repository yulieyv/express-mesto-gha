const OK_STATUS = 200;
const CREATED_STATUS = 201;
const regexAvatar = /^https?:\/\/(?:[a-z0-9\\-]+\.)+[a-z]{2,6}(?:\/[^/#?]+)+\.(?:jpe?g|gif|png|webp|bmp)$/im;
const regexLink = /^https?:\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\\/~+#-]*[\w@?^=%&\\/~+#-])/im;

module.exports = {
  OK_STATUS,
  CREATED_STATUS,
  regexAvatar,
  regexLink,
};
