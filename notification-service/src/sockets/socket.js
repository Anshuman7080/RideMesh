
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

                const {latitude,longitude}=data;

                console.log("hittin location-update",latitude,longitude)

             await redisClient.geoAdd("drivers:geo", {
                longitude: parseFloat(longitude),
                latitude: parseFloat(latitude),
                member: String(socket.userId),
            });


            }catch(error){
             console.log("Location update Error",error);
            }
        }
     )

     socket.on(
        "location-update-forRide",
        async(data)=>{
             try{
                const {riderId,latitude,longitude}=data;
              console.log("rideId,latitude,longitude on location update for ride",riderId,latitude,longitude);

              if(!riderId){
                console.log("rider Id is not present");
                return;
              }
                
            const riderSocketRoom = `rider:${riderId}`;    

            io.to(riderSocketRoom)
                .emit(
                    "driver-location-updated",
                    {
                        riderId,
                        driverId:socket.userId,
                        latitude,
                        longitude
                    }
                )

             }catch(error){
            console.log("Error in location update for ride",error);
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