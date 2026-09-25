const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Hello from Backend container! v2'));
app.listen(3000, () => console.log('Backend running on port 3000'));
