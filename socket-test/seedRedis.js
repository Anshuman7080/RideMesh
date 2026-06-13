const { createClient } = require("redis");

const client = createClient({
  username: "default",
  password: "SP7CCvTohNDYW9fCJqsOsM0MaCzWGkHZ",
  socket: {
    host: "retrosmooth-cover-key-13986.db.redis.io",
    port: 10615
  },
  database: 0
});

(async () => {
  await client.connect();
  await client.setEx(
    "ride:6a2b916e515fa18bfa55c5a5",
    86400,
    JSON.stringify({
      riderId: "6a24da685a67ba935b3a4f34",
      fare: 134,
      status: "COMPLETED"
    })
  );
  console.log("Dummy ride inserted");
  await client.quit();
})();
