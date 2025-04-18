// scripts/setup-radius.js
/**
 * Script untuk menginisialisasi konfigurasi RADIUS
 * Menjalankan: node scripts/setup-radius.js
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const radiusConfig = {
  host: process.env.RADIUS_HOST || 'localhost',
  authPort: process.env.RADIUS_AUTH_PORT || 1812,
  acctPort: process.env.RADIUS_ACCT_PORT || 1813,
  secret: process.env.RADIUS_SECRET || 'testing123',
};

const configDir = path.join(__dirname, '..', 'configs', 'radius');

async function setupRadius() {
  console.log('Menginisialisasi konfigurasi RADIUS...');
  
  // Pastikan direktori configs/radius ada
  if (!fs.existsSync(configDir)) {
    console.log(`Membuat direktori ${configDir}`);
    fs.mkdirSync(configDir, { recursive: true });
  }
  
  // Setup file clients.conf
  const clientsConfigPath = path.join(configDir, 'clients.conf');
  console.log(`Menulis konfigurasi clients.conf ke ${clientsConfigPath}`);
  
  const clientsConfig = `
# clients.conf - Konfigurasi klien RADIUS untuk Star Access
client localhost {
  ipaddr = 127.0.0.1
  secret = ${radiusConfig.secret}
  require_message_authenticator = no
  shortname = localhost
  nas_type = other
}

# Tambahkan router MikroTik di sini
client mikrotik {
  ipaddr = 0.0.0.0/0
  secret = ${radiusConfig.secret}
  require_message_authenticator = no
  shortname = mikrotik
  nas_type = mikrotik
}
`;
  
  fs.writeFileSync(clientsConfigPath, clientsConfig);
  
  // Setup file sql.conf
  const sqlConfigPath = path.join(configDir, 'sql.conf');
  console.log(`Menulis konfigurasi sql.conf ke ${sqlConfigPath}`);
  
  const sqlConfig = `
# sql.conf - Konfigurasi SQL untuk Star Access
sql {
  database = "postgresql"
  driver = "rlm_sql_${process.env.DB_TYPE || 'postgresql'}"
  
  postgresql {
    server = "${process.env.DB_HOST || 'localhost'}"
    port = ${process.env.DB_PORT || 5432}
    login = "${process.env.DB_USERNAME || 'postgres'}"
    password = "${process.env.DB_PASSWORD || 'password'}"
    radius_db = "${process.env.DB_DATABASE || 'star_access'}"
  }
  
  acct_table1 = "radacct"
  acct_table2 = "radacct"
  postauth_table = "radpostauth"
  authcheck_table = "radcheck"
  authreply_table = "radreply"
  groupcheck_table = "radgroupcheck"
  groupreply_table = "radgroupreply"
  usergroup_table = "radusergroup"
  
  read_groups = yes
  read_profiles = yes
  
  logfile = ${path.join(configDir, 'sql.log')}
  num_sql_socks = 5
  connect_failure_retry_delay = 60
  lifetime = 0
  max_queries = 0
}
`;
  
  fs.writeFileSync(sqlConfigPath, sqlConfig);
  
  // Setup file radiusd.conf template
  const radiusdConfigPath = path.join(configDir, 'radiusd.conf');
  console.log(`Menulis konfigurasi radiusd.conf ke ${radiusdConfigPath}`);
  
  const radiusdConfig = `
# radiusd.conf - Konfigurasi utama RADIUS untuk Star Access
prefix = /usr
exec_prefix = /usr
sysconfdir = /etc
localstatedir = /var
sbindir = \${exec_prefix}/sbin
logdir = /var/log/radius
raddbdir = /etc/raddb
radacctdir = \${logdir}/radacct
name = radiusd
confdir = \${raddbdir}

listen {
  type = auth
  ipaddr = *
  port = ${radiusConfig.authPort}
}

listen {
  type = acct
  ipaddr = *
  port = ${radiusConfig.acctPort}
}

modules {
  $INCLUDE \${confdir}/modules/
  $INCLUDE \${confdir}/sql.conf
}

instantiate {
}

authorize {
  preprocess
  chap
  mschap
  digest
  suffix
  eap
  files
  sql
  expiration
  logintime
  pap
}

authenticate {
  Auth-Type PAP {
    pap
  }
  Auth-Type CHAP {
    chap
  }
  Auth-Type MS-CHAP {
    mschap
  }
  eap
}

preacct {
  preprocess
  acct_unique
  suffix
  files
}

accounting {
  detail
  unix
  sql
  exec
  attr_filter.accounting_response
}

session {
}

post-auth {
  sql
  exec
  Post-Auth-Type REJECT {
    attr_filter.access_reject
    sql
    eap
  }
}

pre-proxy {
}

post-proxy {
  eap
}
`;
  
  fs.writeFileSync(radiusdConfigPath, radiusdConfig);
  
  console.log('Konfigurasi RADIUS berhasil diinisialisasi');
  
  // Coba periksa apakah freeradius terinstall
  try {
    const radiusVersion = execSync('radiusd -v').toString();
    console.log(`FreeRADIUS terdeteksi: ${radiusVersion.split('\n')[0]}`);
    console.log('Untuk menggunakan konfigurasi ini, salin file-file di atas ke /etc/raddb/');
  } catch (error) {
    console.log('FreeRADIUS tidak terdeteksi di sistem. Pastikan FreeRADIUS terinstal untuk menggunakan fitur RADIUS.');
  }
}

setupRadius();