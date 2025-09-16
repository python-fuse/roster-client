import io from "socket.io-client";

const PORT = 5000;

const socket = io(`ws://localhost:${PORT}`);

const userData = {
  id: "37344cea-fb03-44a6-af40-307d826a1825",
  name: "Umar Muktar",
  email: "test@mail.com",
  role: "STAFF",
  createdAt: "2025-09-11T10:06:28.185Z",
  updatedAt: "2025-09-11T10:06:28.185Z",
};
socket.on("connect", () => {
  console.log("Connected to server");
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

socket.emit("join", userData.id);

socket.on("notification", (data) => {
  console.log("Notification received:", data);
});

socket.on(`user:${userData.id}`,(data)=>{
  console.log("New notification:",data)
})
