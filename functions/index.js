const functions = require('firebase-functions');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

exports.tick_tock = functions
    .region('asia-northeast1')
    .pubsub
    .schedule('0 0 * * *')
    .timeZone('Asia/Seoul')
    .onRun(() => {
    })