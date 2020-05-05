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
            const browser = await puppeteer.launch({
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            const page = await browser.newPage();
            await page.setDefaultNavigationTimeout(0);
            await page.goto('https://news.naver.com/main/ranking/popularDay.nhn');
            await page.waitForSelector('#right_dailyList');
            const title = '오늘의 국내 뉴우스';
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
            await page.waitForNavigation();
            await page.waitForSelector(
                'body > div.container > div.container-wrap > div:nth-child(2) > div.btn-a-wrap.' +
                'text-center.mt50 > button'
            );
            await page.click(
                'body > div.container > div.container-wrap > div:nth-child(2) > div.btn-a-wrap.' +
                'text-center.mt50 > button'
            );
            await page.waitForNavigation();
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
            }, news);
            await page.click(
                'body > div.container > div.container-wrap > section > div.btn-b-area > a:nth-c' +
                'hild(3)'
            );
            await browser.close();
            console.log('success');
        } catch (error) {
            console.log('wtf : ', error);
        };
        return null;
    });

exports.jp_news = functions
    .runWith(op)
    .region('asia-northeast1')
    .https
    .onRequest(async () => {
        try {
            const browser = await puppeteer.launch({
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            const page = await browser.newPage();
            await page.setDefaultNavigationTimeout(0);
            await page.goto('https://www3.nhk.or.jp/nhkworld/ko/news/list/');
            await page.waitForSelector(
                'body > div > div > div > div > div > div:nth-child(2)'
            );
            const jp_title = '오늘의 일본 뉴우스';
            const jp_news = await page.evaluate(() => {
                return document
                    .querySelector(
                        "body > div > div > div > div > div > div:nth-child(2)"
                    )
                    .outerText;
            });
            console.log(jp_news);

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
            await page.waitForNavigation();
            await page.waitForSelector(
                'body > div.container > div.container-wrap > div:nth-child(2) > div.btn-a-wrap.' +
                'text-center.mt50 > button'
            );
            await page.click(
                'body > div.container > div.container-wrap > div:nth-child(2) > div.btn-a-wrap.' +
                'text-center.mt50 > button'
            );
            await page.waitForNavigation();
            await page.waitForSelector('#cke_1_contents > iframe');
            console.log('\niframe2 is ready. Loading iframe content');
            await page.evaluate((tt) => {
                document
                    .querySelector('#sympathyLetterSubject')
                    .value = tt;
            }, jp_title);
            const el = await page.$('#cke_1_contents > iframe');
            const frame = await el.contentFrame();
            await frame.evaluate((info) => {
                document
                    .querySelector('body > p')
                    .innerText = info;
            }, jp_news);
            await page.click(
                'body > div.container > div.container-wrap > section > div.btn-b-area > a:nth-c' +
                'hild(3)'
            );
            await browser.close();
            console.log('success');
        } catch (error) {
            console.log('wtf : ', error);
        };
        return null;
    });

exports.game_news = functions
    .runWith(op)
    .region('asia-northeast1')
    .https
    .onRequest(async () => {
        try {
            const browser = await puppeteer.launch({
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            const page = await browser.newPage();
            await page.setDefaultNavigationTimeout(0);
            await page.goto('https://www.gamemeca.com/news.php');
            await page.waitForSelector(
                '#content > div.news-list > div.content-right > div > div.rank_wrap > div.rank_' +
                'list > ul:nth-child(1)'
            );
            const game_title = '오늘의 게임 뉴우스';
            const game_news = await page.evaluate(() => {
                return document
                    .querySelector(
                        "#content > div.news-list > div.content-right > div > div.rank_wrap > div.rank_" +
                        "list"
                    )
                    .outerText;
            });
            console.log(game_news.replace(/\t/g, ""));

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
            await page.waitForNavigation();
            await page.waitForSelector(
                'body > div.container > div.container-wrap > div:nth-child(2) > div.btn-a-wrap.' +
                'text-center.mt50 > button'
            );
            await page.click(
                'body > div.container > div.container-wrap > div:nth-child(2) > div.btn-a-wrap.' +
                'text-center.mt50 > button'
            );
            await page.waitForNavigation();
            await page.waitForSelector('#cke_1_contents > iframe');
            console.log('\niframe3 is ready. Loading iframe content');
            await page.evaluate((tt) => {
                document
                    .querySelector('#sympathyLetterSubject')
                    .value = tt;
            }, game_title);
            const el = await page.$('#cke_1_contents > iframe');
            const frame = await el.contentFrame();
            await frame.evaluate((info) => {
                document
                    .querySelector('body > p')
                    .innerText = info;
            }, game_news);
            await page.click(
                'body > div.container > div.container-wrap > section > div.btn-b-area > a:nth-c' +
                'hild(3)'
            );
            await browser.close();
            console.log('success');
        } catch (error) {
            console.log('wtf : ', error);
        };
        return null;
    });

exports.ticktock = functions
    .region('asia-northeast1')
    .pubsub
    .schedule('0 6 * * *')
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

exports.ticktock2 = functions
    .region('asia-northeast1')
    .pubsub
    .schedule('10 6 * * *')
    .timeZone('Asia/Seoul')
    .onRun(async () => {
        try {
            return await axios.get(
                'https://asia-northeast1-the-fuck-a25fd.cloudfunctions.net/jp_news'
            );
        } catch (error) {
            console.log(error);
        }
    });

exports.ticktock3 = functions
    .region('asia-northeast1')
    .pubsub
    .schedule('20 6 * * *')
    .timeZone('Asia/Seoul')
    .onRun(async () => {
        try {
            return await axios.get(
                'https://asia-northeast1-the-fuck-a25fd.cloudfunctions.net/game_news'
            );
        } catch (error) {
            console.log(error);
        }
    });