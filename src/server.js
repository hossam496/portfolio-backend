import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;
const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('MONGODB_URI is required');
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is required');
  process.exit(1);
}

await connectDB(uri);

app.listen(PORT, () => {
  console.log(`Server on http://localhost:${PORT}`);
});
