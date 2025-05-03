const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys");
const { Session } = require("inspector/promises");
const fs = require("fs");
const { error } = require("console");
const {getDataRow, getDataRowQuery, insertData, updateData, deleteData, getPeringkat, findHeadToHead, resetAutoincrement, getIDPlayer, getPosisiTerbaik} = require('./src/model/gmp_service');
const { handleFile, readFileExcel, generateImage, generateImage2, DateToWIB, parseCommand, parsePerintah, isNumber, generateImageReport, DateTimeIndonesia} = require('./src/model/gmp_function');
require("dotenv").config();

const path = 'parameters.json';
const IDAPPSTART = '1';;
const SETAPP_ON = 'set appgmp on';
const SETAPP_OFF ='set appgmp off';
const STATUSAPP = 'status appgmp';
const SETON = 'ON';
const SETOFF = 'OFF';

// Execute Data
const TABLE_TURNAMEN = 'turnamen';
const TABLE_PENGGUNA = 'pengguna';
const TABLE_DAFTAR = 'daftar';

// Definisi Perintah 
const GMP_RANGKING_PEMAIN = `buat ranking pemain`;
const GMP_INFOGRAFIS_RANGKING_PEMAIN = `buat infografis ranking pemain`;
const GMP_HEAD_TO_HEAD = 'buat head to head pemain';
const GMP_HEAD_TO_HEAD2 = 'buat head to head';
const GMP_DISP_TURNAMEN = 'buat data turnamen';
const GMP_RENCANA_TURNAMEN = 'buat rencana turnamen';
const GMP_DISP_PEMAIN = 'buat data pemain';
const GMP_POSISI_TERBAIK = `buat posisi terbaik`;
const GMP_DAFTARKAN_SAYA = `daftarkan saya`;
const GMP_DAFTARKAN = `daftarkan`;
const GMP_PROFIL_PEMAIN = `buat profil pemain`;
const GMP_TENTUKAN_POOL = `buat pool`;

const perintahAll = [GMP_INFOGRAFIS_RANGKING_PEMAIN, GMP_RANGKING_PEMAIN,GMP_HEAD_TO_HEAD,  GMP_HEAD_TO_HEAD2, GMP_DISP_TURNAMEN, GMP_DISP_PEMAIN, GMP_POSISI_TERBAIK, GMP_DAFTARKAN, GMP_DAFTARKAN_SAYA, GMP_PROFIL_PEMAIN, GMP_RENCANA_TURNAMEN, GMP_TENTUKAN_POOL, 'tambah', 'hapus', 'perbaiki', 'perbaiki status', 'perbaiki realisasi'];

const GMP_MULAI_IMPORT_DATA = `mulai import data`; 
const GMP_RESET_PERTANDINGAN = `reset pertandingan`;
const GMP_EXECUTE_SQL_ON = `mode sql on`;
const GMP_EXECUTE_SQL_OFF = `mode sql off`;

// Definisi Step Import Data
const IMPORTDATA_MULAI = 10;
const IMPORTDATA_PROSES = 11;

const INPUT_SQL = 20;

function getPool(nomor) {
    const poolMap = {
      A: [1, 5, 9, 13, 17],
      D: [2, 6, 10, 14, 18],
      B: [3, 7, 11, 15, 19],
      C: [4, 8, 12, 16, 20]
    };
  
    for (const [pool, values] of Object.entries(poolMap)) {
      if (values.includes(nomor)) {
        return `${pool}`;
      }
    }
  
    return 'X';
  }

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

function parseData(input) {
    const regex = /^(tambah|hapus|perbaiki)\s+(\w+)\s+\{([^}]+)\}$/i;
  
    const match = input.match(regex);
    if (!match) {
      return 'Tidak Sesuai Format';
    }
  
    const command = match[1].toLowerCase();
    const table = match[2];
    const values = match[3].split(',').map(val => val.trim());
  
    return [command, table, ...values];
  }

  function DateToStr(date) {
    if (!date) return '-';
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${d.getFullYear()}`;
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
        const senderPart = msg.key.participant; 
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
            } else if (text.toLocaleLowerCase()===GMP_EXECUTE_SQL_ON) {
                sock.sendPresenceUpdate("composing", senderJid);
                //onst result = await executeSQL('select * from pemain');
                userSessions[sender] = { step: INPUT_SQL } 
                await sock.sendMessage(senderJid, { text: `Masukkan Perintah SQL:` });  
                //await sock.sendMessage(senderJid, { text: `Proeses ${text} selesai.` });  
                return;
            } else if (text.toLocaleLowerCase()===GMP_EXECUTE_SQL_OFF) {
                delete userSessions[sender];
                return;
            }
        }

        if (statapp[0]===SETOFF) return;
        
        const command = parseCommand(text);
        //console.log(command);
        //const para1 = command.parameter[0];
        //const para2 = command.parameter[1];
        //const para3 = command.parameter[2];
        const menu = command.perintah.toLowerCase();
        //console.log(menu);
        //console.log(command);

        if (senderNumber !== authorizingUser) {   
            console.log(text);
            if (!perintahAll.includes(menu)) return;
        }

        const recPengguna =await getUser(senderNumber);
        console.log(recPengguna['success']);
        
        if (recPengguna.success || senderJid.includes('120363419620335483@g.us') || senderJid.includes('120363177930974800@g.us') || senderNumber === authorizingUser) {
            //console.log(`📩 Pesan dari ${senderJid} ${senderName} (${senderNumber}): ${text}`);
            if (userSessions[sender]) {
                let session = userSessions[sender];
                if (session.step===INPUT_SQL) {
                    //const parseInput = parseData(text);
                    //console.log(text);
                    //console.log(parseInput);
                    //console.log('SQL:',menu);
                    //console.log(command.parameter.length);
                    //console.log(command.parameter[0]);
                    let data = '';
                    let whereSQL = '';
                    if (command.parameter.length){
                        if (command.parameter[0].toLowerCase()===TABLE_TURNAMEN) {
                            if (menu==='tambah') {
                                if (command.parameter[5]) {
                                    data = {'id_turnamen': command.parameter[1], 'nama_turnamen': command.parameter[2], 'alias': command.parameter[3], 'tgl_turnamen': command.parameter[4], 'tgl_realisasi': command.parameter[5], 'tahun': command.parameter[6], 'id': command.parameter[7]};
                                } else {
                                    data = {'id_turnamen': command.parameter[1], 'nama_turnamen': command.parameter[2], 'alias': command.parameter[3], 'tgl_turnamen': command.parameter[4], 'tahun': command.parameter[6], 'id': command.parameter[7]};
                                }
                                const recTur1 = await insertData(TABLE_TURNAMEN, data);
                                console.log(recTur1.data);
                                await sock.sendMessage(senderJid, { text: recTur1.message });
                            } else if (menu==='perbaiki') {
                                whereSQL = {'id_turnamen':command.parameter[1]};
                                data = {'nama_turnamen': command.parameter[2], 'alias': command.parameter[3], 'tgl_turnamen': command.parameter[4], 'tgl_realisasi': command.parameter[5], 'tahun': command.parameter[6], 'id': command.parameter[7]};                                
                                const recTur1 = await updateData(TABLE_TURNAMEN, data, whereSQL);
                                await sock.sendMessage(senderJid, { text: recTur1.message });

                            } else if (menu==='hapus') {
                                whereSQL = {'id_turnamen': command.parameter[1]};
                                const recTur1 = await deleteData(TABLE_TURNAMEN, whereSQL);
                                await sock.sendMessage(senderJid, { text: recTur1.message });
                            } else if (menu==='perbaiki status') {
                                whereSQL = {'id_turnamen':command.parameter[1]};
                                data = {'status': command.parameter[2]};                                
                                const recTur1 = await updateData(TABLE_TURNAMEN, data, whereSQL);
                                await sock.sendMessage(senderJid, { text: recTur1.message });                                
                            } else if (menu==='perbaiki realisasi') {
                                whereSQL = {'id_turnamen':command.parameter[1]};
                                data = {'tgl_realisasi': command.parameter[2], 'status': 'Buka'};                                
                                const recTur1 = await updateData(TABLE_TURNAMEN, data, whereSQL);
                                await sock.sendMessage(senderJid, { text: recTur1.message });                                
                            }
                        } if (command.parameter[0].toLowerCase()===TABLE_DAFTAR) {
                            if (menu==='hapus') {
                                whereSQL = {'id_pemain': command.parameter[1], 'id_turnamen': command.parameter[2]};
                                const recDaftar = await deleteData(TABLE_DAFTAR, whereSQL);
                                await sock.sendMessage(senderJid, { text: recDaftar.message });
                            } 
                        } else if (command.parameter[0].toLowerCase()===TABLE_PENGGUNA) {
                            if (menu==='tambah') {
                                data = {'no_hp': command.parameter[1], 'nama_pengguna': command.parameter[2], 'id_pemain': command.parameter[3]};
                                const recPengguna = await insertData(TABLE_PENGGUNA, data);
                                console.log(recPengguna.data);
                                await sock.sendMessage(senderJid, { text: recPengguna.message });
                            } else if (menu==='perbaiki') {
                                whereSQL = {'no_hp':command.parameter[1]};
                                data = {'nama_pengguna': command.parameter[2], 'id_pemain': command.parameter[3]};
                                const recPengguna = await updateData(TABLE_PENGGUNA, data, whereSQL);
                                await sock.sendMessage(senderJid, { text: recPengguna.message });
                            } else if (menu==='hapus') {
                                whereSQL = {'no_hp': command.parameter[1]};
                                const recPengguna = await deleteData(TABLE_PENGGUNA, whereSQL);
                                await sock.sendMessage(senderJid, { text: recPengguna.message });                           
                            }
                        }
                    }
                    return;
                    delete userSessions[sender];
                    
                } else if (session.step===IMPORTDATA_MULAI) {
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

            //const [command] = parsePerintah(text);
            //console.log(command);
            //const para1 = command.parameter[0];
            //const para2 = command.parameter[1];
            //const para3 = command.parameter[2];
            //const menu = command.perintah;
            //console.log(para1, para2, para3);
            if (menu.toLowerCase()===GMP_RANGKING_PEMAIN){
                if (command.parameter.length){
                    sock.sendPresenceUpdate("composing", senderJid);
                    let id_turnamen = command.parameter[0];
                    if (!isNumber(id_turnamen)) {
                        const recTur = await getDataRow('*', 'turnamen', {'alias': id_turnamen.toLowerCase()});
                        if (recTur.success) id_turnamen = recTur.data[0].id_turnamen;
                    } 

                    const recTurnamen = await getDataRow('*', 'turnamen', {'id_turnamen': id_turnamen});
                    if (recTurnamen.success){
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
            } else if (menu.toLowerCase()===GMP_INFOGRAFIS_RANGKING_PEMAIN){
                if (command.parameter){
                    sock.sendPresenceUpdate("composing", senderJid);
                    let id_turnamen = command.parameter[0];
                    if (!isNumber(id_turnamen)) {
                        const recTur = await getDataRow('*', 'turnamen', {'alias': id_turnamen.toLowerCase()});
                        if (recTur.success) id_turnamen = recTur.data[0].id_turnamen;
                    } 

                    const recTurnamen = await getDataRow('*', 'turnamen', {'id_turnamen': id_turnamen});
                    if (recTurnamen.success){
                        // Buat Peringkat
                        const peringkat = await getPeringkat(id_turnamen);
                        await generateImage2(peringkat, senderNumber);
                        // Kirim Hasilnya
                        await sock.sendMessage(senderJid, {image: {url: './src/images/infoturnamen_'+peringkat.turnamen[0].id_turnamen+'_'+senderNumber+'.png'}, caption: 'Informasi Grafis Peringkat '+peringkat.turnamen[0].nama_turnamen});
                    } else {
                        await sock.sendMessage(senderJid, { text: `Id Turnamen tidak temukan!` }); 
                    }
                } else {
                    await sock.sendMessage(senderJid, { text: `ID Turnamen belum dimasukkan.` }); 
                }
                delete userSessions[sender];
            } else if (menu.toLowerCase()===GMP_HEAD_TO_HEAD || menu.toLowerCase()===GMP_HEAD_TO_HEAD2){

                sock.sendPresenceUpdate("composing", senderJid);
                
                if (command.parameter.length===3){

                    let id_pemain = command.parameter[0];
                    //console.log('ID ----->', id_pemain);
                    let nama_pemain = '';
                    if (!isNumber(id_pemain)){
                        const recPemain1 = await getIDPlayer(id_pemain);
                        //console.log(recPemain1.success);
                        if (recPemain1.success) { 
                            id_pemain = recPemain1.data[0].id_pemain;
                            nama_pemain = recPemain1.data[0].nama_pemain;
                        } else {
                            await sock.sendMessage(senderJid, { text: `Data ${command.parameter[0]} tidak ditemukan.` });
                            delete userSessions[sender];
                            return; 
                        }
                    } else {
                        const recPemain2 = await getDataRow('*', 'pemain', {'id_pemain': id_pemain});
                        if (!recPemain2.success) {
                            await sock.sendMessage(senderJid, { text: `Data ${command.parameter[0]} tidak ditemukan.` });
                            delete userSessions[sender];
                            return;
                        }
                        nama_pemain = recPemain2.data[0].nama_pemain;
                    }

                    let id_lawan = command.parameter[1];
                    nama_lawan = '';
                    if (!isNumber(id_lawan)){
                        const recPemain3 = await getIDPlayer(id_lawan);
                        //console.log(recPemain3);
                        if (recPemain3.success) { 
                            id_lawan = recPemain3.data[0].id_pemain;
                            nama_lawan = recPemain3.data[0].nama_pemain;
                        } else {
                            await sock.sendMessage(senderJid, { text: `Data ${command.parameter[1]} tidak ditemukan.` });
                            delete userSessions[sender];
                            return; 
                        }
                    } else {
                        const recPemain4 = await getDataRow('*', 'pemain', {'id_pemain': id_lawan});
                        if (!recPemain4.success) {
                            await sock.sendMessage(senderJid, { text: `Data ${command.parameter[1]} tidak ditemukan.` });
                            delete userSessions[sender];
                            return;
                        }
                        nama_lawan = recPemain4.data[0].nama_pemain;
                    }
                    
                    let id_turnamen = command.parameter[2];
                    let nama_turnamen = '';
                    if (!isNumber(id_turnamen)){
                        const recTur1 = await getDataRow('*', 'turnamen', {'alias': id_turnamen.toLowerCase()});
                        if (recTur1.success) { 
                            id_turnamen = recTur1.data[0].id_turnamen;
                            nama_turnamen = recTur1.data[0].nama_turnamen;
                        } else {
                            await sock.sendMessage(senderJid, { text: `Data Turnamen ${command.parameter[2]} tidak ditemukan.` });
                            delete userSessions[sender];
                            return; 
                        }
                    } else {
                        const recTur2 = await getDataRow('*', 'turnamen', {'id_turnamen': id_turnamen});
                        if (recTur2.success) { 
                            id_turnamen = recTur2.data[0].id_turnamen;
                            nama_turnamen = recTur2.data[0].nama_turnamen;
                        } 

                    }                        

                    //console.log('Data --->', id_pemain, id_lawan, id_turnamen);
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
                    await sock.sendMessage(senderJid, { text: `_Informasi belum lengkap!_. Seharusnya seperti contoh berikut:\nBuat head to head antara *M. Yunus* dengan *Utha* pada turnamen *Kedua*` }); 
                }
                delete userSessions[sender];
            
            } else if (menu.toLowerCase()===GMP_DISP_PEMAIN){
                sock.sendPresenceUpdate("composing", senderJid);
                const recPemain = await getDataRow('*', 'pemain');
                //console.log(recTurnamen.data);
                let strPemain = `*DAFTAR PEMAIN/PESERTA TURNAMEN*\n\n`;
                recPemain.data.forEach(item => {
                    if (item.id_pemain !== '2023999') strPemain += `${item.id_pemain} - ${item.nama_pemain}\n`; 
                });

                await sock.sendMessage(senderJid, { text: strPemain });
                delete userSessions[sender];

            } else if (menu.toLowerCase()===GMP_DISP_TURNAMEN){
                sock.sendPresenceUpdate("composing", senderJid);
                const recTurnamen = await getDataRow('*', 'turnamen');
                //console.log(recTurnamen.data);
                let strTurnamen = `*DAFTAR TURNAMEN*\n\n`;
                recTurnamen.data.forEach(item => {
                    strTurnamen += `${item.id_turnamen} - ${item.nama_turnamen}\n`;                
                });
                await sock.sendMessage(senderJid, { text: strTurnamen });
                delete userSessions[sender];

            } else if (menu.toLowerCase()===GMP_DAFTARKAN) {
                sock.sendPresenceUpdate("composing", senderJid);
                let strnama_pemain = command.parameter[0];
                let alias = command.parameter[1];
                const recPemain = await getIDPlayer(strnama_pemain);
                if (!recPemain.success) {
                    await sock.sendMessage(senderJid, { text: `*${strnama_pemain}* tidak ditemukan...` });
                    delete userSessions[sender];
                    return;
                }
                const id_pemain = recPemain.data[0].id_pemain;
                const recTur = await getDataRow('*', 'turnamen', {'alias': alias});
                if (!recTur.success){
                    await sock.sendMessage(senderJid, { text: `ID Turnamen tidak ditemukan...` });
                    delete userSessions[sender];
                    return;
                }
                let statusTurnamen = recTur.data[0].status.toLowerCase(); 
                console.log(statusTurnamen);
                if (statusTurnamen==='tutup') {
                    await sock.sendMessage(senderJid, { text: `Status turnamen *${statusTurnamen.toUpperCase()}* dan akan dibuka tanggal *${DateToWIB(recTur.data[0].tgl_turnamen)}*.` });
                    delete userSessions[sender];
                    return;
                } else if (statusTurnamen==='selesai') {
                    await sock.sendMessage(senderJid, { text: `Status turnamen  *${statusTurnamen.toUpperCase()}* pada tanggal *${DateToWIB(recTur.data[0].tgl_realisasi)}*.` });
                    delete userSessions[sender];
                    return;
                } 
            
                let id_turnamen = recTur.data[0].id_turnamen;
                let id_turnamen_prev = id_turnamen - 1;
                //console.log(id_turnamen, id_turnamen_prev)
                // Temukan Ranking sebelumnya
                const recPeringkat = await getPeringkat(id_turnamen_prev);
                let ketemu = false;
                for (level=0; level<recPeringkat.data.length; level++) {
                     if (recPeringkat.data[level].id_pemain===id_pemain){
                        ketemu = true;
                        break;
                     } 
               }
               let peringkat = ketemu?level+1:99;
               // Tentukan Pool
               let pool = getPool(peringkat);
               // Simpan data
               let tgl_daftar = new Date;

               // Simpan
               const data = {'id_pemain': id_pemain, 'id_turnamen': id_turnamen, 'ranking_sebelum': peringkat, 'pool': pool, 'tgl_daftar': tgl_daftar};
               console.log(data);
               const recDaftar = await insertData('daftar', data);
               await sock.sendMessage(senderJid, { text: recDaftar.message });
                   // Tampilkan Data 
                   const recDaftar1 =  await getDataRowQuery({
                    columns: [
                      'daftar.id_pemain',
                      'pemain.nama_pemain',
                      'daftar.id_turnamen',
                      'turnamen.nama_turnamen',
                      'turnamen.alias',
                      'turnamen.tgl_turnamen',
                      'turnamen.tgl_realisasi',
                      'turnamen.status',
                      'daftar.ranking_sebelum',
                      'daftar.pool',
                      'daftar.tgl_daftar'
                    ],
                    from: 'daftar',
                    joins: [
                      { table: 'pemain', on: 'daftar.id_pemain = pemain.id_pemain' },
                      { table: 'turnamen', on: 'daftar.id_turnamen = turnamen.id_turnamen' }
                    ],
                    filters: {'turnamen.id_turnamen': id_turnamen},
                    orderBy: 'daftar.ranking_sebelum'
                  });
                  
                  if (recDaftar1.success) {
                        let strDaftar = `DAFTAR PESERTA TURNAMEN\n${recDaftar1.data[0].nama_turnamen}\nTanggal : ${DateToStr(recDaftar1.data[0].tgl_realisasi)}\n\n*No. Nama Peserta  #B/L  Pool*\n`;
                        
                        // Proses Mengurutkan Data Pool
                        const dataPool = [];
                        recDaftar1.data.forEach ((item, index) => {
                            dataPool[index] = {'nu': (index+1), 'nama_pemain': item.nama_pemain, 'ranking_sebelum': item.ranking_sebelum, 'pool': getPool((index+1))}
                        });
                        

                        // Urutkan
                        const sortDaftar = [...dataPool].sort((a, b) => {
                            if (a.pool === b.pool) {
                              return a.ranking_sebelum - b.ranking_sebelum; // urut poin jika pool sama
                            }
                            return a.pool.localeCompare(b.pool); // urut pool
                          });

                          let ranking_prev = 0;
                          sortDaftar.forEach ((item, index) => {
                              if (item.ranking_sebelum===99) ranking_prev=0; else ranking_prev=item.ranking_sebelum;
                              strDaftar += `${String((index+1)).padStart(3, ' ')}. ${item.nama_pemain} #${String(item.nu)}/${String(ranking_prev)} *${item.pool}*\n`;
                          });
                          
                        //console.log(strDaftar);
                        await sock.sendMessage(senderJid, { text: strDaftar });
                    }
               
              delete userSessions[sender];

            } else if (menu.toLowerCase()===GMP_DAFTARKAN_SAYA) {
                sock.sendPresenceUpdate("composing", senderJid);

                // Baca Tabel Pengguna untuk mendapatkan id_pemain
                let no_hp='';
                if (senderJid.includes('120363177930974800@g.us') || senderJid.includes('120363419620335483@g.us')) {no_hp = senderPart.split('@')[0]} else {no_hp = senderNumber};
                
                console.log(no_hp, senderNumber);
                const recPengguna = await getDataRowQuery({
                    columns: ['pengguna.no_hp', 'pengguna.id_pemain', 'pemain.nama_pemain'],
                    from: 'pengguna',
                    joins: [{ table: 'pemain', on: 'pengguna.id_pemain = pemain.id_pemain'}],
                    filters: {'pengguna.no_hp': no_hp},
                    orderBy: 'pemain.nama_pemain DESC'
                  });
                if (recPengguna.success) {
                    let id_pemain = recPengguna.data[0].id_pemain;
                    let alias = command.parameter[0]; 
                    // Dapatkan id_turnamen pada tabel turnamen
                    const recTur = await getDataRow('*', 'turnamen', {'alias': alias});
                    if (!recTur.success){
                        await sock.sendMessage(senderJid, { text: `ID Turnamen tidak ditemukan...` });
                        delete userSessions[sender];
                        return;
                    }
                    let statusTurnamen = recTur.data[0].status.toLowerCase(); 
                    console.log(statusTurnamen);
                    if (statusTurnamen==='tutup') {
                        await sock.sendMessage(senderJid, { text: `Status turnamen *${statusTurnamen.toUpperCase()}* dan akan dibuka tanggal *${DateToWIB(recTur.data[0].tgl_turnamen)}*.` });
                        delete userSessions[sender];
                        return;
                    } else if (statusTurnamen==='selesai') {
                        await sock.sendMessage(senderJid, { text: `Status turnamen  *${statusTurnamen.toUpperCase()}* pada tanggal *${DateToWIB(recTur.data[0].tgl_realisasi)}*.` });
                        delete userSessions[sender];
                        return;
                    } 
                    let id_turnamen = recTur.data[0].id_turnamen;
                    let id_turnamen_prev = id_turnamen - 1;
                    //console.log(id_turnamen, id_turnamen_prev)
                    // Temukan Ranking sebelumnya
                    const recPeringkat = await getPeringkat(id_turnamen_prev);
                    let ketemu = false;
                    for (level=0; level<recPeringkat.data.length; level++) {
                         if (recPeringkat.data[level].id_pemain===id_pemain){
                            ketemu = true;
                            break;
                         } 
                   }
                   let peringkat = ketemu?level+1:99;
                   // Tentukan Pool
                   let pool = getPool(peringkat);
                   // Simpan data
                   let tgl_daftar = new Date;

                   // Simpan
                   const data = {'id_pemain': id_pemain, 'id_turnamen': id_turnamen, 'ranking_sebelum': peringkat, 'pool': pool, 'tgl_daftar': tgl_daftar};
                   console.log(data);
                   const recDaftar = await insertData('daftar', data);
                   await sock.sendMessage(senderJid, { text: recDaftar.message });

                   // Tampilkan Data 
                   const recDaftar1 =  await getDataRowQuery({
                    columns: [
                      'daftar.id_pemain',
                      'pemain.nama_pemain',
                      'daftar.id_turnamen',
                      'turnamen.nama_turnamen',
                      'turnamen.alias',
                      'turnamen.tgl_turnamen',
                      'turnamen.tgl_realisasi',
                      'turnamen.status',
                      'daftar.ranking_sebelum',
                      'daftar.pool',
                      'daftar.tgl_daftar'
                    ],
                    from: 'daftar',
                    joins: [
                      { table: 'pemain', on: 'daftar.id_pemain = pemain.id_pemain' },
                      { table: 'turnamen', on: 'daftar.id_turnamen = turnamen.id_turnamen' }
                    ],
                    filters: {'turnamen.id_turnamen': id_turnamen},
                    orderBy: 'daftar.ranking_sebelum'
                  });
                   
                  if (recDaftar1.success) {
                        let strDaftar = `DAFTAR PESERTA TURNAMEN\n${recDaftar1.data[0].nama_turnamen}\nTanggal : ${DateToStr(recDaftar1.data[0].tgl_realisasi)}\n\n*No. Nama Peserta  #B/L  Pool*\n`;
                        
                        // Proses Mengurutkan Data Pool
                        const dataPool = [];
                        recDaftar1.data.forEach ((item, index) => {
                            dataPool[index] = {'nu': (index+1), 'nama_pemain': item.nama_pemain, 'ranking_sebelum': item.ranking_sebelum, 'pool': getPool((index+1))}
                        });
                        

                        // Urutkan
                        const sortDaftar = [...dataPool].sort((a, b) => {
                            if (a.pool === b.pool) {
                              return a.ranking_sebelum - b.ranking_sebelum; // urut poin jika pool sama
                            }
                            return a.pool.localeCompare(b.pool); // urut pool
                          });

                        let ranking_prev = 0;
                        sortDaftar.forEach ((item, index) => {
                            if (item.ranking_sebelum===99) ranking_prev=0; else ranking_prev=item.ranking_sebelum;
                            strDaftar += `${String((index+1)).padStart(3, ' ')}. ${item.nama_pemain} #${String(item.nu)}/${String(ranking_prev)} *${item.pool}*\n`;
                        });
                        
                        //console.log(strDaftar);
                        await sock.sendMessage(senderJid, { text: strDaftar });
                    }
                } else {
                    await sock.sendMessage(senderJid, { text: recPengguna.message });
                }
                delete userSessions[sender];

            } else if (menu.toLowerCase()===GMP_TENTUKAN_POOL) {
                sock.sendPresenceUpdate("composing", senderJid);

                // Cari id_turnamen
                let alias = command.parameter[0]; 
                // Dapatkan id_turnamen pada tabel turnamen
                const recTur = await getDataRow('*', 'turnamen', {'alias': alias});
                if (!recTur.success){
                    await sock.sendMessage(senderJid, { text: `ID Turnamen tidak ditemukan...` });
                    delete userSessions[sender];
                    return;
                }
                let statusTurnamen = recTur.data[0].status.toLowerCase(); 
                console.log(statusTurnamen);
                if (statusTurnamen==='tutup') {
                    await sock.sendMessage(senderJid, { text: `Status turnamen *${statusTurnamen.toUpperCase()}* dan akan dibuka tanggal *${DateToWIB(recTur.data[0].tgl_turnamen)}*.` });
                    delete userSessions[sender];
                    return;
                } else if (statusTurnamen==='selesai') {
                    await sock.sendMessage(senderJid, { text: `Status turnamen  *${statusTurnamen.toUpperCase()}* pada tanggal *${DateToWIB(recTur.data[0].tgl_realisasi)}*.` });
                    delete userSessions[sender];
                    return;
                } 
                let id_turnamen = recTur.data[0].id_turnamen;

                   const recDaftar1 =  await getDataRowQuery({
                    columns: [
                      'daftar.id_pemain',
                      'pemain.nama_pemain',
                      'daftar.id_turnamen',
                      'turnamen.nama_turnamen',
                      'turnamen.alias',
                      'turnamen.tgl_turnamen',
                      'turnamen.tgl_realisasi',
                      'turnamen.status',
                      'daftar.ranking_sebelum',
                      'daftar.pool',
                      'daftar.tgl_daftar'
                    ],
                    from: 'daftar',
                    joins: [
                      { table: 'pemain', on: 'daftar.id_pemain = pemain.id_pemain' },
                      { table: 'turnamen', on: 'daftar.id_turnamen = turnamen.id_turnamen' }
                    ],
                    filters: {'turnamen.id_turnamen': id_turnamen},
                    orderBy: 'daftar.ranking_sebelum'
                  });
                  if (recDaftar1.success) {
                    let strDaftar = `DAFTAR PESERTA TURNAMEN\n${recDaftar1.data[0].nama_turnamen}\nTanggal : ${DateToStr(recDaftar1.data[0].tgl_realisasi)}\n\n*No. Nama Peserta  #B/L  Pool*\n`;
                        
                    // Proses Mengurutkan Data Pool
                    const dataPool = [];
                    recDaftar1.data.forEach ((item, index) => {
                        dataPool[index] = {'nu': (index+1), 'nama_pemain': item.nama_pemain, 'ranking_sebelum': item.ranking_sebelum, 'pool': getPool((index+1))}
                    });
                        

                    // Urutkan
                    const sortDaftar = [...dataPool].sort((a, b) => {
                        if (a.pool === b.pool) {
                            return a.ranking_sebelum - b.ranking_sebelum; // urut poin jika pool sama
                        }
                        return a.pool.localeCompare(b.pool); // urut pool
                    });

                    let ranking_prev = 0;
                    sortDaftar.forEach ((item, index) => {
                        if (item.ranking_sebelum===99) ranking_prev=0; else ranking_prev=item.ranking_sebelum;
                        strDaftar += `${String((index+1)).padStart(3, ' ')}. ${item.nama_pemain} #${String(item.nu)}/${String(ranking_prev)} *${item.pool}*\n`;
                    });
                          
                    //console.log(strDaftar);
                    await sock.sendMessage(senderJid, { text: strDaftar });
                }
                
                delete userSessions[sender];

            } else if (menu.toLowerCase()===GMP_RENCANA_TURNAMEN){
                sock.sendPresenceUpdate("composing", senderJid);
                const recTurnamen = await getDataRow('*', 'turnamen');
                console.log(command.parameter);

                if (recTurnamen.success){
                    let periode ='';
                    if (command.parameter.length) {
                        periode =  `Tahun : ${command.parameter[0]}`;
                        generateImageReport({
                            title: 'JADWAL RENCANA TURNAMEN INTERNAL',
                            subtitle: 'PTM GEDUNG MERAH PUTIH',
                            periode: periode,
                            output: `./src/images/laporan_turnamen_${senderNumber}.png`,
                            columns: [
                              { key: 'id', label: 'ID', x: 50 },
                              { key: 'nama_turnamen', label: 'NAMA TURNAMEN', x: 90 },
                              { key: 'tgl_turnamen', label: 'RENCANA', x: 450, format: DateToStr },
                              { key: 'tgl_realisasi', label: 'REALISASI', x: 550, format: DateToStr },
                              { key: 'status', label: 'STATUS', x: 650 },
                            ],
                            data: recTurnamen.data,
                          });
                    } else {
                        console.log('Semua Turnamen');
                        generateImageReport({
                            title: 'JADWAL RENCANA TURNAMEN INTERNAL',
                            subtitle: 'PTM GEDUNG MERAH PUTIH',
                            periode: periode,
                            output: `./src/images/laporan_turnamen_${senderNumber}.png`,
                            columns: [
                              { key: 'id', label: 'ID', x: 50 },
                              { key: 'nama_turnamen', label: 'NAMA TURNAMEN', x: 90 },
                              { key: 'tgl_turnamen', label: 'RENCANA', x: 450, format: DateToStr },
                              { key: 'tgl_realisasi', label: 'REALISASI', x: 550, format: DateToStr },
                              { key: 'tahun', label: 'TAHUN', x: 650 },
                            ],
                            data: recTurnamen.data,
                          });
                    }
                    await sock.sendMessage(senderJid, {image: {url: `./src/images/laporan_turnamen_${senderNumber}.png`}, caption: 'Jadwal Rencana Turnamen'});
                } else {
                    await sock.sendMessage(senderJid, { text: `Data Rencana Turnamen Tidak Ditemukan...` });
                }
                

                delete userSessions[sender];

            } else if (text.trim().toLowerCase()===GMP_MULAI_IMPORT_DATA) {
                await sock.sendMessage(senderJid, { text: `Masukkan _File Excel_ yang akan diimport :` });
                userSessions[sender] = { step: IMPORTDATA_MULAI } 
            } else if (menu.toLowerCase()===GMP_POSISI_TERBAIK){
                if (command.parameter.length!==2) {
                    await sock.sendMessage(senderJid, { text: `_Informasi tidak lengkap_.\n\nContoh:\nBuat posisi terbaik untuk *M. Yunus* pada turnamen *Pertama*` });
                    return;
                }
                if (command.parameter.length>1){
                    sock.sendPresenceUpdate("composing", senderJid);

                    let id_pemain = command.parameter[0];
                    let nama_pemain = '';
                    if (!isNumber(id_pemain)){
                        const recPemain1 = await getIDPlayer(id_pemain);

                        if (recPemain1.success) { 
                            id_pemain = recPemain1.data[0].id_pemain;
                            nama_pemain = recPemain1.data[0].nama_pemain;
                        } else {
                            await sock.sendMessage(senderJid, { text: `Data ${command.parameter[0]} tidak ditemukan.` });
                            delete userSessions[sender];
                            return; 
                        }
                    } else {
                        const recPemain2 = await getDataRow('*', 'pemain', {'id_pemain': id_pemain});
                        if (!recPemain2.success) {
                            await sock.sendMessage(senderJid, { text: `Data ${command.parameter[0]} tidak ditemukan.` });
                            delete userSessions[sender];
                            return;
                        }
                        nama_pemain = recPemain2.data[0].nama_pemain;
                    }

                    let id_turnamen = command.parameter[1];
                    let nama_turnamen = '';
                    if (!isNumber(id_turnamen)){
                        const recTur1 = await getDataRow('*', 'turnamen', {'alias': id_turnamen.toLowerCase()});
                        if (recTur1.success) { 
                            id_turnamen = recTur1.data[0].id_turnamen;
                            nama_turnamen = recTur1.data[0].nama_turnamen;
                        } else {
                            await sock.sendMessage(senderJid, { text: `Data ${command.parameter[1]} tidak ditemukan.` });
                            delete userSessions[sender];
                            return; 
                        }
                    } else {
                        const recTur2 = await getDataRow('*', 'turnamen', {'id_turnamen': id_turnamen});
                        if (recTur2.success) { 
                            id_turnamen = recTur2.data[0].id_turnamen;
                            nama_turnamen = recTur2.data[0].nama_turnamen;
                        } 
                    }                    
                
                    // Menncetak Posisi
                    const recPosisi = await getPosisiTerbaik(id_turnamen, id_pemain);
                    console.log(recPosisi.data);
                    if (!recPosisi.success){
                        await sock.sendMessage(senderJid, { text: `Data tidak ditemukan.` });
                        delete userSessions[sender];
                        return;
                    }
                    
                    let strPosisi=`*Posisi Terbaik ${nama_pemain} Pada Turnamen ${nama_turnamen}:*\n\n`;
                    recPosisi.data.forEach(item => {
                        strPosisi += `Nama Lawan : ${item.nama_lawan}\nBabak : ${item.keterangan_babak}\nPool : ${item.pool}\nSkor : ${item.skor_pemain} / ${item.skor_lawan}\nPoin : ${item.poin}\n\n`;                
                    });
                    await sock.sendMessage(senderJid, { text: strPosisi });
                }

                delete userSessions[sender];
            }

            // Import Data

            return;
        }
        
    });
    return sock;
}

startBot();
