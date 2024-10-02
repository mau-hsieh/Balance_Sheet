// 載入 DiveLinker 並設置 DIVE linker
const diveLinker_map = new DiveLinker("map");
const diveLinker_toss = new DiveLinker("toss");
const diveLinker_event = new DiveLinker("event");

//載入完成
window.onload = function() {
    diveLinker_map.enableBlock(false);
    diveLinker_map.start();
    diveLinker_toss.enableBlock(false);
    diveLinker_toss.start();
    diveLinker_event.enableBlock(false);
    diveLinker_event.start();
    checkDiveLinker();
}
let userName = localStorage.getItem('userName');
console.log(userName); // 輸出姓名
let age, cashh, everymoney; // 宣告年紀、現金、月現金流

// 確保 diveLinker 初始化
function checkDiveLinker() {
    const intervalId_map = setInterval(function() {
        if (diveLinker_map.getLoadingStatus() === true) {
            clearInterval(intervalId_map); // 停止檢查 checkDiveLinker
            displayInitialSettings();
        }
    }, 100); // 每 100 毫秒檢查一次

    const intervalId_toss = setInterval(function() {
        if (diveLinker_toss.getLoadingStatus() === true) {
            clearInterval(intervalId_toss); // 停止檢查 checkDiveLinker
            checkEnter(); // 確保在初始化後開始檢查按鈕
        }
    }, 100); // 每 100 毫秒檢查一次

    const intervalId_event = setInterval(function() {
        if (diveLinker_event.getLoadingStatus() === true) {
            clearInterval(intervalId_event); // 停止檢查 checkDiveLinker
        }
    }, 100); // 每 100 毫秒檢查一次


    // 讀取年紀資料（路徑：姓名、使用者資料、個人資料、年齡）
    firebase.database().ref(`users/${userName}/使用者資料/個人資料/年齡`).once('value')
        .then((snapshot) => {
            age = parseInt(snapshot.val(), 10); // 將字串轉換成整數
            console.log('年齡:', age);
        })
        .catch((error) => {
            console.error('讀取年齡失敗:', error);
        });

    // 讀取月現金流資料（路徑：姓名、使用者資料、收入狀況、薪水）
    firebase.database().ref(`users/${userName}/使用者資料/收入狀況/薪水`).once('value')
        .then((snapshot) => {
            everymoney = parseFloat(snapshot.val()); // 將字串轉換成浮點數
            console.log('月現金流:', everymoney);
        })
        .catch((error) => {
            console.error('讀取月現金流失敗:', error);
        });

    // 讀取現金資料（路徑：姓名、使用者資料、資產負債表/活存）
    firebase.database().ref(`users/${userName}/使用者資料/資產負債表/活存`).once('value')
        .then((snapshot) => {
            cashh = parseFloat(snapshot.val()); // 將字串轉換成浮點數
            console.log('現金:', cashh);
        })
        .catch((error) => {
            console.error('讀取現金失敗:', error);
        });
}
//延遲秒數
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
//生成指定範圍內的隨機整數
function getRandomInt(min, max) {
    min = Math.ceil(min); //@param {number} min - 最小值（包含）
    max = Math.floor(max); //@param {number} max - 最大值（包含）
    return Math.floor(Math.random() * (max - min + 1)) + min; //@returns {number} 隨機生成的整數
}


//系統參數
let remainder1 = 0;
let toss = 0;
let totalToss = 0;
let eventWindowVisible = false; // 添加標誌變數
let isAdversityActive = false; // 控制是否在逆境中

//遊戲基本設定
let energy = 60; // 體力
let happy = 60; // 幸福

// mau 設定
let attrValue_市價 = 0;

//遊戲設定傳輸
function displayInitialSettings() {
    diveLinker_map.setInput("9e8935b92ce3461180c975134f0757b6", age); 
    diveLinker_map.setInput("e34e18484faf41339941aa82ad8ed291", energy); 
    diveLinker_map.setInput("2fcde56e89494036bd9c2c6d642be7ed", happy); 
    diveLinker_map.setInput("99db93a56ca14dac91cd27dceac949ad", cashh); 
    diveLinker_map.setInput("c3013d5b2c4d481fbef0029880319540", everymoney); 
}

//骰子dive
//(1) 判斷骰子是否按下，按下=1 沒按=0
function checkEnter() {
    const intervalEnter = setInterval(function () {
        let press = diveLinker_toss.getAttr("f4a1c3b360d740de94921e644f2174eb");
        if (press === 1) {
            tossrun();
            console.log("press=", press);
        }
    }, 100); // 每 100 毫秒檢查一次
}
//(2) 骰骰子
async function tossrun() {
    toss = Math.floor(Math.random() * 6) + 1; // 生成 1 到 6 之間的隨機數
    console.log("toss=", toss);

    // 計算總步數
    // 檢查是否處於逆境
    // 只有當不在逆境中時才計算 totaltoss
    let Adversitynum = diveLinker_map.getAttr("30800a030717494085d10d76a10a9501");  
    if (Adversitynum === "0"|| Adversitynum === 0){
        totalToss += toss; // 計算總 toss 值
        console.log(`totaltoss = ${totalToss}`);
    }
    diveLinker_toss.setInput("9668ae8baea947fc953076ff0e3a2200", toss); // 骰子-數字參數
    diveLinker_map.setInput("f94209797bc64919a8440fcd9bd36fb7", toss); // 地圖-數字參數
    diveLinker_toss.setInput("f4a1c3b360d740de94921e644f2174eb", 0); // 重置按鈕
    diveLinker_map.setInput("a650499304a2403a8dbc407e7e836bcf", totalToss); // 目標格子位置
    await delay(2000); // 2秒延遲
    tossstop();
}
//(3) 當骰子停止
function tossstop(){
    let stop = diveLinker_toss.getAttr("9c82a675e39b48a9a6618d0bb3de840a");
    if (stop === 1){
        diveLinker_map.setInput("4abacbac66eb49ba8bba522cf8773dde", 1); // 地圖-骰子是否停止
        move();
    }
}
//(4) 人物移動
function move() {
        const intervalMove = setInterval(function() {
            let placestop = diveLinker_map.getAttr("540b19bcf7e441a1a57d40ea029699d9");
            if (placestop === "1") {
                console.log("yes stop");
                clearInterval(intervalMove); // 停止檢查
                eventAppear();
                // 重置 placestop 的值以防止反覆輪播
                diveLinker_map.setInput("540b19bcf7e441a1a57d40ea029699d9", 0);
            }
        }, 100); // 每 100 毫秒檢查一次
    }

let lastPosition = 0; // 假設這是上次的位置 (餘數)
//(5) 餘數判斷
function eventAppear(numtest) {
    let Adversitynum = diveLinker_map.getAttr("30800a030717494085d10d76a10a9501");  
    if (Adversitynum === 1) {
        console.log("toss: ", toss); 
        handleAdversity();
    }else {
        // 確保 totalToss 被更新為 numtest，並進行餘數計算
        if (numtest > 0) {
            totalToss = numtest; // 更新totalToss為numtest
            remainder1 = totalToss % 40;
            numtest = 0; // 更新後將 numtest 清零
        } else {
            remainder1 = totalToss % 40;

            let checkpoints = [8, 16, 24, 32]; // 設定銀行結算日的檢查點
            for (let i = 1; i <= toss; i++) {
                let step = (lastPosition + i) % 40;
                if (checkpoints.includes(step)) {
                    console.log(`經過檢查點 ${step}`);
                }
            }
        }

        lastPosition = remainder1; // 更新上次的位置為當前位置

        //mau更新
        attrValue_市價 = Math.floor(Math.random() * 200) + 1;

        // 確保事件選擇和判斷正確執行
        if (remainder1 === 1 || remainder1 === 6 || remainder1 === 10 || remainder1 === 15 || remainder1 === 18 || remainder1 === 23 || remainder1 === 27 || remainder1 === 35) {
            event_choice = 2;
        } else if (remainder1 === 3 || remainder1 === 11 || remainder1 === 21 || remainder1 === 29 || remainder1 === 39) {
            event_choice = 3;
        } else if (remainder1 === 5 || remainder1 === 12 || remainder1 === 19 || remainder1 === 26 || remainder1 === 33 || remainder1 === 38) {
            event_choice = 4;
        } else if (remainder1 === 7 || remainder1 === 31) {
            event_choice = 5;
        } else if (remainder1 === 9) {
            event_choice = 6;
        } else if (remainder1 === 14 || remainder1 === 34) {
            event_choice = 7;
        } else if (remainder1 === 17) {
            event_choice = 8;
        } else if (remainder1 === 37) {
            event_choice = 9;
        } else {
            event_choice = 10; // 先設定其他的為10，事件視窗不顯示
        }
        // 強制發生 force
        // event_choice = 2;
        DetermineEvent(); // 執行事件決策
}
}
//(6) 判斷事件種類：1= 銀行結算日 2=機會 3=覺察/行情 4=命運 5=恩典 6=逆境 7=生病 8=生子 9=結婚 10=空白
async function DetermineEvent() {
    try {
        switch (event_choice) {
            case 1:
                diveLinker_event.setInput("e3a5d10694f1415897ce115fb4ea264d", 1);
                console.log("銀行結算日 event");
                break;
            case 2:
                diveLinker_event.setInput("e3a5d10694f1415897ce115fb4ea264d", 2);
                console.log("機會 event");
                handleChanceEvent();
                break;
            case 3:
                diveLinker_event.setInput("e3a5d10694f1415897ce115fb4ea264d", 3);
                console.log("覺察/行情 event");
                marketability();
                break;
            case 4:
                diveLinker_event.setInput("e3a5d10694f1415897ce115fb4ea264d", 4);
                console.log("命運 event");
                handleFateEvent();
                break;
            case 5:
                diveLinker_event.setInput("e3a5d10694f1415897ce115fb4ea264d", 5);
                console.log("恩典 event");
                document.querySelector("#overlay .event").style.visibility = ".";
                eventWindowVisible = false; // 重置標誌變數
                break;
            case 6:
                diveLinker_event.setInput("e3a5d10694f1415897ce115fb4ea264d", 6);
                diveLinker_map.setInput("30800a030717494085d10d76a10a9501", 1);
                break;
            case 7:
                diveLinker_event.setInput("e3a5d10694f1415897ce115fb4ea264d", 7);
                console.log("生病 event");
                sickEvent();
                break;
            case 8:
                diveLinker_event.setInput("e3a5d10694f1415897ce115fb4ea264d", 8);
                console.log("生子 event");
                childEvent();
                break;
            case 9:
                diveLinker_event.setInput("e3a5d10694f1415897ce115fb4ea264d", 9);
                console.log("結婚 event");
                marryEvent();
                break;
            case 10: //隱藏
                console.log("空白 event");
                document.querySelector("#overlay .event").style.visibility = ".";
                eventWindowVisible = false; // 重置標誌變數
                return;
            case 11 : //逆境從上而下，還沒完成
                diveLinker_event.setInput("e3a5d10694f1415897ce115fb4ea264d",11);
                diveLinker_map.setInput("30800a030717494085d10d76a10a9501", 2);
                break;
            default:
                console.error("Unknown event type:", event_choice);
        }
        event_show();
    } catch (error) {
        console.error("Failed to determine event:", error);
    }
}
//(7) 事件顯示
async function event_show() {
    if (!eventWindowVisible) {
        let eventnum = diveLinker_event.getAttr("e3a5d10694f1415897ce115fb4ea264d");
        console.log("eventnum (before visible) =", eventnum);
        await delay(100);
        eventWindowVisible = true;
        setTimeout(() => {
            document.querySelector("#overlay .event").style.visibility = "visible";
            console.log("Event window is now visible.");
            eventnum = diveLinker_event.getAttr("e3a5d10694f1415897ce115fb4ea264d");
            console.log("eventnum (after visible) =", eventnum);
        }, 2000);

        // 添加重置 eventnum 的邏輯，確保每次進入事件時都能正確觸發
        checkEnter2();
    }
}
// (8) 事件消失？
function checkEnter2() {
    const intervalEnter2 = setInterval(function () {
        let press2 = diveLinker_event.getAttr("ad26d2c348144443873812702233e8ad");
        if (press2 === 1) {
            document.querySelector("#overlay .event").style.visibility = "hidden";
            eventWindowVisible = false; // 重置標誌變數
            diveLinker_event.setInput("ad26d2c348144443873812702233e8ad", 0); // 清空相應屬性值
            diveLinker_event.setInput("d6bd8b2ccf714b65898e34fd37d5bf49", 0); // 覺察/行情數字=0
            diveLinker_event.setInput("91c42f687b41493b96bd1983ffb44832", 0); // 機會4選1數字=0
            clearInterval(intervalEnter2); // 清除 interval
        }
    }, 100);
}

//逆境參數
let numtest = 0;
let adversityPosition = 0; // 在逆境中的位置
let totalAdversitySteps = 8; // 逆境總格數

//事件-進入逆境[由下而上]
async function handleAdversity() {
    console.log("Handling adversity event[從下而上]");
    adversityPosition += toss;

    if (adversityPosition > totalAdversitySteps) {
        let stepsOutsideAdversity = adversityPosition - totalAdversitySteps;
        numtest = totalToss + 18 + stepsOutsideAdversity; 
        console.log(`玩家離開逆境，回到正常，總數值：${numtest}`);
        
        // 重置逆境位置
        adversityPosition = 0;
        await delay(1000);
        // 將玩家狀態重置為非逆境
        diveLinker_map.setInput("30800a030717494085d10d76a10a9501", 0);

        await delay(1000);
        console.log("準備執行 eventAppear");
        eventAppear(numtest); // 將 numtest 傳遞給 eventAppear()
 
    } else {
        // 逆境中的情況
        console.log(`逆境事件：逆境位置 ${adversityPosition}`);
        diveLinker_event.setInput("69cea17f848948419bc05d4ba5adcfcf", 1); // 顯示逆境事件
        diveLinker_event.setInput("1b1feb0b3da64daaabcc29c1a62d53ed", 0); // 重置事件框判斷
        event_show(); // 顯示事件框
    }
}

// 處理機會事件
function handleChanceEvent() {
    console.log("Handling 機會 event.");
    //diveLinker_map.setInput("4fbb7116e5224228ad5b2f154afe2900", 1); // 當等於 1 時，出現黑幕
    const intervalEnter2 = setInterval(function () {
    let num1 = diveLinker_event.getAttr("91c42f687b41493b96bd1983ffb44832");
    console.log("num1 的值是:", num1, "類型是:", typeof num1);
    if (num1 > 0) {
        console.log("已選擇機會類型，開始處理...");
        console.log("機會類型 1 金融 2 副業 3 創業 4 房產：", num1);
        diveLinker_event.setInput("e3a5d10694f1415897ce115fb4ea264d", 0); //清空
        clearInterval(intervalEnter2); // 停止檢查
        chancetype(num1);
        }
    }, 1000); // 每 100 毫秒檢查一次
        
    }

// 判斷機會種類
function chancetype(num1) {
    //機會卡牌們
    if (num1 ==1){
        let  ssnumber = getRandomInt(1, 1);
        diveLinker_event.setInput("2133b439a2244a60aa52873b32604622", ssnumber);
        
    }else if (num1 == 2){
        //副業
        //1.兼差跑食品外送(每次結算日多領5,000，精力-3)
        //2.閒暇之餘製作手工製品並售出(每次結算日多領3,000，精力-1)
        //3.創立自媒體頻道但默默無名(每次結算日多領1,000，精力-1)
        //4.成立自媒體並獲取不小的關注度(每次結算日多領10,000，精力-3)
        //5.四處接家教(每次結算日多領2,000，精力-2)
        let  worknumber = getRandomInt(1, 5);
        diveLinker_event.setInput("1eb62797d981404097581ecbdf3b01ee", worknumber);
        let eventData = {};
        console.log("隨機生成的副業事件數字:", worknumber);
        if (worknumber == 1) {
            everymoney += 5000;
            energy -= 3;
            eventData = { name: "兼差跑食品外送", cashflow: +5000, energyCost: -3 };
        } else if (worknumber == 2) {
            everymoney += 3000;
            energy -= 1;
            eventData = { name: "手工製品銷售", cashflow: +3000, energyCost: -1 };
        } else if (worknumber == 3) {
            everymoney += 1000;
            energy -= 1;
            eventData = { name: "默默無名自媒體", cashflow: +1000, energyCost: -1 };
        } else if (worknumber == 4) {
            everymoney += 10000;
            energy -= 3;
            eventData = { name: "自媒體大受歡迎", cashflow: +10000, energyCost: -3 };
        } else if (worknumber == 5) {
            everymoney += 2000;
            energy -= 2;
            eventData = { name: "家教工作", cashflow: +2000, energyCost: -2 };
        }
        saveEventToFirebase("副業", eventData);
        diveLinker_map.setInput("e34e18484faf41339941aa82ad8ed291", energy);
        diveLinker_map.setInput("99db93a56ca14dac91cd27dceac949ad", cashh);
        diveLinker_map.setInput("c3013d5b2c4d481fbef0029880319540", everymoney);

    }else if (num1 == 3){
        //創業
        /* 1.科技新創 - 智能家居系統開發
        初期投入資金：1,500,000元
        每月需要的支出：200,000元（人力成本、研發費用、辦公室租金）
        每月可獲得的收入：350,000元（產品銷售、系統訂閱費）
        月現金流：150,000元
        需耗費之精力：6點 */
    
        /* 2.線上教育平台
        初期投入資金：800,000元
        每月需要的支出：150,000元（平台維護、課程製作、行銷推廣）
        每月可獲得的收入：250,000元（課程銷售、會員訂閱）
        月現金流：100,000元
        需耗費之精力：7點
        */ 
       /* 3.精品咖啡連鎖店
        初期投入資金：2,000,000元
        每月需要的支出：300,000元（原料成本、店面租金、員工薪資）
        每月可獲得的收入：450,000元（飲品銷售、周邊商品）
        月現金流：150,000元
        需耗費之精力：9點
       */ 
      /* 4.環保科技 - 可分解塑料研發
        初期投入資金：3,000,000元
        每月需要的支出：400,000元（研發成本、設備租賃、專利申請）
        每月可獲得的收入：600,000元（技術授權、產品銷售）
        月現金流：200,000元
        需耗費之精力：6點
      */ 
     /* 5.旅遊體驗設計公司
        初期投入資金：1,000,000元
        每月需要的支出：180,000元（行程設計、合作夥伴費用、行銷推廣）
        每月可獲得的收入：300,000元（旅遊套裝、客製化服務）
        月現金流：120,000元
        需耗費之精力：7點
    */
        let  createnumber = getRandomInt(1, 5);
        diveLinker_event.setInput("942dcc55412243deaa6c373aa7776b0a", createnumber);
        console.log("隨機生成的創業事件數字:", createnumber);
        let eventData = {};
        if (createnumber == 1) {
            eventData = {
                name: "科技新創 - 智能家居系統開發",
                initialInvestment: 1500000,
                monthlyExpenses: 200000,
                monthlyIncome: 350000,
                cashflow: 150000,
                energyCost: 6
            };
        } else if (createnumber == 2) {
            eventData = {
                name: "線上教育平台",
                initialInvestment: 800000,
                monthlyExpenses: 150000,
                monthlyIncome: 250000,
                cashflow: 100000,
                energyCost: 7
            };
        } else if (createnumber == 3) {
            eventData = {
                name: "精品咖啡連鎖店",
                initialInvestment: 2000000,
                monthlyExpenses: 300000,
                monthlyIncome: 450000,
                cashflow: 150000,
                energyCost: 9
            };
        } else if (createnumber == 4) {
            eventData = {
                name: "可分解塑料研發",
                initialInvestment: 3000000,
                monthlyExpenses: 400000,
                monthlyIncome: 600000,
                cashflow: 200000,
                energyCost: 6
            };
        } else if (createnumber == 5) {
            eventData = {
                name: "旅遊體驗設計公司",
                initialInvestment: 1000000,
                monthlyExpenses: 180000,
                monthlyIncome: 300000,
                cashflow: 120000,
                energyCost: 7
            };
        }
        saveEventToFirebase("創業", eventData);
        diveLinker_map.setInput("e34e18484faf41339941aa82ad8ed291", energy);
        diveLinker_map.setInput("99db93a56ca14dac91cd27dceac949ad", cashh);

    } else if (num1 == 4){
        //房產
        /*  1. 都市住宅租賃
            初期投入資金：5,000,000元
            每月需要的支出：50,000元（維護費用、物業管理費）
            每月可獲得的收入：150,000元（租金收入）
            月現金流：100,000元
            需耗費之精力：7點 

            2. 商業辦公樓
            初期投入資金：10,000,000元
            每月需要的支出：100,000元（維護費用、物業管理費）
            每月可獲得的收入：300,000元（租金收入）
            月現金流：200,000元
            需耗費之精力：7點

            3. 度假別墅
            初期投入資金：8,000,000元
            每月需要的支出：80,000元（維護費用、物業管理費）
            每月可獲得的收入：200,000元（租金收入）
            月現金流：120,000元
            需耗費之精力：7點

            4 鄉村農舍
            初期投入資金：3,000,000元
            每月需要的支出：30,000元（維護費用、物業管理費）
            每月可獲得的收入：100,000元（租金收入）
            月現金流：70,000元
            需耗費之精力：7點

            5. 學生公寓
            初期投入資金：4,000,000元
            每月需要的支出：40,000元（維護費用、物業管理費）
            每月可獲得的收入：120,000元（租金收入）
            月現金流：80,000元
            需耗費之精力：7點
            */
            let  housenumber = getRandomInt(1, 5);
            diveLinker_event.setInput("247b802526974ddf9933db96d967a1cb", housenumber);
            console.log("隨機生成的房產事件數字:", housenumber);
            let eventData = {};
    
            if (housenumber == 1) {
                // 都市住宅租賃
                everymoney += 100000;  // 月現金流
                energy -= 7;      // 消耗精力
                eventData = {
                    name: "都市住宅租賃",
                    initialInvestment: 5000000,  // 初期投入
                    monthlyExpenses: 50000,      // 每月支出
                    monthlyIncome: 150000,       // 每月收入
                    cashflow: 100000,            // 月現金流
                    energyCost: 7                // 精力消耗
                };
            } else if (housenumber == 2) {
                // 商業辦公樓
                everymoney += 200000;
                energy -= 7;
                eventData = {
                    name: "商業辦公樓",
                    initialInvestment: 10000000,
                    monthlyExpenses: 100000,
                    monthlyIncome: 300000,
                    cashflow: 200000,
                    energyCost: 7
                };
            } else if (housenumber == 3) {
                // 度假別墅
                everymoney += 120000;
                energy -= 7;
                eventData = {
                    name: "度假別墅",
                    initialInvestment: 8000000,
                    monthlyExpenses: 80000,
                    monthlyIncome: 200000,
                    cashflow: 120000,
                    energyCost: 7
                };
            } else if (housenumber == 4) {
                // 鄉村農舍
                everymoney += 70000;
                energy -= 7;
                eventData = {
                    name: "鄉村農舍",
                    initialInvestment: 3000000,
                    monthlyExpenses: 30000,
                    monthlyIncome: 100000,
                    cashflow: 70000,
                    energyCost: 7
                };
            } else if (housenumber == 5) {
                // 學生公寓
                everymoney += 80000;
                energy -= 7;
                eventData = {
                    name: "學生公寓",
                    initialInvestment: 4000000,
                    monthlyExpenses: 40000,
                    monthlyIncome: 120000,
                    cashflow: 80000,
                    energyCost: 7
                };
            }
        
            // 儲存房產事件資料到 Firebase
            saveEventToFirebase("房產", eventData);
        
            // 更新遊戲狀態中的現金、精力和幸福感
            diveLinker_map.setInput("e34e18484faf41339941aa82ad8ed291", energy);
            diveLinker_map.setInput("99db93a56ca14dac91cd27dceac949ad", cashh);
            diveLinker_map.setInput("2fcde56e89494036bd9c2c6d642be7ed", happy);
            diveLinker_map.setInput("c3013d5b2c4d481fbef0029880319540", everymoney);
        }
}

// 處理命運事件
function handleFateEvent() {
    console.log("Handling 命運 event.");
        // 在這裡添加處理命運事件的邏輯
        const fatenumber = getRandomInt(1, 2);
        diveLinker_event.setInput("da921443e2a4426f88230f033ccd4597", fatenumber);
        console.log("隨機生成的命運事件數字:", fatenumber);
        diveLinker_event.setInput("1b1feb0b3da64daaabcc29c1a62d53ed", 0);
    
        //1. 遭遇小型車禍*   影響: 資產負債表中"台幣活存"減少50,000元(醫療費和車輛維修),幸福感-3 (先決條件: 要有車)--1
        //2. 意外中了統一發票特獎*   影響: 資產負債表中"台幣活存"增加20,000元,幸福感+5--2
        //3. 遇到房市上漲,房產增值*  影響: 資產負債表中"房地產(自住)"價值增加100,000元,幸福感+3 (先決條件: 要有房子)
        //4. 遭遇投資詐騙   影響: 資產負債表中"台幣活存"減少50,000元,幸福感-5
        //5. 因工作壓力大,患上重度憂鬱症，須定期回診   影響: 月現金流量表中新增"醫療支出"2,000元,幸福感-3,精力-3

        let fateEventData = {};
    
        if (fatenumber === 1) {
            fateEventData = {
                "事件名稱": "遭遇小型車禍",
                "描述": "資產減少，幸福感降低",
                "財產變化": -50000,
                "體力變化": 0,
                "幸福變化": -3
            };
        } else if (fatenumber === 2) {
            fateEventData = {
                "事件名稱": "中大獎",
                "描述": "資產增加，幸福感提升",
                "財產變化": +20000,
                "體力變化": 0,
                "幸福變化": +5
            };
        }else if (fatenumber === 3) {
            fateEventData = {
                "事件名稱": "房市上漲",
                "描述": "如果資產有房子，價值飆高",
                "幸福變化": +5
            };
        }else if (fatenumber === 4) {
            fateEventData = {
                "事件名稱": "遭遇投資詐騙",
                "描述": "被騙了5萬元，荷包受損心理層面更不舒服",
                "財產變化": -50000,
                "幸福變化": -5
            };
        }else if (fatenumber === 5) {
            fateEventData = {
                "事件名稱": "工作壓力大,患上重度憂鬱症",
                "描述": "患上重度憂鬱症，須定期回診，每個月月現金流減少2000元醫療費用",
                "財產變化": -2000,
                "體力變化": -3,
                "幸福變化": -3
            };
        }

            fatenumber == 1 && (happy -= 3);
            fatenumber == 2 && (happy += 5);
            fatenumber == 3 && (happy += 3);
            fatenumber == 4 && (happy -= 5);
            fatenumber == 5 && (happy -= 3, energy -=3);
            diveLinker_map.setInput("e34e18484faf41339941aa82ad8ed291", energy); 
            diveLinker_map.setInput("2fcde56e89494036bd9c2c6d642be7ed", happy);

            // 儲存事件到 Firebase
        saveEventToFirebase("命運", fateEventData);
    }

// 處理機會事件
function marketability() {
    console.log("Handling 覺察行情 event.");
    const intervalEnter3 = setInterval(function () {
    let press3 = diveLinker_event.getAttr("d6bd8b2ccf714b65898e34fd37d5bf49");
    console.log("press3 的值是:", press3, "類型是:", typeof press3);
    if (press3 > 0) {
        console.log("已選擇覺察/行情，開始處理...");
        console.log(" 1 覺察 2 行情", press3);
        diveLinker_event.setInput("e3a5d10694f1415897ce115fb4ea264d", 0); //清空
        clearInterval(intervalEnter3); // 停止檢查
        marketability2(press3);
        }
    }, 1000); // 每 100 毫秒檢查一次
        
    }       


//市場覺察、行情
function marketability2(press3) {
    //覺察
    //1. 意識到安全駕駛的重要性，開始學習防禦性駕駛技巧。精力-1，未來如抽到小型車禍時，損失減少50%。
    //2. 了解房屋保險的必要性，購買全面的房屋保險。 每月支付500元，未來如遇到地震或颱風損害時，金錢損失減少70%。
    //3. 意識到唯有改變自己的腦袋，才能改變自己的口袋，於是開始去學習成長。精力+2
    //4. 意識到心理健康的重要性，開始學習壓力管理技巧。精力-1，可抵免患上重度憂鬱症。
    //5. 認識到家庭關係的價值，開始定期與父母聯絡。幸福感+3，精力-1。
   
    //確認是點擊覺察OR行情(等到選擇做出來要把參數=press3)
    if (press3 == 1) { 
        let awareEventData = {};
        const awarenumber = getRandomInt(1, 3);
        diveLinker_event.setInput("d66ceab90acd42cd94710354ef5998b6", awarenumber);
        console.log("隨機生成的市場事件數字:", awarenumber);
        diveLinker_event.setInput("1b1feb0b3da64daaabcc29c1a62d53ed", 0); //事件框判斷歸0

        if (awarenumber  === 1) {
            awareEventData = {
                "事件名稱": "意識到安全駕駛的重要性，開始學習防禦性駕駛技巧",
                "描述": "未來如抽到小型車禍時，損失減少50%",
                "體力變化": -1,
            }
        } else if (awarenumber === 2) {
            awareEventData = {
                "事件名稱": "了解房屋保險的必要性，購買全面的房屋保險",
                "描述": "未來如遇到地震或颱風損害時，金錢損失減少70%，每個月都須支付500元",
                "財產變化": -500,
            };
        } else if (awarenumber === 3) {
            awareEventData = {
                "事件名稱": "意識到唯有改變自己的腦袋，才能改變自己的口袋，於是開始去學習成長",
                "描述": "養成一個積極正向的生活",
                "體力變化": +2,
            };
        }else if (awarenumber === 4) {
            awareEventData = {
                "事件名稱": "意識到心理健康的重要性，開始學習壓力管理技巧",
                "描述": "未來可避免患上重度憂鬱症。",
                "體力變化": -1,
            };
        }else if (awarenumber === 5) {
            awareEventData = {
                "事件名稱": "意識到認識到家庭關係的價值，開始定期與父母聯絡",
                "描述": "修復了親子關係，幸福感提升，體力下降",
                "體力變化": -1,
                "幸福變化": +3
            };
        }
        awarenumber == 1 && (energy -= 1);
        awarenumber == 2 && (cashh -= 500);
        awarenumber == 3 && (energy += 2);
        awarenumber == 4 && (energy -= 1);
        awarenumber == 5 && (energy -= 1, happy += 3);
        diveLinker_map.setInput("e34e18484faf41339941aa82ad8ed291", energy); 
        diveLinker_map.setInput("2fcde56e89494036bd9c2c6d642be7ed", happy);
        diveLinker_map.setInput("99db93a56ca14dac91cd27dceac949ad", cashh); 
         // 儲存事件到 Firebase
         saveEventToFirebase("覺察", awareEventData);
        clearInterval(intervalEnter3); // 停止檢查
    }
    //行情
    //1.疫情肆虐，醫療股大漲
    //3.受戰爭影響，油價不斷攀升，航運股大跌*
    //5.開學季將至，電腦產品股漲幅可觀*
    else if (press3 == 2){
        let futurEventData = {};
        const futurenumber = getRandomInt(1, 3);
        diveLinker_event.setInput("cfb8091ecb1845559e39020de194f286", futurenumber);
        console.log("隨機生成的市場事件數字:", futurenumber);
        diveLinker_event.setInput("1b1feb0b3da64daaabcc29c1a62d53ed", 0); //事件框判斷歸0
        if (futurenumber  === 1) {
            futurEventData = {
                "事件名稱": "疫情肆虐，醫療股大漲",
                "描述": "接下來的醫療股價格會大漲，若使用者有醫療股會小賺一筆",
            };
        } else if (futurenumber === 2) {
            futurEventData = {
                "事件名稱": "受戰爭影響，油價不斷攀升，航運股大跌",
                "描述": "接下來的醫療股價格會大跌，使用者的航運股資產變少",
            };
        } else if (futurenumber === 3) {
            futurEventData = {
                "事件名稱": "開學季將至，電腦產品股漲幅可觀",
                "描述": "接下來的電腦產品股漲幅可觀",
            };
        } 
        // 儲存事件到 Firebase
        saveEventToFirebase("行情", futurEventData);
        clearInterval(intervalEnter3); // 停止檢查
    }

}

//生病
function sickEvent() {
    let sickEventData = {};
    console.log("生病事件")
    sickEventData = {
        "事件名稱": "因工作壓力大,患上輕度憂鬱症",
        "描述": "因為生病造成體力、幸福值、現金都下降",
        "財產變化": -2000,
        "體力變化": -3,
        "幸福變化": -3
    };
    energy -= 3;
    happy -= 3;
    cashh -=2000;
    // 儲存事件到 Firebase
    saveEventToFirebase("生病", sickEventData);
    diveLinker_map.setInput("e34e18484faf41339941aa82ad8ed291", energy); 
    diveLinker_map.setInput("2fcde56e89494036bd9c2c6d642be7ed", happy);
    diveLinker_map.setInput("99db93a56ca14dac91cd27dceac949ad", cashh); 
}

//生小孩
function childEvent(){
    let childEventData = {};
    console.log("生子事件");
    childEventData = {
        "事件名稱": "生子",
        "描述": "喜從天降，不知是福還是禍",
    };
    // 儲存事件到 Firebase
    saveEventToFirebase("生子", childEventData);
}

//結婚
function marryEvent(){
    let marryEventData = {};
    console.log("結婚事件");
    marryEventData = {
        "事件名稱": "結婚",
        "描述": "因為彼此深厚的感情和共同的未來願景，決定攜手結婚，並共築夢想的家庭",
    };
    // 儲存事件到 Firebase
    saveEventToFirebase("結婚", marryEventData);
}

//恩典
function graceEvent(){
    let graceEventData = {};
    console.log("恩典")
    graceEventData = {
        "事件名稱": "恩典",
        "描述": "當遭遇逆境時，能夠立即使用，直接走出逆境，避免進一步的損失或挑戰",
    };
    // 儲存事件到 Firebase
    saveEventToFirebase("恩典", graceEventData);
}

// 儲存事件到 Firebase (compat 版本)
function saveEventToFirebase(eventType, eventData) {
    const userRef = firebase.database().ref(`users/${userName}/操作紀錄`); // 使用者姓名下的「操作紀錄」

    // 先讀取現有的操作紀錄數量，然後新增一個新編號
    userRef.once('value')
        .then((snapshot) => {
            const currentEventCount = snapshot.numChildren(); // 取得現有紀錄數量
            const newEventId = currentEventCount + 1; // 新事件的編號

            // 用新編號來儲存事件
            userRef.child(newEventId).set({
                編號: newEventId,  // 新增編號欄位
                eventType: eventType,
                eventData: eventData,
                createdAt: new Date().toISOString()
            }).then(() => {
                console.log('事件已成功儲存到 Firebase，編號為:', newEventId);
            }).catch((error) => {
                console.error('儲存事件失敗:', error);
            });
        })
        .catch((error) => {
            console.error('讀取操作紀錄失敗:', error);
        });
}




// 這邊是 MAU更新的部分:
//let attrValue_市價 = diveLinker_event.getAttr("34806e3248be41abba9ba956d37706f9");
let stock_buy_number = 0; 
let stock_buy_name = "尚未購買";
let buy = 0;
let sell = 0;
let cancel = 0; 

let cost = diveLinker_event.getAttr("ca1497c094274fceb2ca210fab1855ff");
let cash_event = diveLinker_event.getAttr("2adaeee03648471bbb4f4cf141562d36");
let turn = diveLinker_toss.getAttr("24cec05ca4cf479e857453be9988e7aa");
let event_MAU;
let action_MAU;


var checkComplete_Interval = setInterval(() => {
    // 獲取 diveLinker 的屬性
    diveLinker_event.setInput("34806e3248be41abba9ba956d37706f9",attrValue_市價);
    temporaryquantity = diveLinker_event.getAttr("78703952645c4149b40a257e35306680");
    buy = diveLinker_event.getAttr("7307d9e03e8943889232c1dc270fb29b");
    sell = diveLinker_event.getAttr("049d2835a77f4313935d03c3717cde92");
    cancel = diveLinker_event.getAttr("b014ee6291a640c886b947ef69b77da0"); 
    turn = diveLinker_toss.getAttr("24cec05ca4cf479e857453be9988e7aa");


    
    event_MAU = 'Stock';
    cost = attrValue_市價*1000*temporaryquantity;

    //console.log(diveLinker_event.getIOList());
    //addGameState(turn, event, action, buySell, cash, stockCode, stockNumber)
    // 檢查是否有找到對應結果
    if (1) {
        // 更新 dynamicText 的內容為獲取到的值
        /**/
        
        document.getElementById("dynamicText00").innerHTML = `這是更新後的現金: ${cashh}`;
        document.getElementById("dynamicText01").innerHTML = `這是更新後的市價: ${attrValue_市價}`;
        document.getElementById("dynamicText02").innerHTML = `這是想要交易的張數: ${temporaryquantity}`;
        document.getElementById("dynamicText03").innerHTML = `這是本次要花費的金額: ${cost}`;
        document.getElementById("dynamicText04").innerHTML = `這是目前購買後的股票代號: ${stock_buy_name}`;
        document.getElementById("dynamicText05").innerHTML = `這是目前手上有的股票張數: ${stock_buy_number}`;
        document.getElementById("dynamicText06").innerHTML = `這是否購買股票: ${buy}`;
        document.getElementById("dynamicText07").innerHTML = `這是否販售股票: ${sell}`;
        document.getElementById("dynamicText08").innerHTML = `目前是第 ${turn} 次骰骰子`;
        //document.getElementById("dynamicText09").innerHTML = `${sell}`;
        
        //和 event 專案溝通參數
        diveLinker_event.setInput("03c13004b26a44c4acb71c0b055a00c9",stock_buy_number);
        diveLinker_event.setInput("e2d9d3f6c61a4e58bf57128dc889e11b",temporaryquantity);
        diveLinker_event.setInput("282a8acc3bfa49b3a43d10ac8d592b90",cost);
        diveLinker_event.setInput("efec0369705c4c0bb539d66157a08b28",cashh);
        
        if(buy == 1 & cashh >= cost){
            // buy 歸零
            diveLinker_event.setInput("7307d9e03e8943889232c1dc270fb29b",0);
            buy = 0;
            action_MAU = 'buy';
            cashh = cashh - cost;
            stock_buy_number = stock_buy_number + temporaryquantity;
            stock_buy_name = "通訊";
            diveLinker_map.setInput("99db93a56ca14dac91cd27dceac949ad", cashh);
            addGameState(turn, '股票', '購買', cost, cashh, '通訊', temporaryquantity,attrValue_市價);
            displayGameStates();
        }

        if (sell == 1){
            //sell 歸零
            diveLinker_event.setInput("049d2835a77f4313935d03c3717cde92",0);
            sell = 0;
            cashh = cashh + cost;
            stock_buy_number = stock_buy_number - temporaryquantity;
            stock_buy_name = "通訊";
            
            addGameState(turn, '股票', '販賣', cost, cashh, '通訊', temporaryquantity, attrValue_市價);
            displayGameStates();

            diveLinker_map.setInput("99db93a56ca14dac91cd27dceac949ad", cashh);
        }
        // const decorate = `使用者在骰第 ${stateData.turn} 次骰子時, 碰上了投資 ${stateData.event} 的機會, 分類是 ${stateData.stock_code} 股，股價是 ${stateData.stock_price} 元，決定做出 ${stateData.action} 的行為, ${stateData.action} 了 ${stateData.stock_number} 張，交易了 ${stateData['buy/sell']} 元, 剩下現金 ${stateData.cash} 元`;        // 設置顯示的內容

        if (cancel == 1){
            //cancel 歸零
            diveLinker_event.setInput("b014ee6291a640c886b947ef69b77da0",0);
            cancel = 0;
            //cashh = cashh + cost;
            //stock_buy_number = stock_buy_number - temporaryquantity;
            stock_buy_name = "通訊";
            //addGameState(turn, 'Stock', 'Sell', cost, cashh, '通訊', temporaryquantity, attrValue_市價);
            addGameState(turn, '股票', '取消', 0, cashh, '通訊', 0, attrValue_市價);
            displayGameStates();

            diveLinker_map.setInput("99db93a56ca14dac91cd27dceac949ad", cashh);
        }
            

    } else {
        console.log('未找到 value 為 2 的對象');
    }


}, 100);

function updateText_buyStock() {
    cashh = cashh - cost;
    stock_buy_number = stock_buy_number + temporaryquantity;
    stock_buy_name = "通訊";
    // 動態更新文字
    //document.getElementById("dynamicText01").innerHTML = "這是更新後的文字";
}

function updateText_sellStock() {
    cashh = cashh + cost;
    stock_buy_number = stock_buy_number - temporaryquantity;
    stock_buy_name = "通訊";
    // 動態更新文字
    //document.getElementById("dynamicText01").innerHTML = "這是更新後的文字";
}

let gameStateHistory = [];

// 這邊負責記錄更新操作紀錄
// 函數用來新增遊戲狀態
function addGameState(turn, event, action, buySell, cash, stockCode, stockNumber, stockprice) {
    let gameState = new Map();
    gameState.set('turn', turn);
    gameState.set('event', event);
    gameState.set('action', action);
    gameState.set('buy/sell', buySell);
    gameState.set('cash', cash);
    gameState.set('stock_code', stockCode);
    gameState.set('stock_number', stockNumber);
    gameState.set('stock_price', stockprice);  // 新增 stock_price
    saveEventToFirebase_stock(turn, event, action, buySell, cash, stockCode, stockNumber, stockprice);
    gameStateHistory.push(gameState);
}


// 新增狀態
//addGameState(1, 'Stock', 'Buy', 100000, 900000, 'AAPL', 50, 150); // 150 為 stockprice

// 讀取並顯示全部資料
function displayGameStates() {
    // 取得 HTML 容器
    const gameStateDisplay = document.getElementById('gameStateDisplay');
    
    // 清空之前的內容
    gameStateDisplay.innerHTML = '';
    
    // 讀取並顯示全部資料
    gameStateHistory.forEach((gameState, index) => {
        // 創建一個 div 元素來顯示每個 gameState
        let stateDiv = document.createElement('div');
        
        // 取得 gameState 轉換成物件
        let stateData = Object.fromEntries(gameState);
        // 使用 decorate 字串來格式化輸出
        const decorate = `使用者在骰第 ${stateData.turn} 次骰子時, 碰上了投資 ${stateData.event} 的機會, 分類是 ${stateData.stock_code} 股，股價是 ${stateData.stock_price} 元，決定做出 ${stateData.action} 的行為, ${stateData.action} 了 ${stateData.stock_number} 張，交易了 ${stateData['buy/sell']} 元, 剩下現金 ${stateData.cash} 元`;        // 設置顯示的內容
        stateDiv.innerHTML = `
            <p><strong>State ${index + 1}:</strong></p>
            <p>回合: ${stateData.turn}</p>
            <p>事件: ${stateData.event}</p>
            <p>採取動作: ${stateData.action}</p>
            <p>交易金額: ${stateData['buy/sell']}</p>
            <p>剩餘現金: ${stateData.cash}</p>
            <p>股票代碼: ${stateData.stock_code}</p>
            <p>股票數量: ${stateData.stock_number}</p>
            <p>股票時價: ${stateData.stock_price}</p> <!-- 顯示 stock_price -->
            <p>描述:${decorate}</p>
            <hr>
        `;
        
        // 將這個 div 加到 HTML 容器內
        gameStateDisplay.appendChild(stateDiv);
    });
}


//addGameState(turn, 'Stock', 'Sell', cost, cashh, '通訊', temporaryquantity, attrValue_市價);

function saveEventToFirebase_stock(turn, event, action, buySell, cash, stockCode, stockNumber, stockprice) {
    const userRef = firebase.database().ref(`users/${userName}/股票操作紀錄`); // 使用者姓名下的「操作紀錄」

    // 先讀取現有的操作紀錄數量，然後新增一個新編號
    userRef.once('value')
        .then((snapshot) => {
            const currentEventCount = snapshot.numChildren(); // 取得現有紀錄數量
            const newEventId = currentEventCount + 1; // 新事件的編號
            const decorate = `使用者在骰第${turn}次骰子時, 碰上了投資${event}的機會,分類是${stockCode}股，股價是${stockprice}元，決定做出${action}的行為, ${action}了${stockNumber}張，交易了${buySell}元,剩下現金${cash}元`;
            // 用新編號來儲存事件
            userRef.child(newEventId).set({
                編號: newEventId,  // 新增編號欄位
                回合: turn,        // 儲存 turn
                事件: event,      // 儲存 event
                採取動作: action,    // 儲存 action
                交易金額: buySell,  // 儲存 buySell
                剩下金額: cash,        // 儲存 cash
                股票種類: stockCode,  // 儲存 stockCode
                交易股票量: stockNumber,  // 儲存 stockNumber
                股票時價: stockprice,  // 儲存 stockprice
                時間戳記: new Date().toISOString(),  // 儲存時間戳記
                描述: decorate
            }).then(() => {
                console.log('事件已成功儲存到 Firebase，編號為:', newEventId);
            }).catch((error) => {
                console.error('儲存事件失敗:', error);
            });
        })
        .catch((error) => {
            console.error('讀取操作紀錄失敗:', error);
        });
}


