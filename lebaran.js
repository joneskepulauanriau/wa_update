const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, downloadMediaMessage } = require("@whiskeysockets/baileys");
const qrcode = require("qrcode-terminal");
const fs = require("fs");
const { Session } = require("inspector/promises");
const Tesseract = require("tesseract.js");
const pdfParse = require("pdf-parse");
const xlsx = require("xlsx");
const mammoth = require("mammoth");
require("dotenv").config();

const path = 'parameters.json';
const IDLEBARAN = '1';
const IDAPPSTART = '2';
const MENU_ADDKEYWORDS = '!addkeyword';
const MENU_DELKEYWORDS = '!delkeyword';
const MENU_LISTKEYWORDS = '!listkeyword';
const SETAPP_ON = 'set app on';
const SETAPP_OFF ='set app off';
const STATUSAPP = 'status app';
const SETON = 'ON';
const SETOFF = 'OFF';
const STAT_KIRIM = true;
//const MENU_UPDATEKEYWORDS = '!updatekeyword';
const ucapanHariRaya =`_Assalamualaikum warahmatullahi wabarakatuh_\n\nDengan segala kerendahan hati kami mengucapkan:\n\n*Selamat Hari Raya*\n*Idul Fitri 1446 H*\n*Mohon Maaf Lahir ɗan Batin*\n\n_Semoga kita semua diberikan kesehatan, mendapatkan rahmat, maghfirah, dan hidayah._ 🙏🙏🙏\n\n*Muhammad Yunus ɗan Keluarga*`;

let userSessions = {};
const authorizingUser = process.env.AUTHORIZING_USER;

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

// Fungsi untuk menambah keywords pada ID tertentu
function addKeywords(id, newKeywords) {
    let data = readData();
    let index = data.findIndex(item => item.id === id);
    if (index !== -1) {
        data[index].keywords = Array.from(new Set([...data[index].keywords, ...newKeywords]));
        writeData(data);
    } else {
        console.log('Data tidak ditemukan');
    }
}

// Fungsi untuk menghapus keywords pada ID tertentu
function deleteKeywords(id, keywordsToRemove) {
    let data = readData();
    let index = data.findIndex(item => item.id === id);
    if (index !== -1) {
        data[index].keywords = data[index].keywords.filter(keyword => !keywordsToRemove.includes(keyword));
        writeData(data);
    } else {
        console.log('Data tidak ditemukan');
    }
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

function cariKonten(konten, params) {
    const kontenLower = konten.toLowerCase().replace(/\s+/g, ' ').trim(); // Konversi ke huruf kecil agar pencarian case-insensitive
    console.log(kontenLower);
    let tidakDitemukan = [];
    let posisiParams = {};

    params.forEach(param => {
        const paramLower = param.toLowerCase();
        const posisi = kontenLower.indexOf(paramLower);
        
        if (posisi === -1) {
            tidakDitemukan.push(param);
        } else {
            posisiParams[param] = posisi;
        }
    });

    return {
        tidakDitemukan: tidakDitemukan,
        posisi: posisiParams
    }
}

function extractKeyword(text, menu) {
    const parts = text.split(' ');
    if (parts.length > 1 && parts[0] === menu) {
        return text.substring(parts[0].length + 1);
    }
    return null; // Jika format tidak sesuai
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

        //console.log(senderJid);

        console.log(`📩 Pesan dari ${senderName} (${senderNumber}): ${text}`);

        const statapp = getKeywordsById(IDAPPSTART);

        if (senderNumber === authorizingUser) {
            if (text.startsWith(MENU_ADDKEYWORDS)) {
                const newKeyword = [extractKeyword(text, MENU_ADDKEYWORDS)];
                addKeywords(IDLEBARAN, newKeyword);
                await sock.sendMessage(senderJid, { text: `✅ Keyword *${newKeyword}* telah ditambahkan.` });
            } else if (text.startsWith(MENU_DELKEYWORDS)) {
                const newKeyword = [extractKeyword(text, MENU_DELKEYWORDS)];
                deleteKeywords(IDLEBARAN, newKeyword);
                await sock.sendMessage(senderJid, { text: `❌ Keyword *${newKeyword}* telah dihapus.` });
            } else if (text.startsWith(MENU_LISTKEYWORDS)) {
                const keyWords = getKeywordsById(IDLEBARAN);
                
                if (keyWords.length) {
                    let list = 'DAFTAR KEYWORDS:\n\n';
                    for(let i=0;i<keyWords.length;i++){ 
                        list += keyWords[i]+'\n'; 
                    }
                    await sock.sendMessage(senderJid, { text: list});
                } else {
                    await sock.sendMessage(senderJid, { text: `Keyword tidak ditemukan.` });
                }
            } else if (text.toLocaleLowerCase()===SETAPP_OFF) {
                updateKeywords(IDAPPSTART, SETON, SETOFF);
                await sock.sendMessage(senderJid, { text: `Status Aplikasi *OFF*` });  
            } else if (text.toLocaleLowerCase()===SETAPP_ON) {
                updateKeywords(IDAPPSTART, SETOFF, SETON);
                await sock.sendMessage(senderJid, { text: `Status Aplikasi *ON*` });  
            } else if (text.toLocaleLowerCase()===STATUSAPP) {
                await sock.sendMessage(senderJid, { text: `Status Aplikasi *${statapp[0]}*` });  
            }
            return;
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

        const keyWords = getKeywordsById(IDLEBARAN);
        console.log(keyWords);

        const result = cariKonten(text, keyWords);
        console.log(result.posisi);

        if (userSessions[senderNumber]){
            let session = userSessions[senderNumber];
            if (session.status_kirim===STAT_KIRIM && Object.keys(result.posisi).length){
                //sock.sendPresenceUpdate("composing", senderJid);
                await sock.sendMessage(senderJid, { react: { text: '🙏', key: msg.key }})
                //await sock.sendMessage(senderJid, {text: "Halo! Ini balasan dari bot 😊", quoted: msg});
            }
            return;
        }
        if (Object.keys(result.posisi).length){
            sock.sendPresenceUpdate("composing", senderJid);
            await sock.sendMessage(senderJid, {image: {url: './images/Kartu Selamat Hari Raya.png'}, caption: ucapanHariRaya});
            //await sock.sendMessage(senderJid, { text: ucapanHariRaya});
            userSessions[senderNumber] = {status_kirim: STAT_KIRIM};
        } 
   
    });
}

startBot();
