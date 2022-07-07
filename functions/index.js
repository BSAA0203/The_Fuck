const functions = require('firebase-functions');
const puppeteer = require('puppeteer');

const op = {
    timeoutSeconds: 60,
    memory: '512MB'
} // puppeteer 사용에 필요한 functions 옵션 값 지정.

exports.news = functions // functions 함수 이름
    .runWith(op) // 옵션 설정
    .region('asia-northeast1')
    .https
    .onRequest(async (req, res) => {
        try {
            const browser = await puppeteer.launch({
                args: ['--no-sandbox', '--disable-setuid-sandbox']
                // headless: false
            }); // firebase cli 환경에 puppeteer를 작동하기 위한 조건 설정의 args (args를 주석처리 하고, headless 주석처리 해지 시 gui 환경의 puppeteer 사용 설정)
            const page = await browser.newPage();
            await page.setDefaultNavigationTimeout(0);
            await page.goto(
                'https://media.naver.com/press/009/ranking?type=popular',
                {waitUntil: "domcontentloaded"}
            ); // 뉴스 페이지 주소로 이동
            const title = '오늘의 뉴우스'; // 편지 제목 변수처리
            const object = new Object();
            /* 1~20위 까지의 뉴스 헤드라인 DOM 개수 카운트*/
            const length = await page.$$eval(
                '#ct > div.press_ranking_home > div:nth-child(3) > ul > li',
                (data) => data.length
            ) + await page.$$eval(
                '#ct > div.press_ranking_home > div:nth-child(4) > ul > li',
                (data) => data.length
            );
            console.log(length);
            /* DOM 카운트 개수 만큼 반복하여 오브젝트 변수에 뉴스 헤드라인 내용 크롤링 및 저장 */
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

            /* 더 캠프의 본인 아이디와 패스워드 값 변수 처리 및 더 캠프 페이지 주소로 이동 */
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
            /* 더 캠프 로그인 시도 */
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
            await page.waitForSelector('#cke_1_contents > iframe'); // 편지 DOM인 iframe 요소 렌더링 후 작업 실행
            console.log('\niframe is ready. Loading iframe content');
            await page.evaluate((tt) => {
                document
                    .querySelector('#sympathyLetterSubject')
                    .value = tt;
            }, title); // 편지 제목 작성
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
            }, object); // 크롤링 한 오브젝트 변수를 편지 본문 내용으로 작성
            await page.evaluate(() => {
                document
                    .querySelector(
                        'body > div.container > div.container-wrap > section > div.btn-b-area > a:nth-c' +
                        'hild(3)'
                    )
                    .click();
            }); // 편지 전송 버튼 클릭
            await page.waitForNavigation();
            await browser.close(); // 브라우저 종료
            console.log('success');
            res.sendStatus(200); // 성공 상태 코드 전송
        } catch (error) {
            console.error('Error by : ', error);
            res.sendStatus(400); // 실패 상태 코드 전송
        }
    });