const { Server } = require("socket.io");

let io;

const initializeSocket = (server) => {

    io = new Server(server, {
        cors: {
            origin: "*"
        }
    });

    io.on("connection", (socket) => {

        console.log(
            "Socket Connected:",
            socket.id
        );
        
        socket.on(
            "join-room",
            (data)=>{
                const {userId,role}=data;
                const roomName=`${role}:${userId}`;
                socket.join(roomName);
                console.log(`${userId} joined ${roomName}`);

                io.to(roomName).emit("test-message",{
                    message:"Welcome to mini uber",
                    room:roomName
                })
            }

            
        )

        

        socket.on(
            "disconnect",
            () => {

                console.log(
                    "Socket Disconnected:",
                    socket.id
                );
            }
        );
    });
};

const getIO = () => {

    if (!io) {
        throw new Error(
            "Socket not initialized"
        );
    }

    return io;
};

module.exports = {
    initializeSocket,
    getIO
};