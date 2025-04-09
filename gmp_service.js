const { getConnection } = require('./gmp_db');
const path = require('path');
const fs = require('fs');
//const { connect } = require('http2');

/**
 * Menambah Data ke Table
 * @param {string} table - Tabel yang akan ditambahkan
 * @param {Array} data - Array data yang akan disimpan
 * @param {Array} result - Status proses menambah data  
 **/
async function insertData(table, data) {

  const modul='insertData';
  const connection = await getConnection();

  try {
      if (!table || typeof table !== 'string' || !data || typeof data !== 'object' || Object.keys(data).length === 0 ) {
        return {
          'module': modul,
          'success': false,
          'message': 'Table dan Data tidak Valid!.',
          'data': {},
        }
      }
      
      const keys = Object.keys(data).join(', ');
      const values = Object.values(data);
      const placeholders = values.map(() => '?').join(', ');
      
      const query = `INSERT INTO ${table} (${keys}) VALUES (${placeholders})`;
      const [result] = await connection.execute(query, values);
      let status = result.length?true:false;  

      return {
        'module': modul,
        'success': status,
        'message': 'Berhasil Menambah Data.',
        'data': result,
      }
  } catch (error) {
    return {
      'module': modul,
      'success': false,
      'message': 'Gagal Menambah Data.',
      'data': {},
    }  
  } finally {
    if (connection) await connection.end();
  }
}

/**
 * Mengupdate Data ke Table
 * @param {string} table - Tabel yang akan diupdate
 * @param {Array} data - Array data yang akan diupdate
 * @param {Array} condition - Kondisi untuk menentukan baris yang akan diperbarui {kolom: nilai}
 * @param {Array} result - Status proses update data  
 **/
async function updateData(table, data, condition) {
  
  const modul='updateData';
  const connection = await getConnection();

  try {
      if (!table || typeof table !== 'string' || !data || typeof data !== 'object' || Object.keys(data).length === 0 || !condition || typeof condition !== 'object' || Object.keys(condition).length === 0) {
        return {
          'module': modul,
          'success': false,
          'message': 'Table, Data dan Kondisi tidak Valid!.',
          'data': {},
        } 
      }
      
      const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
      const conditionClause = Object.keys(condition).map(key => `${key} = ?`).join(' AND ');
      const values = [...Object.values(data), ...Object.values(condition)];
      
      const query = `UPDATE ${table} SET ${setClause} WHERE ${conditionClause}`;
      const [result] = await connection.execute(query, values);
      let status = result.length?true:false;  

      return {
        'module': modul,
        'success': status,
        'message': 'Berhasil Memperbaiki Data.',
        'data': result,
      }      
  } catch (error) {
    return {
      'module': modul,
      'success': false,
      'message': 'Gagal Memperbaiki Data.',
      'data': {},
    }    
  } finally {
    if (connection) await connection.end();
  }
}

/**
 * Menghapus Data
 * @param {string} table - Tabel yang akan dihapus
 * @param {Array} conditions - Kondisi data yang akan dihapus
 * @param {Array} result - Status proses hapus data  
 */
async function deleteData(table, condition) {
  const modul='deleteData';
  const connection = await getConnection();

  try {  
      if (!table || typeof table !== 'string' || !condition || typeof condition !== 'object' || Object.keys(condition).length === 0) {
        return {
          'module': modul,
          'success': false,
          'message': 'Table dan Kondisi tidak Valid!.',
          'data': {},
        }
      }
      
      const conditionClause = Object.keys(condition).map(key => `${key} = ?`).join(' AND ');
      const values = Object.values(condition);
      
      const query = `DELETE FROM ${table} WHERE ${conditionClause}`;
      const [result] = await connection.execute(query, values);
      let status = result.length?true:false;  

      return {
        'module': modul,
        'success': status,
        'message': 'Berhasil Menghapus Data.',
        'data': result,
      }      
  } catch (error) {
    return {
      'module': modul,
      'success': false,
      'message': 'Gagal Menghapus Data.',
      'data': {},
    }    
  } finally {
    if (connection) await connection.end();
  }
}

/**
 * Mengambil Data Record/Baris
 * @param {string} select - Data yang akan ditampilkan
 * @param {string} table - Tabel yang akan ditampilkan
 * @param {object} where - Kondisi data yang akan ditampilkan boleh null. 
 * @param {Array} row - Data nilai Mahasiswa
 */
async function getDataRow(select, table, where = null) {
    const modul = 'getDataRow';
    const connection = await getConnection();
  
    try {
          let query = `SELECT ${select} FROM ${table}`;
          let values = [];
  
          if (where && typeof where === 'object' && Object.keys(where).length > 0) {
              const whereClauses = Object.keys(where).map(key => `${key} = ?`).join(' AND ');
              query += ` WHERE ${whereClauses}`;
              values = Object.values(where);
          }
  
          //console.log(query, values);

          const [rows] = await connection.execute(query, values);
          let status = rows.length?true:false;  

          const result={
            'module': modul,  
            'success': status, 
            'message': 'Data berhasil dibaca...',
            'data': rows,
          }
          return result;
        } catch (error) {
            const result={
                'module': modul,  
                'success':false, 
                'message':error,
                'data':{},
              }
              return result;
        } finally {
          if (connection) await connection.end();
        }
  }

async function fetchDataWithConditions(selectColumns, tableName, whereConditions = {}) {
    const connection = await getConnection();

    try {
      // Validasi input
      if (!selectColumns || selectColumns.length === 0) {
        throw new Error('Kolom yang dipilih tidak boleh kosong.');
      }
      if (!tableName || tableName.length === 0) {
        throw new Error('Nama tabel tidak boleh kosong.');
      }
      //if (Object.keys(whereConditions).length === 0) {
      //  throw new Error('Kondisi WHERE tidak boleh kosong.');
      //}
  
      // Susun query SELECT
      let query = `SELECT ${selectColumns.join(', ')} FROM ${tableName} WHERE 1=1`;
      const params = [];


      if (Object.keys(whereConditions).length) {
        // Tambahkan kondisi WHERE
        for (const [column, value] of Object.entries(whereConditions)) {
          query += ` AND ${column} = ?`;
          params.push(value);
      }
    }
  
      const [rows] = await connection.execute(query, params);
      return rows;
    } finally {
      if (connection) await connection.end();
    }
  }
  
/*
// Contoh penggunaan
const data = [
    { nim: '2103030033', kodemtk: 'AMS', makalah: 85, kehadiran: 100, diskusi: 85, uts: 85 },
    { nim: '2203030001', kodemtk: 'AMS', makalah: 85, kehadiran: 100, diskusi: 85, uts: 89 }
];

insertData('nilaimtk', data, ['nim', 'kodemtk']);

const updatedData = [
    { nim: '2103030033', kodemtk: 'AMS', makalah: 90, kehadiran: 100, diskusi: 90, uts: 90 }
];
updateData('nilaimtk', updatedData, ['nim', 'kodemtk']);

deleteData('nilaimtk', { nim: '2203030001', kodemtk: 'AMS' });
*/

async function getQuery({ select = "*", table, where = "", group = "", order = "" }) {
  
  const connection = await getConnection();

  if (connection===null){
    console.log("MySQL Server Belum Aktif...");
    return;
  }
  try {
 
    let query = `SELECT ${select} FROM ${table}`;
    if (where) query += ` WHERE ${where}`;
    if (group) query += ` GROUP BY ${group}`;
    if (order) query += ` ORDER BY ${order}`;

    const [rows] = await connection.execute(query);
    return rows;
  } finally {
    if (connection) await connection.end();
  }

}

async function executeSQL(sql) {
  
  const connection = await getConnection();

  if (connection===null){
    console.log("MySQL Server Belum Aktif...");
    return;
  }
  try {
    const [rows] = await connection.execute(sql);
    return rows;
  } finally {
    if (connection) await connection.end();
  }

}

async function resetAutoincrement(settings) {
  const modul='resetAutoincrement';
  const connection = await getConnection();

  try {  
      if (!settings || typeof settings !== 'string') {
        return {
          'module': modul,
          'success': false,
          'message': 'Settings tidak Valid!.',
          'data': {},
        }
      }
      
      const [result] = await connection.execute(settings, null);
      let status = true;  

      return {
        'module': modul,
        'success': status,
        'message': 'Settings Berhasil.',
        'data': result,
      }      
  } catch (error) {
    return {
      'module': modul,
      'success': false,
      'message': 'Settings Gagal.',
      'data': {},
    }    
  } finally {
    if (connection) await connection.end();
  }
}

async function getPeringkat(idTurnamen) {
  const modul = 'getPeringkat';
  const connection = await getConnection();

  try {
    // Ambil daftar turnamen yang lebih kecil atau sama dengan idTurnamen
    const [turnamen] = await connection.execute(
      `SELECT DISTINCT id_turnamen FROM peringkat WHERE id_turnamen <= ? ORDER BY id_turnamen`,
      [idTurnamen]
    );
    const daftarTurnamen = turnamen.map((t) => t.id_turnamen);

    //console.log("Daftar Turnamen yang Diambil:", daftarTurnamen);

    if (daftarTurnamen.length === 0) {
      console.log("Tidak ada data turnamen yang ditemukan.");
      return;
    }

    const [dataTurnamen] = await connection.execute(
      `SELECT id_turnamen, nama_turnamen, tgl_turnamen FROM turnamen WHERE id_turnamen = ?`,
      [idTurnamen]
    );

    const [peringkat] = await connection.execute(
      `SELECT p.id_pemain, pm.nama_pemain, SUM(p.total_poin) AS total_poin, 
              COUNT(DISTINCT p.id_turnamen) AS jumlah_turnamen 
       FROM peringkat p
       JOIN pemain pm ON p.id_pemain = pm.id_pemain
       WHERE p.id_turnamen IN (${daftarTurnamen.map(() => "?").join(",")}) 
       GROUP BY p.id_pemain, pm.nama_pemain`,
      daftarTurnamen
    );
    
    //console.log("Data Peringkat:", peringkat);

    if (peringkat.length === 0) {
      console.log("Tidak ada peringkat pemain ditemukan.");
      return;
    }

    // Ambil poin terbaik dari semua turnamen
    const [bestPoin] = await connection.execute(
      `SELECT id_pemain, MAX(poin_terbaik) AS poin_terbaik 
       FROM best_poin WHERE id_turnamen IN (${daftarTurnamen.map(() => "?").join(",")}) 
       GROUP BY id_pemain`,
      daftarTurnamen
    );

    //console.log("Data Poin Terbaik:", bestPoin);

    // Ambil data head-to-head
    const [headToHead] = await connection.execute(
      `SELECT id_pemain, id_lawan, SUM(jumlah_menang) as jumlah_menang, SUM(jumlah_kalah) as jumlah_kalah 
       FROM head_to_head WHERE id_turnamen IN (${daftarTurnamen.map(() => "?").join(",")})
       GROUP BY id_pemain, id_lawan`,
      daftarTurnamen
    );

    //console.log("Data Head-to-Head:", headToHead);
    
    // Ambil daftar pemain
    const [pemain] = await connection.execute(`SELECT id_pemain, nama_pemain FROM pemain`);

    // Ambil peringkat sebelumnya jika bukan turnamen pertama
    let peringkatSebelumnya = {};
    if (daftarTurnamen.length > 1) {
      const [prevRanking] = await connection.execute(
        `SELECT id_pemain, SUM(total_poin) AS total_poin 
         FROM peringkat WHERE id_turnamen IN (${daftarTurnamen
           .slice(0, -1)
           .map(() => "?")
           .join(",")}) 
         GROUP BY id_pemain`,
        daftarTurnamen.slice(0, -1)
      );

      prevRanking.forEach((p) => {
        peringkatSebelumnya[p.id_pemain] = p.total_poin;
      });

      //console.log("Data Peringkat Sebelumnya:", peringkatSebelumnya);
    }

    // Konversi data ke objek untuk akses cepat
    let poinTerbaikMap = {};
    bestPoin.forEach((b) => (poinTerbaikMap[b.id_pemain] = b.poin_terbaik));

    let namaPemainMap = {};
    pemain.forEach((p) => (namaPemainMap[p.id_pemain] = p.nama_pemain));

    let headToHeadMap = {};
    headToHead.forEach((h) => {
      const key = `${h.id_pemain}-${h.id_lawan}`;
      headToHeadMap[key] = h.jumlah_menang - h.jumlah_kalah;
    });

    //console.log(headToHeadMap);

    // Konversi angka ke bilangan bulat
    
    peringkat.forEach((p) => {
      p.total_poin = Math.round(parseFloat(p.total_poin)) || 0;
      p.jumlah_turnamen = parseInt(p.jumlah_turnamen, 10) || 0;
      poinTerbaikMap[p.id_pemain] = Math.round(parseFloat(poinTerbaikMap[p.id_pemain] || 0));
      peringkatSebelumnya[p.id_pemain] = Math.round(parseFloat(peringkatSebelumnya[p.id_pemain] || 0));
    });

    peringkat.sort((a, b) => {
        if (b.total_poin !== a.total_poin) return b.total_poin - a.total_poin; // Urutkan berdasarkan Total Poin DESC
        if (a.jumlah_turnamen !== b.jumlah_turnamen) return a.jumlah_turnamen - b.jumlah_turnamen; // Urutkan berdasarkan Jumlah Turnamen ASC
    
        // 🔥 Gunakan total poin dari peringkat sebelumnya sebagai faktor utama dalam tiebreaker
        if ((peringkatSebelumnya[b.id_pemain] || 0) !== (peringkatSebelumnya[a.id_pemain] || 0)) 
            return (peringkatSebelumnya[b.id_pemain] || 0) - (peringkatSebelumnya[a.id_pemain] || 0);
    
        // Jika tetap sama, gunakan poin terbaik DESC
        if ((poinTerbaikMap[b.id_pemain] || 0) !== (poinTerbaikMap[a.id_pemain] || 0))
            return (poinTerbaikMap[b.id_pemain] || 0) - (poinTerbaikMap[a.id_pemain] || 0);
    
        // Gunakan head-to-head sebagai tiebreaker terakhir
        const h2hKey = `${a.id_pemain}-${b.id_pemain}`;
        const h2hReverseKey = `${b.id_pemain}-${a.id_pemain}`;
        if (headToHeadMap[h2hKey] || headToHeadMap[h2hReverseKey]) {
            return (headToHeadMap[h2hReverseKey] || 0) - (headToHeadMap[h2hKey] || 0);
        }
    
        return 0; // Jika semua tiebreaker gagal, tetap di posisi yang sama
    });
     
    /*    
    peringkat.forEach((p, index) => {
      console.log(
        `| ${index + 1}  | ${p.id_pemain}    | ${namaPemainMap[p.id_pemain]} | ${p.total_poin} | ${
          poinTerbaikMap[p.id_pemain] || 0
        } | ${p.jumlah_turnamen} |`
      );
    });

    */
    let status = peringkat?true:false;  

    return {
        'module': modul,
        'success': status,
        'message': 'Proses Membuat Peringkat Pemain Berhasil.',
        'turnamen': dataTurnamen,
        'data': peringkat,
    }
  } catch (error) {
    return {
      'module': modul,
      'success': false,
      'message': 'Proses Membuat Peringkat Pemain Gagal.',
      'turnamen': {},
      'data': {},
  }
} finally {
    if (connection) await connection.end();
  }
}

/*
* Fungsi Head To Head
*/

async function findHeadToHead(id_pemain, id_lawan, id_turnamen) {
  const modul='findHeadToHead';
  const connection = await getConnection();

    try {
        // Ambil daftar turnamen yang <= id_turnamen
        const [turnamen] = await connection.execute(
            `SELECT id_turnamen FROM turnamen WHERE id_turnamen <= ? ORDER BY id_turnamen`,
            [id_turnamen]
        );
        const daftarTurnamen = turnamen.map((t) => t.id_turnamen);

        if (daftarTurnamen.length === 0) {
            return [];
        }

        // Query lengkap dengan join ke pemain, pertandingan, dan turnamen
        const [result] = await connection.execute(
          `SELECT 
              h.id_pemain,
              p1.nama_pemain,
              h.id_lawan,
              p2.nama_pemain AS nama_lawan,
              h.jumlah_menang,
              h.jumlah_kalah,
              t.nama_turnamen,
              t.tgl_turnamen
          FROM head_to_head h
          JOIN pemain p1 ON h.id_pemain = p1.id_pemain
          JOIN pemain p2 ON h.id_lawan = p2.id_pemain
          JOIN turnamen t ON t.id_turnamen = h.id_turnamen
          WHERE h.id_turnamen IN (${daftarTurnamen.map(() => '?').join(',')})
            AND h.id_pemain = ?
            AND h.id_lawan = ?
          ORDER BY h.id_turnamen`,
          [...daftarTurnamen, id_pemain, id_lawan]
      );

      const [pertandingan] = await connection.execute(
        `SELECT 
          pertandingan.babak,
          pertandingan.pool,
          pertandingan.skor_pemain,
          pertandingan.skor_lawan,
          pertandingan.poin,
          master_poin.keterangan_babak
          FROM
            pertandingan
            INNER JOIN master_poin ON (pertandingan.babak = master_poin.babak)
          WHERE
            id_turnamen IN (${daftarTurnamen.map(() => '?').join(',')})  
            AND id_pemain = ? 
            AND id_lawan = ?
            ORDER BY id_turnamen, id_turnamen`,
        [...daftarTurnamen, id_pemain, id_lawan]
      );
      
        return {
            'modul': modul,
            'success': true,
            'message': 'Data Berhasil Ditemukan.',
            'data': result.map((row) => ({
                id_pemain: row.id_pemain,
                nama_pemain: row.nama_pemain,
                id_lawan: row.id_lawan,
                nama_lawan: row.nama_lawan,
                jumlah_menang: parseInt(row.jumlah_menang),
                jumlah_kalah: parseInt(row.jumlah_kalah),
                nama_turnamen: row.nama_turnamen,
                tgl_turnamen: row.tgl_turnamen
            }             
            )),
            'pertandingan': pertandingan,
          }
     } catch (err) {
      return {
        'modul': modul,
        'success': false,
        'message': 'Terjadi Kesalahan: ${err}.',
        'data': {},
      }
    } finally {
        if (connection) await connection.end();
    }
}

/**
 * Fungsi untuk mencari id_pemain berdasarkan nama yang fleksibel
 * @param {string} inputNama - Nama yang diinput user (bisa tidak lengkap)
  */
async function getIDPlayer(param) {
  const modul='getIDPlayer';
  const connection = await getConnection();

  try {  
      // Pecah nama input menjadi kata-kata
      const keywords = param.replace(/\./g, '').trim().split(/\s+/);

      // Buat query WHERE dengan LIKE untuk tiap kata
      const likeConditions = keywords.map(() => `nama_pemain LIKE ?`).join(' AND ');
      const likeValues = keywords.map(word => `%${word}%`);

      const query = `SELECT id_pemain, nama_pemain FROM pemain WHERE ${likeConditions}`;

      //console.log(query, likeValues);

      const [result] = await connection.query(query, likeValues);
      const status = result? true: false;
      //console.log(result);

      return {
        'module': modul,
        'success': status,
        'message': 'ID Pemain Berhasil...',
        'data': result,
      }      
  } catch (error) {
    return {
      'module': modul,
      'success': false,
      'message': 'ID Pemain tidak ditemukan.',
      'data': {},
    }    
  } finally {
    if (connection) await connection.end();
  }
}

async function getPosisiTerbaik(idTurnamen, idPemain) {
  const modul = 'getPosisiTerbaik';
  const connection = await getConnection();

  try {
    const [posisi] = await connection.execute(
      `SELECT 
        pertandingan.id_turnamen,
        pertandingan.babak,
        pertandingan.pool,
        pertandingan.id_pemain,
        pertandingan.skor_pemain,
        pertandingan.id_lawan,
        pertandingan.skor_lawan,
        pertandingan.poin,
        pemain.nama_pemain,
        pemain1.nama_pemain AS nama_lawan,
        master_poin.keterangan_babak
      FROM
        pertandingan
        INNER JOIN pemain ON (pertandingan.id_pemain = pemain.id_pemain)
        INNER JOIN pemain pemain1 ON (pertandingan.id_lawan = pemain1.id_pemain)
        INNER JOIN master_poin ON (pertandingan.babak = master_poin.babak)
      WHERE
        pertandingan.id_turnamen = ? AND 
        pertandingan.id_pemain = ?
      ORDER BY
        pertandingan.id_pertandingan`,
      [idTurnamen, idPemain]
    );
    
    //console.log("Data Peringkat:", peringkat);

    if (posisi.length === 0) {
      console.log("Data pemain tidak ditemukan.");
      return;
    }

    let status = posisi?true:false;  

    return {
        'module': modul,
        'success': status,
        'message': 'Proses Posisi Pemain Berhasil.',
        'data': posisi,
    }
  } catch (error) {
    return {
      'module': modul,
      'success': false,
      'message': 'Proses Posisi Pemain Gagal.',
      'data': {},
  }
} finally {
    if (connection) await connection.end();
  }
}


module.exports = {
    insertData, 
    updateData, 
    deleteData,
    getDataRow,
    fetchDataWithConditions, 
    getQuery, 
    resetAutoincrement, 
    getPeringkat,
    findHeadToHead, 
    executeSQL, 
    getIDPlayer, 
    getPosisiTerbaik
}