const requestUrl = require('../config')
const network = require('network.js');

//更新用户信息

function updateUserInfo(info) {   //里面需要传入wx.getUserInfo请求的信息
    if (!wx.getStorageSync("UIDKEY")) {
        return;
    }
    var params = new Object();
    params.encryptedData = info.encryptedData;
    params.iv = info.iv;
    params.rawData = info.rawData;
    params.userInfo = JSON.stringify(info.userInfo);
    console.log("马上进入保存用户信息");
    network.POST({
        params: params,
        requestUrl: requestUrl.updateUserInfoUrl,
        success: function (res) {
            console.log(res);
        },
        fail: function (res) {
            console.log("保存用户信息失败");
        }
    });
}

function updateAgainUserInfo() {   //里面需要传入wx.getUserInfo请求的信息
  if (!wx.getStorageSync("UIDKEY")) {
    return;
  }
  wx.getUserInfo({
    success: function (res) {
      wx.setStorageSync("USERINFO", res.userInfo);
      var params = new Object();
      params.encryptedData = res.encryptedData;
      params.iv = res.iv;
      params.rawData = res.rawData;
      params.userInfo = JSON.stringify(res.userInfo);
      console.log("马上进入保存用户信息");
      network.POST({
        params: params,
        requestUrl: requestUrl.updateUserInfoUrl,
        success: function (res) {
          console.log(res);
        },
        fail: function (res) {
          console.log("保存用户信息失败");
        }
      });
    
    },
    fail: function () {   //用户拒绝了微信授权头像和昵称
    }
  })
  
}
//添加form id
function addFormId(formid) {
    if (!wx.getStorageSync("UIDKEY")) {
        return;
    }
    var params = new Object();
    params.formId = formid;
    network.POST({
        params: params,
        requestUrl: requestUrl.addFormIdUrl,
        success: function (res) {
            if (res.data.code == 0) {
                console.log('保存formid成功');
            } else {
                console.log("保存formid失败");
            }

        },
        fail: function (res) {
            console.log("保存formId失败");
        }
    });

}
module.exports = {
    updateUserInfo: updateUserInfo,
    addFormId: addFormId,
    updateAgainUserInfo: updateAgainUserInfo
}
