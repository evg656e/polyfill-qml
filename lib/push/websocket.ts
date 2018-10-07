import global from '../global';
import { WebSocket } from '../websocket';

if (!global.WebSocket)
    global.WebSocket = WebSocket;
