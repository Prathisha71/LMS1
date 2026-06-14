import { existsSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { spawn, execSync } from 'child_process';
import EmbeddedPostgres from 'embedded-postgres';

const root = process.cwd();
const envPath = path.join(root, '.env');
const pgDir = path.join(root, '.pgdata');

const defaultEnv = `DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/lms_db"
PORT=3000
JWT_SECRET="eduverse-dev-secret-change-in-production"
VITE_API_URL="http://localhost:3000/api"
`;

function pgCtlPath() {
  return path.join(
    root,
    'node_modules',
    '@embedded-postgres',
    'windows-x64',
    'native',
    'bin',
    'pg_ctl.exe'
  );
}

async function canConnect(url: string): Promise<boolean> {
  try {
    const { default: pg } = await import('pg');
    const client = new pg.Client({ connectionString: url });
    await client.connect();
    await client.end();
    return true;
  } catch {
    return false;
  }
}

function startDetachedPostgres() {
  const pgCtl = pgCtlPath();
  if (!existsSync(pgCtl)) {
    throw new Error('pg_ctl not found. Run npm install first.');
  }

  spawn(pgCtl, ['-D', pgDir, '-l', path.join(pgDir, 'server.log'), 'start'], {
    detached: true,
    stdio: 'ignore',
  }).unref();
}

async function ensureDatabase(url: string) {
  const { default: pg } = await import('pg');
  const adminUrl = url.replace('/lms_db', '/postgres');
  const client = new pg.Client({ connectionString: adminUrl });
  await client.connect();
  const dbCheck = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', ['lms_db']);
  if (dbCheck.rowCount === 0) {
    await client.query('CREATE DATABASE lms_db');
    console.log('Created database lms_db');
  }
  await client.end();
}

async function ensurePostgresRunning(databaseUrl: string) {
  if (await canConnect(databaseUrl)) {
    console.log('Database already reachable at DATABASE_URL');
    return;
  }

  if (!existsSync(pgDir)) {
    console.log('Initializing embedded PostgreSQL...');
    const embedded = new EmbeddedPostgres({
      databaseDir: pgDir,
      user: 'postgres',
      password: 'postgres',
      port: 5432,
      persistent: true,
    });
    await embedded.initialise();
    await embedded.start();
    await embedded.stop();
  }

  console.log('Starting embedded PostgreSQL in background...');
  startDetachedPostgres();

  for (let attempt = 0; attempt < 90; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (await canConnect(databaseUrl.replace('/lms_db', '/postgres'))) {
      break;
    }
    if (attempt === 89) {
      throw new Error('Timed out waiting for PostgreSQL to start after 90 seconds');
    }
  }

  await ensureDatabase(databaseUrl);
  console.log('Embedded PostgreSQL is running on port 5432');
}

async function main() {
  if (!existsSync(envPath)) {
    writeFileSync(envPath, defaultEnv, 'utf8');
    console.log('Created .env file');
  }

  const envContent = readFileSync(envPath, 'utf8');
  const match = envContent.match(/DATABASE_URL="([^"]+)"/);
  const databaseUrl = match?.[1] ?? 'postgresql://postgres:postgres@127.0.0.1:5432/lms_db';

  await ensurePostgresRunning(databaseUrl);

  console.log('Applying database schema...');
  execSync('npx prisma db push', { stdio: 'inherit', cwd: root });

  console.log('Seeding database...');
  execSync('npx prisma db seed', { stdio: 'inherit', cwd: root });

  console.log('Database setup complete.');
}

main().catch((error) => {
  console.error('Database setup failed:', error);
  process.exit(1);
});
