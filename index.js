// index.js
const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
let latestDonation = null;

const URL = 'https://sociabuzz.com/pro/tribe/alert1/v3/4610430629?colorName=%2300c5a3&alphaName=1&colorNote=%23f3f6f4&alphaNote=1&colorFrom=%23eeeeee&alphaFrom=1&gifActive=1&maxDuration=12&font=Open%2BSans%3A800';

async function checkDonation() {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    await page.goto(URL, { waitUntil: 'networkidle2' });

    const data = await page.evaluate(() => {
        const amount = document.getElementById("amount")?.textContent?.trim();
        const fullname = document.getElementById("fullname")?.textContent?.trim();
        const note = document.getElementById("note")?.textContent?.trim();
        return { from: fullname, amount, note };
    });

    await browser.close();

    if (data.from && data.amount) {
        latestDonation = data;
        console.log("💸 Donasi terbaru:", data);
    }
}

// cek setiap 10 detik
setInterval(checkDonation, 10000);

app.get('/api/latest', (req, res) => {
    if (latestDonation) {
        res.json(latestDonation);
    } else {
        res.status(204).send(); // no content yet
    }
});

app.listen(3000, () => {
    console.log('🚀 Server berjalan di http://localhost:3000');
});
