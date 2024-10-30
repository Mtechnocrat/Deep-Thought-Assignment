const express = require ('express');
const app=express();

const eventsRouter = require('./routes/event.js');
const {connectToDB} = require('./db/connection.js');

app.use(express.json());
app.use('/api/v3/app' ,eventsRouter);

connectToDB()
  .then(() => {
    const PORT = 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
  });