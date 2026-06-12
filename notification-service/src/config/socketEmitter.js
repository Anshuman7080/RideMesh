const { getIO } =
require("../sockets/socket");

function emitToUser(
    role,
    userId,
    event,
    data
){

    console.log("coming in emit to user");
    const io = getIO();

    console.log("room id",`${role}:${userId}`)

    io.to(
        `${role}:${userId}`
    ).emit(
        event,
        data
    );

    console.log("coming to last of emito user");
}

module.exports = {
    emitToUser
};