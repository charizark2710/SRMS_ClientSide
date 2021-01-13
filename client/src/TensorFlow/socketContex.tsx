import io from "socket.io-client";
import React from 'react'
const socket = io('http://localhost:5001');

export {socket}

