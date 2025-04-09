const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');

// Daftarkan font Arial biasa
registerFont('./src/fonts/arial.ttf', { family: 'Arial' });

// Daftarkan font italic jika ada
registerFont('./src/fonts/ariali.ttf', { family: 'Arial', style: 'italic' });



const handleFile = async (sock, m) => {
    const modul = 'handleFile';
    try {
    if (!m.message || !m.message.documentMessage) {
      console.log('Pesan tidak mengandung file.');
      return;
    }

    const fileName = m.message.documentMessage.fileName;
    const fileMimeType = m.message.documentMessage.mimetype;

    if (fileMimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      console.log('📂 File .xlsx diterima:', fileName);

      const fPath = path.join(__dirname, '..', 'data', fileName);
      if (fs.existsSync(fPath)){
        fs.unlinkSync(fPath);
        console.log(`🗑️ File ${fileName} berhasil dihapus.`);
      }

      // Pastikan folder 'data' ada
      const dirPath = path.join(__dirname, '..', 'data');
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      // Simpan file sebagai "import.xlsx"
      const filePath = path.join(dirPath, fileName);

      // Unduh file dalam bentuk buffer
      const buffer = await downloadMediaMessage(m, "buffer");

      // Simpan file ke dalam sistem
      fs.writeFileSync(filePath, buffer);
      console.log('✅ File disimpan di:', filePath);

      // Membaca file Excel yang baru disimpan
      const workbook = xlsx.readFile(filePath);
      const sheet_name_list = workbook.SheetNames;

      // Mengambil data dari sheet pertama
      const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
      //console.log('📊 Data dari file .xlsx:', data);

      // Kirim balasan ke pengirim
      const senderJid = m.key.remoteJid;
      await sock.sendMessage(senderJid, { text: `✅ File *${fileName}* berhasil diterima!` });

      let status = data.length?true:false;
  
      return {
        'module': modul,  
        'success': status, 
        'message': 'Data berhasil disimpan.',
        'data': data,
        'filename': fileName,
      }

    } else {
        return {
            'module': modul,  
            'success': false, 
            'message': 'Data Gagal disimpan...',
            'data': {},
            'filename':'',
          }        
      console.log('⛔ Format file bukan .xlsx');
    }
  } catch (error) {
    console.error('❌ Terjadi kesalahan saat memproses file:', error);
  }
};

const readFileExcel = async (filename) => {
    const modul = 'handleFile';

    try {

        // Baca file Excel
        const filePath = path.join(__dirname, '..', 'data', filename);
        console.log(filePath);
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        let status = sheet.length?true:false;
  
        return {
            'module': modul,  
            'success': status, 
            'message': 'Data berhasil dibaca.',
            'data': sheet,
        }

    } catch (error) {
        console.error('Gagal Membaca Data:', error);
        return {
            'module': modul,  
            'success': false, 
            'message': 'Data tidak berhasil dibaca.',
            'data': {},
        }
    }
}

// Fungsi untuk mendapatkan nama bulan dalam bahasa Indonesia
function getIndonesianMonthName(date) {
  const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  return months[date.getMonth()];
}

// Fungsi untuk mengonversi Date ke format Indonesia (DD/MM/YYYY)
const DateToWIB = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  //const month = String(date.getMonth() + 1).padStart(2, '0'); // Bulan dimulai dari 0
  const year = date.getFullYear();
  const monthName = getIndonesianMonthName(date);
  return `${day} ${monthName} ${year}`;
}

// Fungsi untuk mengonversi Date ke format lengkap Indonesia (Hari, DD Bulan YYYY HH:mm:ss)
const DateTimeIndonesia = (date, timezone = 'WIB') => {
  //const dayName = getIndonesianDayName(date);
  const day = String(date.getDate()).padStart(2, '0');
  //const monthName = getIndonesianMonthName(date);
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Bulan dimulai dari 0  
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds} ${timezone}`;
}

async function generateImage(recParam, senderNumber) {
  const rowHeight = 25;
  const rowHeightHeader = 220;
  const canvasWidth = 600;
  const canvasHeight = 800; // dinaikkan agar muat banyak data

  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext('2d');

  //const recPeringkat = await getPeringkat(id_turnamen_param);

  // Load background
  const backgroundPath = './src/images/background.png';
  const background = await loadImage(backgroundPath);
  ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight);

  // Load logo
  const logoPath = './src/images/logo.png';
  if (fs.existsSync(logoPath)) {
    const logo = await loadImage(logoPath);
    ctx.drawImage(logo, 20, 20, 100, 100);
  } else {
    console.warn('⚠️ Logo tidak ditemukan di:', logoPath);
  }

  // Header - Institusi
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 24px Arial';
  ctx.fillText('PTM GEDUNG MERAH PUTIH', 150, 60);
  ctx.font = '20px Arial';
  ctx.fillText('Jln. Pemuda (SMAN 4 Tanjungpinang)', 150, 90);

  // Turnamen
  ctx.fillStyle = '#760000';
  ctx.font = 'bold 16px Arial';
  ctx.fillText('RANGKING PEMAIN PTM GMP', 100, 150);
  ctx.fillStyle = '#000000';
  ctx.font = '16px Arial';
  const turnamen = recParam.turnamen[0].nama_turnamen;
  ctx.fillText(turnamen, 100, 170);
  const tgl = 'Tanggal ' + DateToWIB(recParam.turnamen[0].tgl_turnamen);
  ctx.fillText(tgl, 100, 190);

  // Kolom Header
  ctx.font = 'bold 16px Arial';
  ctx.fillText('#', 100, rowHeightHeader);
  ctx.fillText('ID', 130, rowHeightHeader);
  ctx.fillText('NAMA PEMAIN', 230, rowHeightHeader);
  ctx.fillText('POIN', 500, rowHeightHeader);

  // Data Ranking
  ctx.font = '16px Arial';
  recParam.data.forEach((pemain, index) => {
    let y = rowHeightHeader + (index + 1) * rowHeight;
    ctx.fillText(index + 1, 100, y);
    ctx.fillText(pemain.id_pemain, 130, y);
    ctx.font = 'italic 16px Arial'; // Nama miring
    ctx.fillText(pemain.nama_pemain, 230, y);
    ctx.font = '16px Arial'; // Normal kembali
    ctx.fillText(pemain.total_poin.toString(), 500, y);
  });

  // Tanggal Cetak
  ctx.font = 'italic 16px Arial';
  const tglCetak = 'Dicetak pada: ' + DateTimeIndonesia(new Date());
  ctx.fillText(tglCetak, 100, canvasHeight - 30);

  // Simpan ke file
  const outputPath = './src/images/turnamen_'+ recParam.turnamen[0].id_turnamen +'_'+senderNumber+'.png';
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);

  console.log('✅ Gambar ranking berhasil dibuat:', outputPath);
}


function parsePerintah(text) {
  // Normalisasi awal
  text = text
    .replace(/\s+/g, ' ')
    .replace(/;/g, ',')
    .replace(/tampilkan/gi, 'buat')    
    .replace(/h2h/gi, 'head to head')
    .replace(/pertemuan langsung/gi, 'head to head')
    .replace(/rangking|peringkat/gi, 'ranking')
    .replace(/\butnuk\b|\buntk\b|\bntuk\b|\btuk\b/gi, 'untuk')
    .trim();

  // Kata pemisah umum
  const separators = ['antara', 'dengan', 'untuk', 'pada', 'turnamen', 'dan'];

  // Temukan pemisah pertama untuk potong perintah
  let firstSeparatorIndex = -1;
  for (let word of separators) {
    const index = text.toLowerCase().indexOf(' ' + word + ' ');
    if (index !== -1 && (firstSeparatorIndex === -1 || index < firstSeparatorIndex)) {
      firstSeparatorIndex = index;
    }
  }

  const perintah = firstSeparatorIndex !== -1 ? text.substring(0, firstSeparatorIndex).trim() : text;
  const paramText = firstSeparatorIndex !== -1 ? text.substring(firstSeparatorIndex).trim() : '';

  // Ambil angka 6 digit atau lebih
  let numbers = paramText.match(/\d{6,}/g) || [];

  // Ambil frasa dengan memecah berdasarkan pemisah
  const phrases = paramText
    .replace(/\b(antara|dengan|untuk|pada|turnamen|dan)\b/gi, '|') // ganti penghubung jadi pemisah
    .split('|')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !/^\d{6,}$/.test(s)); // Hanya ambil frasa non-angka

  // Gabungkan parameter
  const parameters = [...numbers, ...phrases];

  return [{
    perintah: perintah,
    parameter: parameters
  }];
}
  
/*
function parsePerintah(text) {
  // Normalisasi typo & sinonim
  text = text
    .replace(/\s+/g, ' ')
    .replace(/pada/gi, '')
    .replace(/antara/gi, '')
    .replace(/;/g, ',')
    .replace(/tampilkan/gi, 'buat')
    .replace(/rangking|peringkat/gi, 'ranking')
    .replace(/h2h|pertemuan langsung/gi, 'head to head')
    .replace(/\butnuk\b|\buntk\b|\bntuk\b|\btuk\b/gi, 'untuk')
    .replace(/\bpertma\b/gi, 'Pertama')
    .trim();

  const kataPenghubung = ['antara', 'dengan', 'untuk', 'pada', 'dari', 'ke'];
  const kataAbaikan = ['turnamen'];

  const words = text.split(' ');
  const perintahWords = [];
  const parameter = [];
  let collectingParam = false;
  let tempName = [];

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const next = words[i + 1];

    const isCapital = /^[A-Z]/.test(word);
    const isNumber = /^\d{6,}$/.test(word);
    const isKataHubung = kataPenghubung.includes(word.toLowerCase());
    const isIgnore = kataAbaikan.includes(word.toLowerCase());

    // Deteksi parameter:
    if (isIgnore) continue;

    if (isNumber || isCapital) {
      collectingParam = true;
      tempName.push(word);

      // Jika next bukan kapital, akhiri nama
      if (!next || !/^[A-Z]/.test(next)) {
        parameter.push(tempName.join(' '));
        tempName = [];
      }

    } else if (collectingParam && !isKataHubung) {
      if (tempName.length > 0) {
        parameter.push(tempName.join(' '));
        tempName = [];
      }
    } else if (!collectingParam) {
      perintahWords.push(word);
    }
  }

  if (tempName.length > 0) {
    parameter.push(tempName.join(' '));
  }

  return [{
    perintah: perintahWords.join(' ').trim(),
    parameter
  }];
} */

function isNumber(value) {
  return !isNaN(value) && !isNaN(parseFloat(value));
}

module.exports = {
  handleFile, readFileExcel, DateToWIB, DateTimeIndonesia, generateImage, parsePerintah, isNumber
};