const io=require("socket.io-client");

const socket=io("http://localhost:5004");

socket.on("connect",()=>{
    console.log("Connected to Server");
    console.log("Socket ID",socket.id);
    socket.emit(
        "join-room",
        {
            userId:"driver1",
            role:"driver"
        }
    )

    socket.on(
        "test-message",
        (data)=>{
            console.log("Message from server",data);
        }
    )
    socket.on(
        "new-ride-request",
        (data)=>{
            console.log("New Ride Request");
            console.log(data);
        }
    )

})