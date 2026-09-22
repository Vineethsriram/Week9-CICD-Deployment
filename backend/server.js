const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Hello from Backend container!'));
app.listen(3000, () => console.log('Backend running on port 3000'));
