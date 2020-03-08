var town = document.getElementById('town');
//旅遊區域
var disTitle = document.querySelector('.title');
//分頁按鈕
var pagination = document.querySelector('.page_btn');
//頁碼
var clickPage = document.getElementById('page_btn');
var travelstr = document.getElementById("ulList");


//旅遊景點資料
var data = [];
var travelData;
var resultData;
var resultDataLen;

var districtData;
var xhr = new XMLHttpRequest();
xhr.open('get', 'https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97', true);
xhr.send(null);
xhr.onload = function() {
    travelData = JSON.parse(xhr.responseText);
    resultData = travelData.result.records;
    resultDataLen = resultData.length;

    for (var i = 0; i < resultDataLen; i++) {
        data.push(resultData[i]);
    }
    // console.log(resultData);

    districtData = []; //儲存等一下撈出來的地區陣列
    for (var i = 0; i < data.length; i++) {
        districtData.push(data[i].Zone); //撈到所有景點的地區，並存在districktData內
    }
    // console.log(resultData);

    //過濾地區重複的部分，只選出一個
    var filterRepeatDis = districtData.filter(function(element, index, array) {
        return array.indexOf(element) === index;
    });

    var showArea = '';
    //將篩選出來的地區塞入select區域
    var firstSelecte = '<option disabled selected>---請選擇行政區---</option>';
    for (var i = 0; i < filterRepeatDis.length; i++) {
        showArea += '<option>' + filterRepeatDis[i] + '</option>';
    }
    town.innerHTML = firstSelecte + showArea;
}



// 目前頁數
var current_page = 1;
//每頁顯示四筆資料
var every_page = 4;
//總頁數
var totalPageNum;
//每頁資料起始筆數
var startPage = (every_page * current_page) - every_page;
//每頁資料最終筆數
var endPage = (every_page * current_page) - 1;
//另外撈出同地區的陣列
var samearea;
var sameareaLen;

var showContent;
var userSelect;

//頁碼、顯示第一頁的資料
function getResultData(e) {
    e.preventDefault();
    //儲存頁數
    var showPage = "";
    showContent = "";
    //使用者選到的地區
    userSelect = e.target.value;
    //撈出每個地區的資料筆數everyDisNum
    count = 0;
    for (let i = 0; i < districtData.length; i++) {
        if (districtData[i] == userSelect) {
            count += 1;
        }
    };
    var everyDisNum = count;
    // console.log("總共" + everyDisNum + "筆");

    //每個地區的總頁數
    totalPageNum = Math.ceil(everyDisNum / every_page);
    // console.log("總頁數" + totalPageNum); 

    //插入頁碼
    for (let i = 1; i <= totalPageNum; i++) {
        showPage += '<span value=' + i + '>' + i + '</span>';
        pagination.innerHTML = showPage;
    };

    // 過濾出每個地區的資料並新增到samearea中
    samearea = [];
    resultData.forEach(function(dis) {
        if (dis.Zone == userSelect) {
            samearea.push(dis);
        }
    });
    sameareaLen = samearea.length;

    // 呼叫顯示第一頁資料
    nowPage(0, 3, samearea);
}

//顯示內容資料
function nowPage(startPage, endPage, samearea) {

    //如果選到的範圍沒有資料，只插入標題，內容清空。
    if (sameareaLen == 0) {
        disTitle.textContent = userSelect;
        showContent = "";
        travelstr.innerHTML = showContent;
    }
    for (var x = startPage; x <= endPage; x++) {
        //資料顯示在頁面上
        showContent += '<li><img class="toppic" src="' + samearea[x].Picture1 + '"><h3>' + samearea[x].Name + '</h3><span>' + samearea[x].Zone + '</span><ul class="ul-detail"><li><img src="/play/image/icons_clock.png" alt=""><p>' + samearea[x].Opentime + '</p></li><li><img src="/play/image/icons_pin.png" alt=""><p>' + samearea[x].Add + '</p></li><li class="tagpic"><img src="/play/image/icons_phone.png" alt=""><p>' + samearea[x].Tel + '</p><div class="tagpic2"><img src="/play/image/icons_tag.png" alt="">' + samearea[x].Ticketinfo + '</div></li></ul></li>';

        travelstr.innerHTML = showContent;
    }
}
//監聽頁面按鈕
clickPage.addEventListener('click',
    function pageClick(e, startPage, endPage, current_page) {

        //每次更換頁面都先清空資料
        showContent = "";
        travelstr.innerHTML = showContent;
        //如果點到的地方不是頁數區域
        if (e.target.nodeName !== 'SPAN') { return; }

        //如果點到的是第n頁
        if (e.target.textContent == 2) {
            current_page = 2; //將現在的頁數賦予為2，以利計算開始、結束頁面
            //開始、結束頁面的公式
            startPage = (every_page * current_page) - every_page;
            endPage = (every_page * current_page) - 1;

        } else if (e.target.textContent == 3) {
            current_page = 3;
            startPage = (every_page * current_page) - every_page;
            endPage = (every_page * current_page) - 1;

        } else if (e.target.textContent == 4) {
            current_page = 4;
            startPage = (every_page * current_page) - every_page;
            endPage = (every_page * current_page) - 1;

        } else if (e.target.textContent == 1) {
            current_page = 1;
            startPage = (every_page * current_page) - every_page;
            endPage = (every_page * current_page) - 1;

        }
        //呼叫顯示資料內容
        nowPage(startPage, endPage, samearea);

    });

//監聽熱門行政區
var hotDis = document.querySelector('.hotDis');
//當按熱門行政區時，呼叫getResultData函式
hotDis.addEventListener('click', getResultData);
// 監聽change使用者選到的區域
town.addEventListener('change', getResultData);