(async function() {
  var socket = io(),
      userId = await fetch("/game/info").userId;

  socket.on("connect", () => {
    socket.emit("connectGame", userId);
  });
})();
