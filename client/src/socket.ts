import { io } from 'socket.io-client';

const API_BASE_URL = 'http://localhost:5000';
const socket = io(API_BASE_URL);

export default socket;