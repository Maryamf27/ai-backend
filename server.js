require('dotenv').config();
import app from './src/app';

// ✅ Only start a server if we're running locally
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ Server running locally at http://localhost:${PORT}`);
  });
}

// ✅ Always export the app for Vercel
export default app;
