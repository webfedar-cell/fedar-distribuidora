const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const standaloneDir = path.join(rootDir, '.next', 'standalone');
const zipFile = path.join(rootDir, 'fedar-cpanel-deploy.zip');

console.log('--- Preparando paquete para cPanel ---');

// 1. Copiar .next/static a .next/standalone/.next/static
const staticSrc = path.join(rootDir, '.next', 'static');
const staticDest = path.join(standaloneDir, '.next', 'static');
if (fs.existsSync(staticSrc)) {
  fs.cpSync(staticSrc, staticDest, { recursive: true, force: true });
  console.log('✓ Archivos estáticos copiados (.next/static)');
}

// 2. Copiar public a .next/standalone/public
const publicSrc = path.join(rootDir, 'public');
const publicDest = path.join(standaloneDir, 'public');
if (fs.existsSync(publicSrc)) {
  // Asegurarse de que no haya duplicación interna
  if (fs.existsSync(path.join(publicDest, 'public'))) {
    fs.rmSync(path.join(publicDest, 'public'), { recursive: true, force: true });
  }
  fs.cpSync(publicSrc, publicDest, { recursive: true, force: true });
  if (fs.existsSync(path.join(publicDest, 'public'))) {
    fs.rmSync(path.join(publicDest, 'public'), { recursive: true, force: true });
  }
  console.log('✓ Carpeta public copiada');
}

// 3. Copiar dependencias de base de datos y mail
const packages = [
  'mysql2',
  'nodemailer',
  'denque',
  'generate-function',
  'iconv-lite',
  'safer-buffer',
  'long',
  'lru-cache',
  'named-placeholders',
  'seq-queue',
  'sqlstring'
];

const srcModules = path.join(rootDir, 'node_modules');
const targetModules = path.join(standaloneDir, 'node_modules');

for (const pkg of packages) {
  const pSrc = path.join(srcModules, pkg);
  const pDest = path.join(targetModules, pkg);
  if (fs.existsSync(pSrc)) {
    fs.cpSync(pSrc, pDest, { recursive: true, force: true });
  }
}
console.log('✓ Dependencias (mysql2, nodemailer) agregadas al standalone');

// 4. Escribir server.js optimizado para Phusion Passenger / LiteSpeed / cPanel
const passengerServerCode = `const http = require('http');
const path = require('path');
const { loadEnvConfig } = require('@next/env');

process.env.NODE_ENV = 'production';
process.chdir(__dirname);
loadEnvConfig(__dirname);

const NextServer = require('next/dist/server/next-server').default;
const nextConfig = require('./.next/required-server-files.json').config;

const nextServer = new NextServer({
  hostname: 'localhost',
  port: parseInt(process.env.PORT, 10) || 3000,
  dir: __dirname,
  dev: false,
  customServer: false,
  conf: nextConfig
});

const handler = nextServer.getRequestHandler();

const server = http.createServer(async (req, res) => {
  try {
    await handler(req, res);
  } catch (err) {
    console.error('Request error:', err);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
});

// En CloudLinux cPanel / LiteSpeed / Phusion Passenger:
// Passenger asigna process.env.PORT (puede ser un puerto numérico o socket unix/pipe)
const port = process.env.PORT || 3000;
server.listen(port, (err) => {
  if (err) {
    console.error('Server listen error:', err);
    process.exit(1);
  }
  console.log(\`> Servidor FEDAR Next.js listo en \${port}\`);
});
`;

fs.writeFileSync(path.join(standaloneDir, 'server.js'), passengerServerCode, 'utf8');
console.log('✓ server.js optimizado para cPanel Passenger generado');

// 5. Crear archivo ZIP
if (fs.existsSync(zipFile)) {
  fs.unlinkSync(zipFile);
}

console.log('Empaquetando en fedar-cpanel-deploy.zip...');
try {
  execSync(`tar -a -cf "${zipFile}" *`, { cwd: standaloneDir, stdio: 'inherit' });
  const stats = fs.statSync(zipFile);
  const mb = (stats.size / (1024 * 1024)).toFixed(2);
  console.log(`✓ Archivo ZIP generado exitosamente: fedar-cpanel-deploy.zip (${mb} MB)`);
} catch (err) {
  console.error('Error al empaquetar con tar:', err.message);
}
