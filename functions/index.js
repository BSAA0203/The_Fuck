const functions = require('firebase-functions');
const puppeteer = require('puppeteer');

const op = {
    timeoutSeconds: 60,
    memory: '512MB'
} // puppeteer 사용에 필요한 functions 최소 옵션 값

exports.news = functions
    .runWith(op)
    .region('asia-northeast1')
    .https
    .onRequest(async (req, res) => {
        try {
            const browser = await puppeteer.launch({
                /* arg - firebase cli 작동 환경, headless - gui 작동 환경 설정 */
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
            /* 1~10, 11~20위 각 순위의 뉴스 헤드라인 DOM 개수를 합산하여 개수만큼 뉴스 헤드라인 내용을 크롤링 및 오브젝트에 저장 */
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

            /* 더 캠프의 본인 아이디와 패스워드 값을 입력해 더 캠프 로그인 시도 */
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
            /* 로그인 후 위문편지함 페이지 주소로 이동 */
            await page.goto(
                'https://www.thecamp.or.kr/eduUnitCafe/viewEduUnitCafeMain.do',
                {waitUntil: "domcontentloaded"}
            );
            /* 원하는 군인 선택과 편지 작성 버튼을 차례대로 클릭 */
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
            /* 편지 DOM의 iframe 요소 렌더링 후 편지 작성 수행 */
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
            /* 편지 전송 버튼 클릭 후 브라우저 종료 */
            await page.evaluate(() => {
                document
                    .querySelector(
                        'body > div.container > div.container-wrap > section > div.btn-b-area > a:nth-c' +
                        'hild(3)'
                    )
                    .click();
            });
            await page.waitForNavigation();
            await browser.close();
            console.log('success');
            res.sendStatus(200);
        } catch (error) {
            console.error('Error by : ', error);
            res.sendStatus(400);
        }
    });