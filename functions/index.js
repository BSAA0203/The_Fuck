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
            await page.goto(
                'https://news.naver.com/main/ranking/popularDay.nhn',
                {waitUntil: "domcontentloaded"}
            );
            const title = '오늘의 국내 뉴우스';
            const news = await page.$eval('#right_dailyList', (e) => e.textContent);
            console.log(news);

            const ID = "";
            const PW = "";
            await page.goto(
                'https://www.thecamp.or.kr/login/viewLogin.do',
                {waitUntil: "domcontentloaded"}
            );
            await page.evaluate((id, pw) => {
                document
                    .querySelector('#userId')
                    .value = id;
                document
                    .querySelector('#userPwd')
                    .value = pw;
                document
                    .querySelector('#emailLoginBtn')
                    .click();
            }, ID, PW);
            await page.waitForNavigation();
            console.log('login success');

            await page.goto(
                'https://www.thecamp.or.kr/eduUnitCafe/viewEduUnitCafeMain.do',
                {waitUntil: "domcontentloaded"}
            );
            await page.evaluate(() => {
                document
                    .querySelector(
                        '#divSlide1 > div.swiper-wrapper > div.swiper-slide.swiper-slide-active.swiper-' +
                        'slide-duplicate-next.swiper-slide-duplicate-prev > div > div.btn-wrap > a.btn-' +
                        'green'
                    )
                    .click();
            });
            await page.waitForNavigation();
            await page.evaluate(() => {
                document
                    .querySelector(
                        'body > div.container > div.container-wrap > div:nth-child(2) > div.btn-a-wrap.' +
                        'text-center.mt50 > button'
                    )
                    .click();
            });
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
            await page.evaluate(() => {
                document
                    .querySelector(
                        'body > div.container > div.container-wrap > section > div.btn-b-area > a:nth-c' +
                        'hild(3)'
                    )
                    .click();
            })
            await browser.close();
            console.log('success');
        } catch (error) {
            console.log('WTF : ', error);
        }
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
            const title = '오늘의 일본 뉴우스';
            const news = await page.evaluate(() => {
                return document
                    .querySelector(
                        "body > div > div > div > div > div > div:nth-child(2)"
                    )
                    .outerText;
            });
            console.log(news);

            const ID = "";
            const PW = "";
            await page.goto(
                'https://www.thecamp.or.kr/login/viewLogin.do',
                {waitUntil: "domcontentloaded"}
            );
            await page.evaluate((id, pw) => {
                document
                    .querySelector('#userId')
                    .value = id;
                document
                    .querySelector('#userPwd')
                    .value = pw;
                document
                    .querySelector('#emailLoginBtn')
                    .click();
            }, ID, PW);
            await page.waitForNavigation();
            console.log('login success');

            await page.goto(
                'https://www.thecamp.or.kr/eduUnitCafe/viewEduUnitCafeMain.do',
                {waitUntil: "domcontentloaded"}
            );
            await page.evaluate(() => {
                document
                    .querySelector(
                        '#divSlide1 > div.swiper-wrapper > div.swiper-slide.swiper-slide-active.swiper-' +
                        'slide-duplicate-next.swiper-slide-duplicate-prev > div > div.btn-wrap > a.btn-' +
                        'green'
                    )
                    .click();
            });
            await page.waitForNavigation();
            await page.evaluate(() => {
                document
                    .querySelector(
                        'body > div.container > div.container-wrap > div:nth-child(2) > div.btn-a-wrap.' +
                        'text-center.mt50 > button'
                    )
                    .click();
            });
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
            await page.evaluate(() => {
                document
                    .querySelector(
                        'body > div.container > div.container-wrap > section > div.btn-b-area > a:nth-c' +
                        'hild(3)'
                    )
                    .click();
            })
            await browser.close();
            console.log('success');
        } catch (error) {
            console.log('WTF : ', error);
        }
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
            await page.goto(
                'https://konsoler.com/g2/bbs/board.php?bo_table=consolenews&r=ok',
                {waitUntil: "domcontentloaded"}
            );
            const title = '오늘의 게임 뉴우스';
            const news = await page.$eval('#list_table', (e) => e.outerText);
            console.log(news);

            const ID = "";
            const PW = "";
            await page.goto(
                'https://www.thecamp.or.kr/login/viewLogin.do',
                {waitUntil: "domcontentloaded"}
            );
            await page.evaluate((id, pw) => {
                document
                    .querySelector('#userId')
                    .value = id;
                document
                    .querySelector('#userPwd')
                    .value = pw;
                document
                    .querySelector('#emailLoginBtn')
                    .click();
            }, ID, PW);
            await page.waitForNavigation();
            console.log('login success');

            await page.goto(
                'https://www.thecamp.or.kr/eduUnitCafe/viewEduUnitCafeMain.do',
                {waitUntil: "domcontentloaded"}
            );
            await page.evaluate(() => {
                document
                    .querySelector(
                        '#divSlide1 > div.swiper-wrapper > div.swiper-slide.swiper-slide-active.swiper-' +
                        'slide-duplicate-next.swiper-slide-duplicate-prev > div > div.btn-wrap > a.btn-' +
                        'green'
                    )
                    .click();
            });
            await page.waitForNavigation();
            await page.evaluate(() => {
                document
                    .querySelector(
                        'body > div.container > div.container-wrap > div:nth-child(2) > div.btn-a-wrap.' +
                        'text-center.mt50 > button'
                    )
                    .click();
            });
            await page.waitForNavigation();
            await page.waitForSelector('#cke_1_contents > iframe');
            console.log('\niframe3 is ready. Loading iframe content');
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
            await page.evaluate(() => {
                document
                    .querySelector(
                        'body > div.container > div.container-wrap > section > div.btn-b-area > a:nth-c' +
                        'hild(3)'
                    )
                    .click();
            })
            await browser.close();
            console.log('success');
        } catch (error) {
            console.log('WTF : ', error);
        }
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
