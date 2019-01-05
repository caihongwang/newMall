const network = require('network')
const requestUrl = require('../config.js');
// 将时间戳转换成日期格式
function timestampToTime(timestamp) {
  // var date = new Date(parseInt(timestamp)).toLocaleString();//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var date = new Date(parseInt(timestamp));//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)+'&';
  var D = date.getDate();
  // h = date.getHours() + ':';
  // m = date.getMinutes() + ':';
  // s = date.getSeconds();
  return M+D;
}

function isNull(str) {
  return !str && str !== 0 && typeof str !== "boolean" ? true : false;
}

function getNowFormatDate() {
  var date = new Date();
  var seperator1 = "-";
  var year = date.getFullYear(); //年
  var month = date.getMonth() + 1; //月
  var strDate = date.getDate(); //日
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }

  var hh = date.getHours();            //时  
  var mm = date.getMinutes();          //分  

  var currentdate = year + seperator1 + month + seperator1 + strDate + ' ' + hh + ':' + mm;
  return currentdate;
}


const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function toast(str) {
  if (!str || str == "") {
    return;
  }
  wx.showToast({
    title: str,
    icon: 'none',
    duration: 2000,
  })
}

function chooseWxImage(type, isFirst,number, isOwnCard, userPhone, isGoWrite, beforeEditData, modify) {
  getApp().globalData.isChoosetoforgroundTag = 4;   //判断从拍照、从相册选择页面进入的标识，用来判断名片夹列表页是否更新。
  wx.chooseImage({
    count: 1,
    sizeType: ['original', 'compressed'],
    sourceType: [type],
    success: function (res) {
      // var isNewAdd = {};
      // isNewAdd.number = number;
      // isNewAdd.tempFilePath = res.tempFilePaths[0];
      // isNewAdd.isOwnCard = isOwnCard;
      // isNewAdd.modify = modify;
      // isNewAdd.userPhone = userPhone;
      // isNewAdd.isGoWrite = isGoWrite;
      // if (beforeEditData) {
      //   isNewAdd.beforeEditData = beforeEditData;
      // };
      // var tempFilePath = JSON.stringify(isNewAdd);
      // wx.navigateTo({
      //   url: '/pages/commonPage/clipPicture/index?tempFilePath=' + tempFilePath
      // })
          var isNewAdd = {};
          isNewAdd.isNewAdd = number;
          isNewAdd.imageSrc = res.tempFilePaths[0];
          isNewAdd.isOwnCard = isOwnCard;
          isNewAdd.modify = modify;
          isNewAdd.cardPhone = userPhone;
          isNewAdd.isGoWrite = isGoWrite;
          // console.log(beforeEditData);
          if (beforeEditData) {
            isNewAdd.beforeEditData = beforeEditData;
          };
          // console.log(isNewAdd.beforeEditData);
          console.log(isNewAdd);
          var tempFilePath = JSON.stringify(isNewAdd);

          if (isFirst == 1){
            wx.navigateTo({
              url: '/pages/commonPage/handWrite/handWrite?tempFilePath=' + tempFilePath
            })
            return;
          }
          wx.navigateTo({
            url: '/pages/commonPage/handWrite/handWrite?tempFilePath=' + tempFilePath
          })
    
    }
  })
}

function getLastName(str) {   //得到姓氏
  if (str && str.length <= 1) {
    return null; 
  }
  return str.substring(0,1);

}
function getFirstName(str) {   //得到名字
  if (str && str.length <= 1) {
    return str;
  }
  return str.substring(1,str.length);
}

module.exports = {
  // formatTime: formatTime,
  toast: toast,
  chooseWxImage: chooseWxImage,
  getNowFormatDate: getNowFormatDate,
  getLastName: getLastName,
  getFirstName: getFirstName,
  timestampToTime: timestampToTime
  // saveFormId: saveFormId
}
