// 載入 DiveLinker 並設置 DIVE linker
const diveLinker_index = new DiveLinker("index");

//(1)載入完成
window.onload = function() {
    diveLinker_index.enableBlock(false);
    diveLinker_index.start();
    checkDiveLinker();
}

//(2)確保 diveLinker 初始化
function checkDiveLinker() {
    const intervalId_index = setInterval(function() {
        if (diveLinker_index.getLoadingStatus() === true) {
            clearInterval(intervalId_index); // 停止檢查 checkDiveLinker
            enterstart();
        }
    }, 100); // 每 100 毫秒檢查一次
}

//(3)開始
function enterstart(){
    var checkComplete_Inteval = setInterval(()=>{
        let start = diveLinker_index.getAttr("17028d24dd7147c7b26c1c8cb4629fe6");
        if(start === 1 ){
            let next_stage = "31790";
            diveLinker_index.setProject(next_stage);
            console.log("start1");
            // 清除計時器
            clearInterval(checkComplete_Inteval);
            checkDiveLinker1();
        }
    },100)
}

//(4)確保第二個diveLinker初始化
function checkDiveLinker1() {
    const intervalId_index = setInterval(function() {
        if (diveLinker_index.getLoadingStatus() === true) {
            diveLinker_index.enableBlock(false);
            diveLinker_index.start();
            is_form_complete();
            clearInterval(intervalId_index); // 停止檢查 checkDiveLinker
        }
    }, 100); // 每 100 毫秒檢查一次
}

//(5)是否完成填寫 0=未完成、1=完成
function is_form_complete() {
    const intervalEnter = setInterval(function () {
        let finish = diveLinker_index.getAttr("5ef1cd8ff68a4f4b8ef62ecb79e363ca");
        if (finish === 1) {
            clearInterval(intervalEnter);
            AccessPersonalData();
            enterstart1();
        }
    }, 1000); // 每 1000 毫秒(1秒)檢查一次
}

//(6)檢查資料並存入 Firebase
async function AccessPersonalData() {
    // 第一頁資料
    //姓名
    let name = diveLinker_index.getAttr("b5df8e7729f440d5805dd228d8ace477");
    localStorage.setItem('userName', name);
    //性別
    let gender = diveLinker_index.getAttr("c35530ba034a4a5e96bcbe1341388960");
    //年齡
    let age = diveLinker_index.getAttr("1d25c4bf3f9148c283d75a68718fa3fe");
    //欲退休年齡
    let retirementAge = diveLinker_index.getAttr("67dfbf9975ac49b88e8bcd05dcb8ce9b");
    //家庭成員
    let householdMembers = diveLinker_index.getAttr("445da1132eb945a19208e773fc199a8b");
    //家庭成員[其他]
    let householdMembersOther = diveLinker_index.getAttr("2908ea7adcd64211a6a964f391d4d619");

    // 第二頁資料
    //居住縣市
    let city = diveLinker_index.getAttr("30e83cd778184c2e8f21e8e8396c15f8");
    //居住類型
    let housingType = diveLinker_index.getAttr("f425b5d45eb0499fa00aee7c9daa9b6e");
    //家庭成員是否有重大疾病
    let familyMajorIllness = diveLinker_index.getAttr("13d571e52a8c4f9c91a3630237000bed");
    //疾病名稱
    let illnessName = diveLinker_index.getAttr("68a983187a1240c8b48334261162750d");
    //是否有此疾病
    let selfMajorIllness = diveLinker_index.getAttr("28bf462f0a634b718681ce797ad89760");

    // 第三頁資料
    //興趣
    let interest = diveLinker_index.getAttr("824ea7bcdb3e4dc2bbb8bdbd0cc7f6d6");
    //興趣[其他]
    let interestOther = diveLinker_index.getAttr("5f20f66a8dba470d868d9466f19430fa");

    // 第四頁資料
    //薪水
    let salary = diveLinker_index.getAttr("0f82a199e29348f28755a11654fa7495");
    //獎金
    let bonus = diveLinker_index.getAttr("5b496e5a0b764b4382e6aaa11c909a08");
    //獎金[量詞]
    let bonusUnit = diveLinker_index.getAttr("71009eceee6f42d5984f4bc53cef83d5");
    //租金收入
    let rentIncome = diveLinker_index.getAttr("21383a43ab6c47b6a0ab48540ad933b0");
    //基金，股票配現金
    let fundStocksCash = diveLinker_index.getAttr("b28abd8e8a654f78ae7f5b2db827500d");
    //基金，股票配現金[量詞]
    let fundStocksCashUnit = diveLinker_index.getAttr("2fda81a0dbfd418db9667ec5ccfbcf5a");
    //保險生存金
    let insurance = diveLinker_index.getAttr("b0ece573914b4d1d9434de9c51724939");

    // 第五頁資料
    //活存
    let balanceSheetLivings = diveLinker_index.getAttr("0d9237b5b82d419a8cd7520da27b415e");
    //定存
    let balanceSheetSavings = diveLinker_index.getAttr("12ddb25d730743c89c8bfd5394d0720f");
    //儲蓄險
    let balanceSheetInsurance = diveLinker_index.getAttr("ef4a463ba1b44e0e83d751f2182c4345");
    //基金
    let balanceSheetMutualFunds = diveLinker_index.getAttr("514c8a08d25348cd8090fb40e6ed5360");
    //股票
    let balanceSheetStocks = diveLinker_index.getAttr("0b841ad6449b415e9dd69de2e6b40ebd");
    //不動產
    let balanceSheetRealEstate = diveLinker_index.getAttr("39fb2f2840a44d7a90beba4881d15a33");
    //資產負債表[其他]
    let balanceSheetOthers = diveLinker_index.getAttr("f215afe1afeb4d68853ea26e656787a3");

    //第六頁資料
    //哪些資產匯流到退休後使用
    let assetsForRetirement = diveLinker_index.getAttr("61e7f65b3d4a410ebfa6df7bb3509362");

    // 將所有資料整合到 userData 物件中
    let userData = {
        使用者資料: {  // 新增一層「使用者資料」
            個人資料: {
                姓名: name,
                性別: gender,
                年齡: age,
                退休年齡: retirementAge
            },
            家庭狀況: {
                家庭成員: householdMembers,
                家庭成員其他: householdMembersOther,
                家庭重大疾病: familyMajorIllness,
                疾病名稱: illnessName,
                是否患有重大疾病: selfMajorIllness
            },
            居住資料: {
                居住縣市: city,
                居住類型: housingType
            },
            興趣: {
                興趣: interest,
                興趣其他: interestOther
            },
            收入狀況: {
                薪水: salary,
                獎金: bonus,
                獎金單位: bonusUnit,
                租金收入: rentIncome,
                基金股票現金: fundStocksCash,
                基金股票現金單位: fundStocksCashUnit,
                保險: insurance
            },
            資產負債表: {
                活存: balanceSheetLivings,
                定存: balanceSheetSavings,
                儲蓄險: balanceSheetInsurance,
                基金: balanceSheetMutualFunds,
                股票: balanceSheetStocks,
                不動產: balanceSheetRealEstate,
                資產負債表其他: balanceSheetOthers
            },
            退休規劃: {
                退休後資產: assetsForRetirement
            }
        }
    };
    
    // 將資料寫入 Firebase
    const dbRef = firebase.database().ref('users/' + name); // "使用者"為資料庫根目錄
    dbRef.set(userData)
        .then(() => {
            console.log('資料成功儲存');
        })
        .catch((error) => {
            console.error('儲存資料時發生錯誤:', error);
        });    
}

//(7)轉換第三個dive - 過渡
function enterstart1(){
    var checkComplete_Inteval = setInterval(()=>{
        let next_stage = "31796";
        diveLinker_index.setProject(next_stage);
        console.log("start2");
        // 清除計時器
        clearInterval(checkComplete_Inteval);
        checkDiveLinker2();
    },100)
}

//(8)確保第三個diveLinker初始化
function checkDiveLinker2() {
    const intervalId_index = setInterval(function() {
        if (diveLinker_index.getLoadingStatus() === true) {
            diveLinker_index.enableBlock(false);
            diveLinker_index.start();
            checkMapPage();
            clearInterval(intervalId_index); // 停止檢查 checkDiveLinker
        }
    }, 100); // 每 100 毫秒檢查一次
}

//(9)轉換第四個dive-地圖
function checkMapPage(){
    const intervalpage = setInterval(function () {
        let page = diveLinker_index.getAttr("570a01d89116412fa1ce15d1767bb480");
        if (page === 1) {
            clearInterval(intervalpage);
            window.location.replace("map.html");
        }
    }, 1000); // 每 1000 毫秒(1秒)檢查一次
}