const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys");
const { Session } = require("inspector/promises");
const fs = require("fs");
const { error } = require("console");
const {getDataRow, insertData, updateData, getPeringkat, findHeadToHead, resetAutoincrement} = require('./src/model/gmp_service');
//const { request } = require("http");
const { handleFile, readFileExcel, generateImage, DateToWIB, parsePerintah } = require('./src/model/gmp_function');
require("dotenv").config();

const path = 'parameters.json';
const IDAPPSTART = '1';;
const SETAPP_ON = 'set appgmp on';
const SETAPP_OFF ='set appgmp off';
const STATUSAPP = 'status appgmp';
const SETON = 'ON';
const SETOFF = 'OFF';

// Definisi Perintah 
const GMP_RANGKING_PEMAIN = `buat ranking pemain`;
const GMP_HEAD_TO_HEAD = 'buat head to head pemain';
const GMP_DISP_TURNAMEN = 'buat data turnamen';
const GMP_DISP_PEMAIN = 'buat data pemain';

const GMP_MULAI_IMPORT_DATA = `mulai import data`;
const GMP_RESET_PERTANDINGAN = `reset pertandingan`;

// Definisi Step Pertandingan
const PERTANDINGAN_ID_TURNAMEN = 1;
const PERTANDINGAN_BABAK = 2;
const PERTANDINGAN_POOL = 3;
const PERTANDINGAN_NO_PERTANDINGAN = 4;
const PERTANDINGAN_ID_PEMAIN = 5;
const PERTANDINGAN_SKOR_PEMAIN = 6;
const PERTANDINGAN_ID_LAWAN = 7;
const PERTANDINGAN_SKOR_LAWAN = 8;
const PERTANDINGAN_KEMENANGAN = 9;
const PERTANDINGAN_JUM_PESERTA = 10;


// Definisi Step Import Data
const IMPORTDATA_MULAI = 15;
const IMPORTDATA_PROSES = 16;

const RANGKING_PEMAIN = 20;
const H2H_ID_PEMAIN = 21;
const H2H_ID_LAWAN = 22;
const H2H_ID_TURNAMEN=23


// Babak
const babak = ['PG', '8B', 'SF', 'F' ];

// Simpan sesi percakapan pengguna
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

const getUser = (sender) => {
    const strwhere = {'no_hp':sender};
    return getDataRow ('*','pengguna', strwhere);
}

function isValidYT(yt) {
    const allowedInputs = ['Y', 'Y'];
    return allowedInputs.includes(yt);
}

function isValidPool(pool) {
    const allowedInputs = ['A', 'B', 'C', 'D'];
    return allowedInputs.includes(pool);
}

function isValidScore(score) {
    const allowedInputs = ['0', '1', '2', '3'];
    return allowedInputs.includes(score);
}

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("./auth_multi_device"); 

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        syncFullHistory: true,
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === "close") {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log("Koneksi terputus, mencoba menyambung ulang:", shouldReconnect);
            if (shouldReconnect) startBot();
        } else if (connection === "open") {
            console.log("Bot WhatsApp terhubung!");
        }
    });

    sock.ev.on("messages.upsert", async (m) => {
        if (!m.messages[0]?.message) return;

        const msg = m.messages[0];
        const senderJid = msg.key.remoteJid;
        const senderNumber = senderJid.replace(/[@].*/, ""); // Mengambil nomor HP
        const senderName = msg.pushName || "Tanpa Nama"; 
        const sender = senderName + senderNumber;
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text || "";
        const messageType = Object.keys(msg.message)[0];


        //if (senderJid.includes('120363177930974800@g.us')|| senderJid.includes('120363401316839542@g.us')) {
            console.log(`📩 Pesan dari ${senderJid} ${senderName} (${senderNumber}): ${text}`);

        //    return;

        //}

        // Cek apakah pesan dari bot sendiri
        if (msg.key.fromMe){
            // Simpan session
            //userSessions[sender] = {status_kirim: STAT_KIRIM};
            return;
        } 

        const statapp = getKeywordsById(IDAPPSTART);
        console.log(statapp);
        //return;

        if (senderNumber === authorizingUser) {
            
            if (text.toLocaleLowerCase()===SETAPP_OFF) {
                updateKeywords(IDAPPSTART, SETON, SETOFF);
                await sock.sendMessage(senderJid, { text: `Status Aplikasi *OFF*` });  
                return;
            } else if (text.toLocaleLowerCase()===SETAPP_ON) {
                updateKeywords(IDAPPSTART, SETOFF, SETON);
                await sock.sendMessage(senderJid, { text: `Status Aplikasi *ON*` });
                return;  
            } else if (text.toLocaleLowerCase()===STATUSAPP) {
                await sock.sendMessage(senderJid, { text: `Status Aplikasi *${statapp[0]}*` }); 
                return;
            } else if (text.toLocaleLowerCase()===GMP_RESET_PERTANDINGAN) {
                sock.sendPresenceUpdate("composing", senderJid);
                await resetAutoincrement('TRUNCATE TABLE pertandingan;');
                await sock.sendMessage(senderJid, { text: `Proeses reset pertandingan selesai.` });  
                return;
            }
        }

        if (statapp[0]===SETOFF) return;

        const recPengguna =await getUser(senderNumber);
        //console.log(recPengguna['success']);
        
        if (recPengguna.success || senderJid.includes('120363177930974800@g.us' || senderNumber === authorizingUser)) {
            //console.log(`📩 Pesan dari ${senderJid} ${senderName} (${senderNumber}): ${text}`);

            if (userSessions[sender]) {
                let session = userSessions[sender];

                if (session.step===IMPORTDATA_MULAI) {
                    //console.log(msg);
                    const rec = await handleFile(sock, msg);
                    
                    if (rec) {
                        //console.log(rec.data[0].id_turnamen);
                        session.id_turnamen = rec.data[0].id_turnamen;
                        session.filename = rec.filename;
                        session.step = IMPORTDATA_PROSES;
                        await sock.sendMessage(senderJid, { text: `Proses _Import Data_ (Y/T)?` });
                    } else {
                        await sock.sendMessage(senderJid, { text: `Proses Import Data Tidak Dapat Dilanjutkan.` });
                        delete userSessions[sender];
                    }
                } else if (session.step===IMPORTDATA_PROSES) {
                        
                    if (isValidYT(text.toUpperCase()) && text.toUpperCase()==='Y') {

                        sock.sendPresenceUpdate("composing", senderJid);
                        // Proses Import Data
                        const rows = await readFileExcel(session.filename);
                        
                        //console.log(rows.data);

                        for (const row of rows.data) {

                            const where_tanding = {'id_turnamen': row.id_turnamen,
                                'babak': row.babak,
                                'pool': row.pool,
                                'no_pertandingan': row.no_pertandingan,
                                'id_pemain': row.id_pemain
                            }
                            console.log(where_tanding);

                            let tanding = {
                                'id_turnamen': row.id_turnamen,
                                'babak': row.babak,
                                'pool': row.pool,
                                'no_pertandingan': row.no_pertandingan,
                                'id_pemain': row.id_pemain,
                                'skor_pemain': row.skor_pemain,
                                'id_lawan': row.id_lawan,
                                'skor_lawan': row.skor_lawan,
                                'kemenangan': row.kemenangan,
                                'jumlah_peserta': row.jumlah_peserta,
                                'poin': row.poin
                                }

                                const rec = await getDataRow('*', 'pertandingan', where_tanding);
                                //console.log(rec.success);

                            if (rec.success){
                                await updateData('pertandingan', tanding, where_tanding);
                            } else {
                                await insertData('pertandingan', tanding);
                            }
                            //return;
                        }    

                        //console.table(session.filename);
                        await sock.sendMessage(senderJid, { text: `Proses Import Data Selesai` });
                    } else {
                        await sock.sendMessage(senderJid, { text: `Proses Import Data Dibatalkan!` });
                    }
                    delete userSessions[sender];
                }

                ///// Keluar
                return;
            }

            const [command] = parsePerintah(text);
            console.log(command);
            const para1 = command.paramter[0];
            const para2 = command.paramter[1];
            const para3 = command.paramter[2];
            const menu = command.perintah;
            console.log(para1, para2, para3);
            if (menu.toLowerCase()===GMP_RANGKING_PEMAIN){
                if (command.paramter){
                    const id_turnamen = command.paramter[0];
                    const recTurnamen = await getDataRow('*', 'turnamen', {'id_turnamen': id_turnamen});
                    if (recTurnamen.success){
                        sock.sendPresenceUpdate("composing", senderJid);
                        // Buat Peringkat
                        const peringkat = await getPeringkat(id_turnamen);
                        await generateImage(peringkat, senderNumber);
                        // Kirim Hasilnya
                        await sock.sendMessage(senderJid, {image: {url: './src/images/turnamen_'+peringkat.turnamen[0].id_turnamen+'_'+senderNumber+'.png'}, caption: 'Peringkat '+peringkat.turnamen[0].nama_turnamen});
                    } else {
                        await sock.sendMessage(senderJid, { text: `Id Turnamen tidak temukan!` }); 
                    }
                } else {
                    await sock.sendMessage(senderJid, { text: `ID Turnamen belum dimasukkan.` }); 
                }
                delete userSessions[sender];
            } else if (menu.toLowerCase()===GMP_HEAD_TO_HEAD){

                sock.sendPresenceUpdate("composing", senderJid);
                
                if (command.paramter.length>=3){
                    const id_pemain = command.paramter[0];
                    const id_lawan = command.paramter[1];
                    const id_turnamen = command.paramter[2];

                    console.log(id_pemain, id_lawan, id_turnamen)
                    
                    const recPemain1 = await getDataRow('*', 'pemain', {'id_pemain': id_pemain});
                    if (!recPemain1.success) {
                        await sock.sendMessage(senderJid, { text: `ID Pemain : ${id_pemain} tidak ditemukan.` }); 
                        delete userSessions[sender];
                        return;
                    }
                    const nama_pemain = recPemain1.data[0].nama_pemain;

                    const recPemain2 = await getDataRow('*', 'pemain', {'id_pemain': id_lawan});
                    if (!recPemain2.success) {
                        await sock.sendMessage(senderJid, { text: `ID Lawan : ${id_lawan} tidak ditemukan.` }); 
                        delete userSessions[sender];
                        return;
                    }
                    const nama_lawan = recPemain2.data[0].nama_pemain;

                    const recTurnamen = await getDataRow('*', 'turnamen', {'id_turnamen': id_turnamen});
                   
                    if (!recTurnamen.success) {
                        await sock.sendMessage(senderJid, { text: `ID Turnamen : ${id_turnamen} tidak ditemukan.` }); 
                        delete userSessions[sender];
                        return;
                    }

                    const recH2H = await findHeadToHead(id_pemain, id_lawan, id_turnamen);

                    //console.log(recH2H.data);
                    if (recH2H.data.length) {
                        let strH2H=`*_Head To Head_ antara ${nama_pemain} Vs ${nama_lawan}:*\n\n`;
                        let menang_pemain = 0;
                        let menang_lawan = 0;
                        recH2H.data.forEach( pemain => {
                            strH2H += `Nama Turnamen : ${pemain.nama_turnamen}\nTgl Turnamen : ${DateToWIB(pemain.tgl_turnamen)}\nKemenangan : ${pemain.jumlah_menang} - ${pemain.jumlah_kalah}\n\n`;
                        });
                        strH2H += `*Pertandingan:*\n`;
                        recH2H.pertandingan.forEach( pemain => {
                            let fixpoin = Math.ceil(pemain.poin);
                            strH2H += `Babak : _${pemain.keterangan_babak}_\nPool : ${pemain.pool}\nSkor Pertandingan : ${pemain.skor_pemain} / ${pemain.skor_lawan}\nPoin : ${fixpoin}\n\n`;
                        });

                        await sock.sendMessage(senderJid, { text: strH2H });
                    } else {
                        await sock.sendMessage(senderJid, { text: 'Data Tidak Ditemukan...' });                          
                    }
                } else {
                    await sock.sendMessage(senderJid, { text: `Ada parameter yang belum dikirim.` }); 
                }
                delete userSessions[sender];
            
            } else if (menu.toLowerCase()===GMP_DISP_PEMAIN){
                
                const recPemain = await getDataRow('*', 'pemain');
                //console.log(recTurnamen.data);
                let strPemain = `*DAFTAR PEMAIN/PESERTA TURNAMEN*\n\n`;
                recPemain.data.forEach(item => {
                    if (item.id_pemain !== '2023999') strPemain += `${item.id_pemain} - ${item.nama_pemain}\n`; 
                });

                await sock.sendMessage(senderJid, { text: strPemain });
                delete userSessions[sender];

            } else if (menu.toLowerCase()===GMP_DISP_TURNAMEN){
                
                const recTurnamen = await getDataRow('*', 'turnamen');
                //console.log(recTurnamen.data);
                let strTurnamen = `*DAFTAR TURNAMEN*\n\n`;
                recTurnamen.data.forEach(item => {
                    strTurnamen += `${item.id_turnamen} - ${item.nama_turnamen}\n`;                
                });
                await sock.sendMessage(senderJid, { text: strTurnamen });
                delete userSessions[sender];

            } else if (text.trim().toLowerCase()===GMP_MULAI_IMPORT_DATA) {
                await sock.sendMessage(senderJid, { text: `Masukkan _File Excel_ yang akan diimport :` });
                userSessions[sender] = { step: IMPORTDATA_MULAI } 
            }

            // Import Data

            return;
        }
        
    });
    return sock;
}

startBot();
