import { WebSocket } from '../websocket';

declare const global: any;

if (!global.WebSocket)
    global.WebSocket = WebSocket;
