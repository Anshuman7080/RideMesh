const axios = require("axios");

// replaced with redis
// const getAvailableDrivers = async () => {

//     const response = await axios.get(
//         `${process.env.DRIVER_SERVICE_URL}/available-drivers`
//     );

//     return response.data.drivers;
// };

// replaced with rabbitMq
// const updateDriverAvailability = async (
//     driverId,
//     isAvailable
// ) => {

//     return axios.patch(
//         `${process.env.DRIVER_SERVICE_URL}/availability/${driverId}`,
//         {
//             isAvailable
//         }
//     );
// };

//replaced with rabbitMq
// const updateDriverRating = async (
//     driverId,
//     rating
// ) => {

//     return axios.patch(
//         `${process.env.DRIVER_SERVICE_URL}/rating/${driverId}`,
//         {
//             rating
//         }
//     );
// };

// module.exports = {
//     // getAvailableDrivers,
//     // updateDriverAvailability,
//     updateDriverRating
// };