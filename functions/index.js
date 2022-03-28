const functions = require('firebase-functions');
const puppeteer = require('puppeteer');

const op = {
    timeoutSeconds: 60,
    memory: '512MB'
}

exports.news = functions
    .runWith(op)
    .region('asia-northeast1')
    .https
    .onRequest(async (req, res) => {
        try {
            const browser = await puppeteer.launch({
                args: ['--no-sandbox', '--disable-setuid-sandbox']
                // headless: false
            });
            const page = await browser.newPage();
            await page.setDefaultNavigationTimeout(0);
            await page.goto(
                'https://media.naver.com/press/009/ranking?type=popular',
                {waitUntil: "domcontentloaded"}
            );
            const title = '오늘의 뉴우스';
            const object = new Object();
            const length = await page.$$eval(
                '#ct > div.press_ranking_home > div:nth-child(3) > ul > li',
                (data) => data.length
            ) + await page.$$eval(
                '#ct > div.press_ranking_home > div:nth-child(4) > ul > li',
                (data) => data.length
            );
            console.log(length);
            for (let index = 1; index <= length; index++) {
                if (index <= 10) {
                    const itemTitle = await page.$eval(
                        `#ct > div.press_ranking_home > div:nth-child(3) > ul > li:nth-child(${index}) > a > div.list_content > strong`,
                        (e) => e.textContent
                    );
                    // console.log(itemIndex+'.'+itemTitle);
                    object[index] = itemTitle;
                } else {
                    const itemTitle = await page.$eval(
                        `#ct > div.press_ranking_home > div:nth-child(4) > ul > li:nth-child(${index - 10}) > a > div.list_content > strong`,
                        (e) => e.textContent
                    );
                    // console.log(itemIndex+'.'+itemTitle);
                    object[index] = itemTitle;
                }
            }
            console.log(object);

            const ID = functions
                .config()
                .service
                .id;
            const PW = functions
                .config()
                .service
                .pw;
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
            await frame.evaluate((data) => {
                document
                    .querySelector('body > p')
                    .innerText = JSON
                    .stringify(data)
                    .replace(/",/g, '\n')
                    .replace(/\\/g, '')
                    .replace(/{/g, '')
                    .replace(/}/g, '');
            }, object);
            await page.evaluate(() => {
                document
                    .querySelector(
                        'body > div.container > div.container-wrap > section > div.btn-b-area > a:nth-c' +
                        'hild(3)'
                    )
                    .click();
            });
            await browser.close();
            console.log('success');
        } catch (error) {
            console.log('Error by : ', error);
        }
        res
            .status(200)
            .send();
    });