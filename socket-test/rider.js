const io =
    require("socket.io-client");

const socket =
    io("http://localhost:5004");

socket.on("connect", () => {

    console.log(
        "Rider Connected"
    );

    socket.emit(
        "join-room",
        {
            userId: "rider1",
            role: "rider"
        }
    );
});

socket.on(
    "ride-accepted",
    (data) => {

        console.log(
            "Ride Accepted"
        );

        console.log(data);
    }
);