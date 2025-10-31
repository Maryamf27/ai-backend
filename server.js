// require('dotenv').config()
// const app = require('./src/app')



// // app.listen(3000, () => {
// //     console.log('Server is running on http://localhost:3000')
// // })

// // ✅ Don't use app.listen() here for Vercel
// module.exports = app;


require('dotenv').config();
const app = require('./src/app');

// ✅ Only start a server if we're running locally
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ Server running locally at http://localhost:${PORT}`);
  });
}

// ✅ Always export the app for Vercel
module.exports = app;
