
const {redisClient}=require("../config/redis");

const { Server } = require("socket.io");



let io;

const initializeSocket = (server) => {

    io = new Server(server, {
        cors: {
            origin: "*"
        }
    });

    io.on("connection", async(socket) => {

        console.log(
            "Socket Connected:",
            socket.id
        );
         

    socket.on(
        "join-room",
        async(data) => {

        const {userId, role } = data;

        socket.userId =userId;

        socket.role =role;

        const roomName =
            `${role}:${userId}`;

        socket.join(roomName);

        console.log(
            `${userId} joined ${roomName}`
        );
 
        io.to(roomName).emit(
            "test-message",
            {
                message:
                    "Welcome to mini uber",
                room:
                    roomName
            }
        );

        if(role=="driver"){
            await redisClient.sAdd("online-drivers",userId);
        }
    }
     );
      
 

     socket.on(
        "location-update",
        async(data)=>{
            try{

                const {rideId,latitude,longitude}=data;

                console.log("hittin location-update",latitude,longitude,socket.userId)
            

             await redisClient.geoAdd("drivers:geo", {
                longitude: parseFloat(longitude),
                latitude: parseFloat(latitude),
                member: String(socket.userId),
            });

            console.log("coming after redis client");
               
            if (!rideId ) {
                console.log("no ride found or invalid ride data");
                return;
            }

            const riderId = await redisClient.get(`ride-Created:${rideId}`);

                    if (!riderId) {
                    return res.status(404).json({
                        success: false,
                        message: "Ride not found or expired"
                    });
                    }

                    console.log("Fetched riderId:", riderId);


                const riderSocketRoom = `rider:${riderId}`;
                // console.log("riderID",ride.riderId)

                io.to(riderSocketRoom)
                .emit(
                    "driver-location-updated",
                    {
                        rideId,
                        driverId:socket.userId,
                        latitude,
                        longitude
                    }
                )

            }catch(error){
             console.log("Location update Error",error);
            }
        }
     )

        
        socket.on(
            "disconnect",
            async() => {
             
                if(socket.role=='driver'){
                    await redisClient.sRem("online-drivers", socket.userId);
                }
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