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
    .onRequest(() => {
        const getData = async () => {
            try {
                const browser = await puppeteer.launch({
                    args: ['--no-sandbox', '--disable-setuid-sandbox']
                });
                const page = await browser.newPage();
                await page.goto('https://news.naver.com/main/ranking/popularDay.nhn');
                const title = '오늘의 뉴우스';
                const news = await page.evaluate(() => {
                    return document
                        .querySelector("#right_dailyList")
                        .textContent;
                });
                console.log(news);

                const ID = "smw0393@naver.com";
                const PW = "Apsj1860178*";
                await page.goto('https://www.thecamp.or.kr/login/viewLogin.do');
                await page.evaluate((id, pw) => {
                    document
                        .querySelector('#userId')
                        .value = id;
                    document
                        .querySelector('#userPwd')
                        .value = pw;
                }, ID, PW);
                await page.click('#emailLoginBtn');
                await page.waitForNavigation();

                await page.goto('https://www.thecamp.or.kr/eduUnitCafe/viewEduUnitCafeMain.do')
                await page.waitForSelector(
                    '#divSlide1 > div.swiper-wrapper > div.swiper-slide.swiper-slide-active.swiper-' +
                    'slide-duplicate-next.swiper-slide-duplicate-prev > div > div.btn-wrap > a.btn-' +
                    'green'
                );
                await page.click(
                    '#divSlide1 > div.swiper-wrapper > div.swiper-slide.swiper-slide-active.swiper-' +
                    'slide-duplicate-next.swiper-slide-duplicate-prev > div > div.btn-wrap > a.btn-' +
                    'green'
                );
                await page.waitForSelector(
                    'body > div.container > div.container-wrap > div:nth-child(2) > div.btn-a-wrap.' +
                    'text-center.mt50 > button'
                );
                await page.click(
                    'body > div.container > div.container-wrap > div:nth-child(2) > div.btn-a-wrap.' +
                    'text-center.mt50 > button'
                );

                await page.waitForSelector('#cke_1_contents > iframe');
                console.log('\niframe is ready. Loading iframe content');
                await page.evaluate((tt) => {
                    document
                        .querySelector('#sympathyLetterSubject')
                        .value = tt;
                }, title);
                const el = await page.$('#cke_1_contents > iframe');
                const frame = await el.contentFrame();
                await frame.evaluate((info) => {
                    document
                        .querySelector('body > p')
                        .innerText = info;
                }, news)
                await page.click(
                    'body > div.container > div.container-wrap > section > div.btn-b-area > a:nth-c' +
                    'hild(3)'
                );
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
    .schedule('0 12 * * *')
    .timeZone('Asia/Seoul')
    .onRun(async () => {
        try {
            return await axios.get(
                'https://asia-northeast1-the-fuck-a25fd.cloudfunctions.net/news'
            );
        } catch (error) {
            console.log(error);
        }
    });