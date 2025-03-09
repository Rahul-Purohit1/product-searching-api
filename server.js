import 'dotenv/config';
import app from './app.js';
import sequelize from './config/database.js';

const PORT = process.env.PORT || 3000;

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return false;
  }
};

// Start server
const startServer = async () => {
  const isConnected = await testConnection();
  
  if (isConnected) {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } else {
    console.error('Failed to start server due to database connection issues');
    process.exit(1);
  }
};

startServer();
