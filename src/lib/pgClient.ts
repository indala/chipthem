import { Pool } from 'pg';

console.log("--- DB Connection Debug ---");
console.log("HOST:", process.env.POSTGRES_HOST);
console.log("PORT:", process.env.POSTGRES_PORT);
console.log("USER:", process.env.POSTGRES_USER);
console.log("password",process.env.POSTGRES_PASSWORD)
console.log("-------------------------");

const pool = new Pool({
  host: process.env.POSTGRES_HOST,      // e.g., 'yourdomain.com' or server IP
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB,    // e.g., 'chipt2f5_chipthem'
  user: process.env.POSTGRES_USER,      // e.g., 'chipt2f5_username'
  password: process.env.POSTGRES_PASSWORD,
  max: 20,  // Connection pool size
});

// These ONLY fire during ACTUAL connections
pool.on('connect', () => console.log('✅ New connection created'));
pool.on('acquire', () => console.log('🔄 Connection borrowed'));
pool.on('remove', () => console.log('🗑️ Connection closed'));
pool.on('error', (err) => console.error('❌ Pool error:', err));


export default pool;

