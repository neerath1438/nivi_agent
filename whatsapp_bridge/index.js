import makeWASocket, {
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import qrcode from 'qrcode';
import axios from 'axios';
import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import pino from 'pino';

const app = express();
const port = 3001;
app.use(bodyParser.json());

// Setup logging
// const logger = pino({ level: 'info' });

// Store connection status and QR
let connStatus = 'disconnected';
let lastQr = null;

// FastAPI Webhook URL
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000/api/whatsapp/webhook';

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    const { version, isLatest } = await fetchLatestBaileysVersion();

    console.log(`Using WA version v${version.join('.')}, isLatest: ${isLatest}`);

    const sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        auth: state,
        getMessage: async (key) => {
            return {
                conversation: 'hello'
            };
        }
    });

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            lastQr = await qrcode.toDataURL(qr);
            connStatus = 'connecting';
        }

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error instanceof Boom) ? lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut : true;
            console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect);
            connStatus = 'disconnected';
            if (shouldReconnect) {
                connectToWhatsApp();
            }
        } else if (connection === 'open') {
            console.log('opened connection');
            connStatus = 'connected';
            lastQr = null;
        }
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async (m) => {
        if (m.type === 'notify') {
            for (const msg of m.messages) {
                if (!msg.key.fromMe && msg.message) {
                    const from = msg.key.remoteJid;
                    const name = msg.pushName;
                    const content = msg.message.conversation || msg.message.extendedTextMessage?.text || "";

                    console.log(`Received message from ${from}: ${content}`);

                    // Forward to FastAPI backend
                    try {
                        console.log(`Forwarding message to ${BACKEND_URL}...`);
                        await axios.post(BACKEND_URL, {
                            from,
                            name,
                            content,
                            timestamp: msg.messageTimestamp
                        });
                        console.log('Successfully forwarded to backend!');
                    } catch (err) {
                        console.error('Error forwarding to backend:', err.message);
                    }
                }
            }
        }
    });

    // Expose send endpoint
    app.post('/send', async (req, res) => {
        const { to, message } = req.body;
        if (!to || !message) {
            return res.status(400).json({ error: 'Missing to or message' });
        }

        try {
            await sock.sendMessage(to, { text: message });
            res.json({ status: 'success' });
        } catch (err) {
            console.error('Error sending message:', err);
            res.status(500).json({ error: err.message });
        }
    });

    // Expose status endpoint
    app.get('/status', (req, res) => {
        res.json({ status: connStatus, qr: lastQr });
    });
}

app.listen(port, () => {
    console.log(`WhatsApp Bridge listening at http://localhost:${port}`);
    connectToWhatsApp();
});
