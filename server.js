const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let latestDonation = null;

app.post('/webhook', (req, res) => {
    latestDonation = req.body;
    console.log('💸 Donasi:', latestDonation);
    res.sendStatus(200);
});

app.get('/donation', (req, res) => {
    res.json(latestDonation);
});

app.get('/', (req, res) => {
    res.send("🔥 Webhook jalan");
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
