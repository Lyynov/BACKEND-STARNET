# Requirements - Star Access ISP Management System

Dokumen ini berisi daftar lengkap semua dependensi dan software yang diperlukan untuk menjalankan sistem Star Access ISP Management.

## Software Prasyarat

### 1. Node.js dan NPM
- **Versi**: Node.js v18.x atau lebih baru
- **Instalasi**: 
  ```bash
  # Di Ubuntu/Debian
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt-get install -y nodejs
  
  # Di CentOS/RHEL
  curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
  sudo yum install -y nodejs
  
  # Di macOS (dengan Homebrew)
  brew install node@18
  
  # Di Windows
  # Download dari https://nodejs.org/
  ```

### 2. PostgreSQL
- **Versi**: PostgreSQL 14.x atau lebih baru
- **Instalasi**:
  ```bash
  # Di Ubuntu/Debian
  sudo apt-get update
  sudo apt-get install -y postgresql-14
  
  # Di CentOS/RHEL
  sudo dnf install -y https://download.postgresql.org/pub/repos/yum/reporpms/EL-8-x86_64/pgdg-redhat-repo-latest.noarch.rpm
  sudo dnf -qy module disable postgresql
  sudo dnf install -y postgresql14-server
  sudo /usr/pgsql-14/bin/postgresql-14-setup initdb
  sudo systemctl enable postgresql-14
  sudo systemctl start postgresql-14
  
  # Di macOS (dengan Homebrew)
  brew install postgresql@14
  brew services start postgresql@14
  
  # Di Windows
  # Download dari https://www.postgresql.org/download/windows/
  ```

### 3. Redis
- **Versi**: Redis 6.x atau lebih baru
- **Instalasi**:
  ```bash
  # Di Ubuntu/Debian
  sudo apt-get update
  sudo apt-get install -y redis-server
  
  # Di CentOS/RHEL
  sudo dnf install -y redis
  sudo systemctl enable redis
  sudo systemctl start redis
  
  # Di macOS (dengan Homebrew)
  brew install redis
  brew services start redis
  
  # Di Windows
  # Download dari https://github.com/microsoftarchive/redis/releases
  ```

### 4. FreeRADIUS (Opsional, jika menggunakan fitur RADIUS)
- **Versi**: FreeRADIUS 3.x
- **Instalasi**:
  ```bash
  # Di Ubuntu/Debian
  sudo apt-get update
  sudo apt-get install -y freeradius freeradius-utils freeradius-postgresql
  
  # Di CentOS/RHEL
  sudo dnf install -y freeradius freeradius-utils freeradius-postgresql
  
  # Di macOS (dengan Homebrew)
  brew install freeradius-server
  ```

### 5. Docker & Docker Compose (Opsional, untuk pengembangan)
- **Versi**: Docker Engine 20.x atau lebih baru, Docker Compose 2.x
- **Instalasi**:
  ```bash
  # Di Ubuntu/Debian
  sudo apt-get update
  sudo apt-get install -y docker.io docker-compose
  sudo systemctl enable docker
  sudo systemctl start docker
  sudo usermod -aG docker $USER
  
  # Di CentOS/RHEL
  sudo dnf config-manager --add-repo=https://download.docker.com/linux/centos/docker-ce.repo
  sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
  sudo systemctl enable docker
  sudo systemctl start docker
  sudo usermod -aG docker $USER
  
  # Di macOS dan Windows
  # Download Docker Desktop dari https://www.docker.com/products/docker-desktop
  ```

## Dependensi NPM

Berikut adalah dependensi NPM yang diperlukan untuk proyek ini:

### Core Dependencies
```bash
# NestJS Core
npm install --save @nestjs/common @nestjs/core @nestjs/platform-express reflect-metadata rxjs

# Configuration
npm install --save @nestjs/config

# TypeORM & PostgreSQL
npm install --save @nestjs/typeorm typeorm pg

# Throttling/Rate Limiting
npm install --save @nestjs/throttler

# Scheduling
npm install --save @nestjs/schedule

# Authentication
npm install --save @nestjs/passport @nestjs/jwt passport passport-jwt passport-local
npm install --save bcrypt
npm install --save-dev @types/passport-jwt @types/passport-local @types/bcrypt

# HTTP Requests untuk Payment Gateway
npm install --save @nestjs/axios axios

# Validasi & Transformasi
npm install --save class-validator class-transformer

# Swagger API Documentation
npm install --save @nestjs/swagger swagger-ui-express

# Middlewares
npm install --save helmet compression

# Utilities
npm install --save uuid
npm install --save-dev @types/uuid
```

### MikroTik Integration
```bash
npm install --save node-routeros
```

### Development Dependencies
```bash
# TypeScript
npm install --save-dev typescript ts-node ts-loader

# Linting & Formatting
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install --save-dev prettier eslint-config-prettier eslint-plugin-prettier

# Testing
npm install --save-dev @nestjs/testing jest ts-jest supertest
npm install --save-dev @types/jest @types/supertest

# Hot Reload
npm install --save-dev nodemon
```

## Instalasi Sekaligus

Anda dapat menginstal semua dependensi NPM sekaligus dengan perintah berikut:

```bash
# Instalasi dependensi utama
npm install --save @nestjs/common @nestjs/core @nestjs/platform-express reflect-metadata rxjs @nestjs/config @nestjs/typeorm typeorm pg @nestjs/throttler @nestjs/schedule @nestjs/passport @nestjs/jwt passport passport-jwt passport-local bcrypt @nestjs/axios axios class-validator class-transformer @nestjs/swagger swagger-ui-express helmet compression uuid node-routeros

# Instalasi dependensi development
npm install --save-dev typescript ts-node ts-loader eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier eslint-config-prettier eslint-plugin-prettier @nestjs/testing jest ts-jest supertest @types/jest @types/supertest @types/passport-jwt @types/passport-local @types/bcrypt @types/uuid nodemon
```

## Konfigurasi

Setelah instalasi semua dependensi, pastikan untuk:

1. Menyalin `.env.example` ke `.env` dan melakukan konfigurasi yang sesuai:
   ```bash
   cp .env.example .env
   nano .env  # Edit sesuai kebutuhan
   ```

2. Menjalankan skrip setup untuk database dan RADIUS:
   ```bash
   node scripts/setup-db.js
   node scripts/setup-radius.js
   ```

3. Membangun aplikasi:
   ```bash
   npm run build
   ```

4. Menjalankan migrasi database (jika ada):
   ```bash
   npm run migration:run
   ```

## Menjalankan Aplikasi

### Pengembangan
```bash
# Dengan hot reload
npm run start:dev

# Tanpa hot reload
npm run start
```

### Produksi
```bash
# Build
npm run build

# Start
npm run start:prod
```

### Menggunakan Docker
```bash
docker-compose up -d
```

## Verifikasi Instalasi

Setelah menjalankan aplikasi, verifikasi bahwa instalasi berhasil dengan mengakses:

- API: http://localhost:3000/api
- Swagger Documentation: http://localhost:3000/api/docs
- Health Check: http://localhost:3000/api/health