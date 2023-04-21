import { socket } from "../main";
import { createButton } from "./buttons";
import { createGridPage } from "./gameLobby";

// create room
function createNewRoom() {
  const user = { id: socket.id, name: "Anton", color: "blue" }; // från session
  socket.emit("create room", user);

  socket.on("create room", (createRoomResponse) => {
    enterRoomLobby(createRoomResponse);
  });
}

function enterRoomLobby(room) {
  // enable chat
  createGridPage(room);
}

export function renderRoomsSection() {
  const mainContainer = document.querySelector("main");
  const roomsContainer = document.createElement("div");
  const roomsBtnContainer = document.createElement("div");

  mainContainer.innerHTML = "";

  roomsContainer.classList.add("rooms-container");

  const createRoomBtn = createButton("Create Room", createNewRoom);
  const joinRoomBtn = createButton("Join This Room", joinActiveRoom);

  roomsBtnContainer.append(createRoomBtn, joinRoomBtn);
  mainContainer.append(roomsContainer, roomsBtnContainer);
  printRoomList();
}

async function printRoomList() {
  const roomsContainer = document.querySelector(".rooms-container");
  const rooms = await fetchRooms();

  socket.on("roomIsFull", (roomId) => {
    const buttonToDisable = document.getElementById(roomId);
    buttonToDisable.setAttribute("disabled", "");
    buttonToDisable.innerHTML = "FULL";
  });

  if (rooms.length === 0) {
    roomsContainer.innerHTML = "No active game rooms";
  } else {
    rooms.map((room, index) => {
      const roomContainer = document.createElement("div");
      const titleElement = document.createElement("h4");

      roomContainer.classList.add("room-container");

      titleElement.innerHTML = "Room " + (index + 1);

      const joinBtn = createButton("Join Room", joinActiveRoom);
      joinBtn.id = room.roomId;

      roomContainer.append(titleElement, joinBtn);
      roomsContainer.appendChild(roomContainer);
    });
  }
}

async function fetchRooms() {
  const response = await fetch("http://localhost:3000/rooms");
  const data = await response.json();
  return data.rooms;
}

function joinActiveRoom(e) {
  const user = { id: socket.id, name: "Max" };
  localStorage.setItem("user", JSON.stringify(user));
  const roomId = e.target.id;

  const toSend = {
    user: user,
    roomId: roomId,
  };

  socket.emit("join room", toSend);

  socket.on("join room", (room) => {
    console.log(room);
    createGridPage(room);
  });
}

// testing purposes users
// function testingUsers() {}
