const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, downloadMediaMessage } = require("@whiskeysockets/baileys");
const qrcode = require("qrcode-terminal");
const fs = require("fs");
const Tesseract = require("tesseract.js");
const pdfParse = require("pdf-parse");
const xlsx = require("xlsx");
const mammoth = require("mammoth");

const path = 'wa_parameters.json';
const IDAPPSTART = 'AppWA';
const AI_ON = 'set ai on';
const AI_OFF = 'set ai off';
const AI_STATUS = 'status ai';
const SETAPP_ON = 'set appwa on';
const SETAPP_OFF ='set appwa off';
const STATUSAPP = 'status appwa';
const SETON = 'ON';
const SETOFF = 'OFF';

require("dotenv").config();

const {GoogleGenerativeAI, } = require("@google/generative-ai");
const { matchesGlob } = require("path");
const chatSessions = {}; // Menyimpan sesi percakapan untuk setiap pengguna
const USERS_FILE = "allowed_users.json";

function splitText(text) {
    const [prefix, ...message] = text.split(': ');
    if (prefix.toLowerCase()==='jk') return [prefix + ':', message.join(': ')];
    else return [prefix, message.join(': ')];
 }

function loadAllowedUsers() {
    try {
        return JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
    } catch (error) {
        return [];
    }
}

function saveAllowedUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

let allowedUsers = loadAllowedUsers();
const authorizingUser = process.env.AUTHORIZING_USER;
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("GEMINI_API_KEY is missing! Please check your .env file.");
    process.exit(1);
}

async function processImage(imageBuffer) {
    try {
        const { data: { text } } = await Tesseract.recognize(imageBuffer, 'eng');
        return text.trim();
    } catch (error) {
        console.error("OCR Error:", error);
        return "Gagal membaca teks dari gambar.";
    }
}

async function processPDF(pdfBuffer) {
    try {
        const data = await pdfParse(pdfBuffer);
        return data.text.trim();
    } catch (error) {
        console.error("PDF Parsing Error:", error);
        return "Gagal membaca teks dari PDF.";
    }
}

async function processXLSX(xlsxBuffer) {
    try {
        const workbook = xlsx.read(xlsxBuffer, { type: "buffer" });
        let text = "";
        workbook.SheetNames.forEach((sheetName) => {
            const worksheet = workbook.Sheets[sheetName];
            text += xlsx.utils.sheet_to_csv(worksheet) + "\n";
        });
        return text.trim();
    } catch (error) {
        console.error("XLSX Parsing Error:", error);
        return "Gagal membaca isi file Excel.";
    }
}

async function processDOCX(docxBuffer) {
    try {
        const result = await mammoth.extractRawText({ buffer: docxBuffer });
        return result.value.trim() || "Tidak ada teks yang bisa dibaca.";
    } catch (error) {
        console.error("DOCX Parsing Error:", error);
        return "Gagal membaca isi file DOCX.";
    }
}

async function processPPTX(pptxBuffer) {
    try {
        const result = await mammoth.extractRawText({ buffer: pptxBuffer });
        return result.value.trim() || "Tidak ada teks yang bisa dibaca.";
    } catch (error) {
        console.error("PPTX Parsing Error:", error);
        return "Gagal membaca isi file PPTX.";
    }
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 2048,
    responseMimeType: "text/plain",
};

function transformText(inputText) {
    if (!inputText) return "";

    return inputText
        .replace(/^\s*\*\s+/gm, "- ") // Mengubah list dengan '*' jadi '-'
        .replace(/^\s*(\d+)\.\s+/gm, "$1. ") // Memastikan list angka tetap valid
        .replace(/(^|[^*])\*(\S.*?\S|\S)\*(?!\*)/g, "$1_$2_") // Mengubah '*italic*' ke '_italic_', tanpa mengganggu **bold**
        .replace(/\*\*(.*?)\*\*/g, "*$1*") // Mengubah '**bold**' ke '*bold*'
        .replace(/\n{3,}/g, "\n\n") // Menghapus baris kosong berlebih
        .trim(); // Menghapus spasi di awal dan akhir
}

// Fungsi untuk membaca data dari file JSON
function readData() {
    if (!fs.existsSync(path)) {
        fs.writeFileSync(path, JSON.stringify([], null, 2));
    }
    const data = fs.readFileSync(path);
    return JSON.parse(data);
}

// Fungsi untuk menulis data ke file JSON
function writeData(data) {
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

// Fungsi untuk membaca keywords berdasarkan ID
function getKeywordsById(id) {
    //const id = parseInt(strId, 10);
    let data = readData();
    let item = data.find(item => item.id === id);
    return item ? item.keywords : null;
}

// Fungsi untuk memperbarui keyword tertentu pada ID tertentu
function updateKeywords(id, oldKeyword, newKeyword) {
    let data = readData();
    let index = data.findIndex(item => item.id === id);
    if (index !== -1) {
        let keywordIndex = data[index].keywords.indexOf(oldKeyword);
        if (keywordIndex !== -1) {
            data[index].keywords[keywordIndex] = newKeyword;
            writeData(data);
        } else {
            console.log('Keyword tidak ditemukan');
        }
    } else {
        console.log('Data tidak ditemukan');
    }
}

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("./auth_multi_device");
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        syncFullHistory: true,
    });

    sock.ev.on("creds.update", saveCreds);
    sock.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect, qr } = update;
        if (qr) qrcode.generate(qr, { small: true });
        if (connection === "close" && lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) {
            console.log("Koneksi terputus, mencoba menyambung ulang...");
            startBot();
        } else if (connection === "open") {
            console.log("Bot WhatsApp terhubung!");
        }
    });

    sock.ev.on("messages.upsert", async (m) => {
        if (!m.messages[0]?.message) return;

        let msg_doc = false;
        const msg = m.messages[0];
        if (msg.key.fromMe) return;

        const senderJid = msg.key.remoteJid;
        const senderNumber = senderJid.replace(/[@].*/, "");
        const senderName = msg.pushName || "Tanpa Nama";
        let text = msg.message.conversation || msg.message.extendedTextMessage?.text || "";
 
        if (senderJid.includes('@g.us')) return;

        console.log(`📩 Pesan dari ${senderName} (${senderNumber}): ${text}`);

        const statapp = getKeywordsById(IDAPPSTART);
        //console.log(`Keyword ==> ${statapp[0]} User: ${authorizingUser}`);

        if (senderNumber === authorizingUser) {
            if (text.startsWith("!adduser ")) {
                const newUser = text.split(" ")[1];
                if (newUser && !allowedUsers.includes(newUser)) {
                    allowedUsers.push(newUser);
                    saveAllowedUsers(allowedUsers);
                    await sock.sendMessage(senderJid, { text: `✅ Pengguna ${newUser} telah ditambahkan.` });
                }
                return;
            } else if (text.startsWith("!deluser ")) {
                const removeUser = text.split(" ")[1];
                allowedUsers = allowedUsers.filter((user) => user !== removeUser);
                saveAllowedUsers(allowedUsers);
                await sock.sendMessage(senderJid, { text: `❌ Pengguna ${removeUser} telah dihapus.` });
                return;
            } else if (text === "!listusers") {
                await sock.sendMessage(senderJid, { text: `📋 Pengguna diizinkan:\n ${allowedUsers.join(", ")}` });
                return;
            } else if (text.toLocaleLowerCase()===SETAPP_OFF) {
                updateKeywords(IDAPPSTART, SETON, SETOFF);
                await sock.sendMessage(senderJid, { text: `Status Aplikasi WA-AI *${SETOFF}*` });  
                return;
            } else if (text.toLocaleLowerCase()===SETAPP_ON) {
                updateKeywords(IDAPPSTART, SETOFF, SETON);
                await sock.sendMessage(senderJid, { text: `Status Aplikasi WA-AI *${SETON}*` });  
                return;
            } else if (text.toLocaleLowerCase()===STATUSAPP) {
                await sock.sendMessage(senderJid, { text: `Status Aplikasi WA-AI *${statapp[0]}*` });  
                return;
            }
        }

        if (statapp[0]===SETOFF) return;

        if (msg.message.imageMessage || msg.message.documentMessage) {
            msg_doc = true;
            const buffer = await downloadMediaMessage(msg, "buffer");
            if (msg.message.imageMessage) {
                text = await processImage(buffer);
            } else if (msg.message.documentMessage.mimetype === "application/pdf") {
                text = await processPDF(buffer);
            } else if (msg.message.documentMessage.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
                text = await processXLSX(buffer);
            } else if (msg.message.documentMessage.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                text = await processDOCX(buffer);
            } else if (msg.message.documentMessage.mimetype === "application/vnd.openxmlformats-officedocument.presentationml.presentation") {
                text = await processPPTX(buffer);
            }
            if (!text) return;
        }

        const sText = splitText(text);
        if (sText[0].toLowerCase()==='jk:') {
            await sock.sendMessage(senderJid, { text: `Gunakan Perintah:\n*_Set ai off_*` });
            await sock.sendMessage(senderJid, { text: sText[1] });
            await sock.sendMessage(senderJid, { text: `Untuk melihat status WA didukung AI atau tidak gunakan perintah:\n*_Status ai_*\n\nContoh hasilnya: _Status AI saat ini *OFF*_\n\nAgar WA didukung AI gunakan perintah:\n*_Set ai on_*` });
            return;
        }
        const text1=sText[0];

        if (!allowedUsers.includes(senderNumber)) return;

        try {
            if (!chatSessions[senderNumber]) {
                chatSessions[senderNumber] = model.startChat({
                    generationConfig,
                    history: [],
                });
            }

            const chatSession = chatSessions[senderNumber];
            
            if (text1.toLowerCase()===AI_OFF||text1.toLowerCase()===AI_ON) {chatSession.ai=text1.toLowerCase();} 
            if (text1.toLowerCase()===AI_STATUS){
                let status_ai = 'ON';
                if (chatSession.ai===AI_OFF) status_ai = 'OFF';

                await sock.sendMessage(senderJid, { text: `_Status AI saat ini *${status_ai}*_` });
                return; 
            }

            if (chatSession.ai===AI_OFF||text1.toLowerCase()===AI_OFF ||text1.toLowerCase()===AI_ON) return;

            if (!msg_doc) await sock.sendPresenceUpdate("composing", senderJid);

            const result = await chatSession.sendMessage(text1);

            const textai = transformText(result.response?.candidates?.[0]?.content.parts[0]?.text) || "No response received.";
            const textdisc = '_*Disclaimer:*_\nInformasi ini berasal dari _Artificial Intelligence (AI) Large Language Model (LLM)_ yang dilatih *Google*';

            if (msg.message.imageMessage || msg.message.documentMessage) return;

            await sock.sendMessage(senderJid, { text: textai });
            await sock.sendMessage(senderJid, { text: textdisc });
        } catch (error) {
            console.error("Error:", error.message);
        }
    });
}

startBot();
