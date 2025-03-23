const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, downloadMediaMessage } = require("@whiskeysockets/baileys");
const qrcode = require("qrcode-terminal");
const fs = require("fs");
const Tesseract = require("tesseract.js");
const pdfParse = require("pdf-parse");
const xlsx = require("xlsx");
const mammoth = require("mammoth");

require("dotenv").config();

const {
    GoogleGenerativeAI,
} = require("@google/generative-ai");

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

/*
async function processPPTX(pptxBuffer) {
    try {
        // Simpan buffer ke file sementara
        const tempFilePath = "./temp_pptx.pptx";
        fs.writeFileSync(tempFilePath, pptxBuffer);

        // Gunakan pptx2txt untuk mengekstrak teks
        const text = await pptx2txt.extractText(tempFilePath);

        // Hapus file sementara
        fs.unlinkSync(tempFilePath);

        return text.trim() || "Tidak ada teks yang bisa dibaca.";
    } catch (error) {
        console.error("PPTX Parsing Error:", error);
        return "Gagal membaca isi file PPTX.";
    }
} */

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

        const msg = m.messages[0];
        if (msg.key.fromMe) return;

        const senderJid = msg.key.remoteJid;
        const senderNumber = senderJid.replace(/[@].*/, "");
        const senderName = msg.pushName || "Tanpa Nama";
        let text = msg.message.conversation || msg.message.extendedTextMessage?.text || "";
        console.log(`📩 Pesan dari ${senderName} (${senderNumber}): ${text}`);

        if (senderNumber === authorizingUser) {
            if (text.startsWith("!adduser ")) {
                const newUser = text.split(" ")[1];
                if (newUser && !allowedUsers.includes(newUser)) {
                    allowedUsers.push(newUser);
                    saveAllowedUsers(allowedUsers);
                    await sock.sendMessage(senderJid, { text: `✅ Pengguna ${newUser} telah ditambahkan.` });
                    return;
                }
            } else if (text.startsWith("!deluser ")) {
                const removeUser = text.split(" ")[1];
                allowedUsers = allowedUsers.filter((user) => user !== removeUser);
                saveAllowedUsers(allowedUsers);
                await sock.sendMessage(senderJid, { text: `❌ Pengguna ${removeUser} telah dihapus.` });
                return;
            } else if (text === "!listusers") {
                await sock.sendMessage(senderJid, { text: `📋 Pengguna diizinkan:\n ${allowedUsers.join(", ")}` });
                return;
            }
        }

        if (msg.message.imageMessage || msg.message.documentMessage) {
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
        }

        if (!text) return;

        const sText = splitText(text);
        if (sText[0].toLowerCase()==='jk:') return;
        const text1=sText[0];

        if (!allowedUsers.includes(senderNumber)) return;

        try {
            if (!chatSessions[senderNumber]) {
                chatSessions[senderNumber] = model.startChat({
                    generationConfig,
                    history: [],
                });
            }

            await sock.sendPresenceUpdate("composing", senderJid);
            const chatSession = chatSessions[senderNumber];
            const result = await chatSession.sendMessage(text1);

            const textai = transformText(result.response?.candidates?.[0]?.content.parts[0]?.text) || "No response received.";
            const textdisc = '_*Disclaimer:*_\nInformasi ini berasal dari _Artificial Intelligence (AI) Large Language Model (LLM)_ yang dilatih *Google*';

            console.log(textai);

            await sock.sendMessage(senderJid, { text: textai });
            await sock.sendMessage(senderJid, { text: textdisc });
        } catch (error) {
            console.error("Error:", error.message);
        }
    });
}

startBot();
