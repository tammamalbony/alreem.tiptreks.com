// Importing necessary modules
import express from 'express';          // or const express = require('express');
import userRoutes from './routes/userRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// express: web framework for Node.js
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());


// Routes
app.use('/users', userRoutes);
// Health-check route
app.get('/', (req, res) => {
  res.send('🟢 Server is up and running!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});


//error handling middleware
// 404 for anything not matched above
app.use(notFound);

// catch-all error handler
app.use(errorHandler);
export default app;