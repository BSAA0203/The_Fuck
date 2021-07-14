const functions = require('firebase-functions');
const puppeteer = require('puppeteer');
const axios = require('axios');

const op = {
    timeoutSeconds: 60,
    memory: '512MB'
}

exports.news = functions
    .runWith(op)
    .region('asia-northeast1')
    .https
    .onRequest(async () => {
        try {
            const name = ''
            const birth = [];
            const browser = await puppeteer.launch({
                //headless: false
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            const page = await browser.newPage();
            await page.setDefaultNavigationTimeout(0);
            await page.goto(
                'https://www.airforce.mil.kr/user/indexSub.action?codyMenuSeq=156893223&siteId=last2&menuUIType=sub',
                { waitUntil: "domcontentloaded" }
            );
            await page.evaluate((name, birth) => {
                document
                    .querySelector('#searchName')
                    .value = name;
                document
                    .querySelector('#birthYear')
                    .value = birth[0];
                document
                    .querySelector('#birthMonth')
                    .value = birth[1];
                document
                    .querySelector('#birthDay')
                    .value = birth[2];
                console.log(name, birth);

            }, name, birth);
            await page.click('#btnNext');
            await browser.close();
            console.log('success');
        } catch (error) {
            console.log('WTF : ', error);
        }
    });