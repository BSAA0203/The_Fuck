const functions = require('firebase-functions');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const axios = require('axios');

const op = {
    timeoutSeconds: 60,
    memory: '512MB'
}

exports.news = functions
    .runWith(op)
    .region('asia-northeast1')
    .https
    .onRequest(() => {
        const getData = async () => {
            try {
                const browser = await puppeteer.launch({
                    args: ['--no-sandbox', '--disable-setuid-sandbox']
                });
                const page = await browser.newPage();
                await page.goto('https://news.naver.com/main/ranking/popularDay.nhn');
                const news = await page.evaluate(() => {
                    return document
                        .querySelector("#right_dailyList")
                        .textContent
                        .replace(/\t|\s+$/g, '');
                });
                console.log(news);
                await browser.close();
                console.log('success');
            } catch (error) {
                console.log('wtf : ', error);
            }
        };
        getData();
        return null;
    })

exports.ticktock = functions
    .runWith(op)
    .region('asia-northeast1')
    .pubsub
    .schedule('0 0 * * *')
    .timeZone('Asia/Seoul')
    .onRun(async() => {
        try {
            return await axios.get(
                'https://asia-northeast1-the-fuck-a25fd.cloudfunctions.net/news'
            );
        } catch (error) {
            console.log(error);
        }
    });