import { existsSync } from 'fs';
import path from 'path';
import EmbeddedPostgres from 'embedded-postgres';
import pg from 'pg';

const root = process.cwd();
const pgDir = path.join(root, '.pgdata');

async function canConnect(url: string): Promise<boolean> {
  try {
    const client = new pg.Client({ connectionString: url });
    await client.connect();
    await client.end();
    return true;
  } catch {
    return false;
  }
}

export async function startDatabase() {
  const databaseUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@127.0.0.1:5432/lms_db';
  
  if (await canConnect(databaseUrl)) {
    console.log('Database already reachable at DATABASE_URL.');
    return;
  }

  console.log('Starting local PostgreSQL database...');
  try {
    const embedded = new EmbeddedPostgres({
      databaseDir: pgDir,
      user: 'postgres',
      password: 'postgres',
      port: 5432,
      persistent: true,
    });
    
    if (!existsSync(pgDir)) {
      console.log('Initializing database storage...');
      await embedded.initialise();
    }
    
    await embedded.start();
    console.log('Local PostgreSQL database started successfully.');
    
    // Handle clean shutdown on exit
    const stopDb = async () => {
      console.log('Stopping local PostgreSQL database...');
      try {
        await embedded.stop();
      } catch (e) {
        // ignore
      }
      process.exit(0);
    };

    process.on('SIGINT', stopDb);
    process.on('SIGTERM', stopDb);
  } catch (err) {
    console.error('Failed to start local database:', err);
  }
}
