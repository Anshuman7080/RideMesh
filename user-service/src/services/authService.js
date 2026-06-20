const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
console.log("process.env.AUTH_SERVICE_URL}", `${process.env.AUTH_SERVICE_URL}/internal/update-isActive`)

const updateUserActiveStatus = async (
  userId,
  status
) => {

  return axios.patch(
    `${process.env.AUTH_SERVICE_URL}/internal/update-isActive`,
    {
      userId,
      status
    }
  );
};

module.exports = {
  updateUserActiveStatus
};