// scripts/setup-db.js
/**
 * Script untuk menginisialisasi database star_access
 * Menjalankan: node scripts/setup-db.js
 */

require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'star_access',
};

async function initDatabase() {
  console.log('Menginisialisasi database Star Access...');
  
  // Connect ke PostgreSQL
  const client = new Client({
    ...dbConfig,
    database: 'postgres', // Connect ke database default terlebih dahulu
  });
  
  try {
    await client.connect();
    console.log('Terhubung ke PostgreSQL server');
    
    // Cek apakah database star_access sudah ada
    const dbCheckResult = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [dbConfig.database]
    );
    
    if (dbCheckResult.rowCount === 0) {
      console.log(`Database ${dbConfig.database} belum ada, membuat database...`);
      await client.query(`CREATE DATABASE ${dbConfig.database}`);
      console.log(`Database ${dbConfig.database} berhasil dibuat`);
    } else {
      console.log(`Database ${dbConfig.database} sudah ada`);
    }
    
    await client.end();
    
    // Connect ke database yang sudah dibuat
    const dbClient = new Client(dbConfig);
    await dbClient.connect();
    console.log(`Terhubung ke database ${dbConfig.database}`);
    
    // Jalankan skrip inisialisasi
    const initSqlPath = path.join(__dirname, 'init-db.sql');
    console.log(`Menjalankan script inisialisasi dari ${initSqlPath}`);
    
    if (fs.existsSync(initSqlPath)) {
      const initSql = fs.readFileSync(initSqlPath, 'utf8');
      await dbClient.query(initSql);
      console.log('Skrip inisialisasi berhasil dijalankan');
    } else {
      console.log('File init-db.sql tidak ditemukan, melewati inisialisasi tabel');
    }
    
    // Buat user admin default jika belum ada
    const adminCheckResult = await dbClient.query(
      "SELECT 1 FROM users WHERE username = 'admin'"
    );
    
    if (adminCheckResult.rowCount === 0) {
      console.log('Membuat user admin default...');
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      await dbClient.query(`
        INSERT INTO users (
          username, password, full_name, email, role, is_active
        ) VALUES (
          'admin', $1, 'Administrator', 'admin@staraccess.com', 'admin', true
        )
      `, [hashedPassword]);
      console.log('User admin default berhasil dibuat');
    } else {
      console.log('User admin sudah ada');
    }
    
    await dbClient.end();
    console.log('Inisialisasi database selesai');
    
  } catch (error) {
    console.error('Error saat inisialisasi database:', error.message);
    process.exit(1);
  }
}

initDatabase();