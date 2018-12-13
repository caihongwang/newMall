// pages/commonPage/addMoreMessage/addMoreMessage.js
var network = require('../../../utils/network.js');
var util = require('../../../utils/util.js');
var requestUrl = require('../../../config.js');
var app = getApp()

Page({
  data: {
    isMore: true,
    isCanClick: false,
    canAdd: false,
    k: 0,
    value: '',
    storageArr: [],
    more: [],
    inputValue: '',//绑定的输入框文本
    haveGetInfo: {},
    isIpx: app.globalData.isIpx

  },
  focus: function (e) {  //添加更多标签失去焦点
    this.setData({
      value: e.detail.value//将input至与data中的inputValue绑定
    });
    if (e.detail.value.length > 0) {
      this.setData({
        canAdd: true,
      });
    } else {
      this.setData({
        canAdd: false,
      });
    }
  },
  sureAdd: function () {   //点击确定添加标签
    // 是否是表情的正则判断
    var reg1 = new RegExp(/[~#^$@%&!*()<>:;'"{}【】˶ ᶘ ᵒᴥ ]/gi); //判断是否有特殊字符
    var reg2 = new RegExp(/\ud83c[\udf00-\udfff]|\ud83d[\udc00-\ude4f]|\ud83d[\ude80-\udeff]/g);  //判断是否是表情的字符
    // /\ud83c[\udf00-\udfff]|\ud83d[\udc00-\ude4f]|\ud83d[\ude80-\udeff]/g
    // var reg1 = new RegExp (/^(?:\[[^\[\]] +\])+ $/);
    // console.log(reg1.test(this.data.value));
    if (reg1.test(this.data.value) || reg2.test(this.data.value)) {
      util.toast('标签输入不合法，请重新输入');
    } else {
      var that = this;
      var value = wx.getStorageSync('newAdd');
      if (!value || value.value.length < 50) {
        if (value.value) {
          that.data.storageArr = value.value;
        }
        var haveName = false;
        for (var i in this.data.more) {
          if (haveName == false) {
            if (this.data.more[i].dicName == this.data.value) {
              haveName = true;
            }
          }
        }
        if (haveName == false) {
          var list = {};
          list.dicName = this.data.value;
          list.isChecked = false;
          list.isCanClick = false;
          this.data.more.push(list);
          app.globalData.arr2.push(1);
          this.data.storageArr.push(list);
          var storageArrValue = {};
          storageArrValue.value = this.data.storageArr;
          wx.setStorageSync("newAdd", storageArrValue);

        } else {
          wx.showToast({
            title: '已有此标签',
            icon: 'none',
            duration: 2000
          })
        }
        this.setData({
          value: '',
          more: this.data.more,
          canAdd: false,
        });
      } else {
        util.toast('该标签可添加数量已达上限');
      }
    }

  },
  clickAdd: function (e) {   //点击选择要添加的标签
    var arr = []
    arr = this.data.more;
    var index = e.target.dataset.index;
    if (app.globalData.arr2[index] < 7) {
      arr[index].isChecked = !arr[index].isChecked;
    } else {
      arr[index].isChecked = false;
    }
    var isCanSure = false;
    for (var i in arr) {
      if (arr[i].isChecked == true) {
        isCanSure = true;
      }
    }
    if (isCanSure == false) {
      this.setData({
        isCanClick: false
      });
    } else {
      this.setData({
        isCanClick: true
      });
    }
    this.setData({
      more: arr
    })
  },
  sure: function () {   //点击确定添加标签
    for (var i in this.data.more) {
      if (this.data.more[i].isChecked == true) {
        var name = {}
        name.name1 = this.data.more[i].dicName + app.globalData.arr2[i];
        name.dicName = this.data.more[i].dicName;
        app.globalData.addMoreMes.push(name);
        app.globalData.arr2[i] = app.globalData.arr2[i] + 1;
        if (app.globalData.arr2[i] > 6) {
          this.data.more[i].canClick = true;
          this.setData({
            more: this.data.more
          })
        } else {
          this.data.more[i].isChecked = false;
          this.data.k = this.data.k + 1;
        }
      }
    }
    // console.log(app.globalData.arr2[i]);
    this.setData({
      isMore: false,
      more: this.data.more
    });
    wx.navigateBack({
    })
    return;
  },

  /**
    * 生命周期函数--监听页面加载
    */
  onLoad: function (options) {
    wx.showLoading({
      mask: true
    });
    app.globalData.arr2 = [];
    if (options.cardCustomMessage && options.cardCustomMessage != undefined) {
      // console.log(options.cardCustomMessage);
      let haveGetInfo = JSON.parse(options.cardCustomMessage);
      // console.log(haveGetInfo);
      this.getMoreList(false, haveGetInfo);
    } else {
      this.getMoreList(false);

    }
  },

  getMoreList: function (boo, haveGetInfo) {  //从后台获取可以要添加的标签和从本地取到已经新增的标签
    if (!boo) {
      wx.showLoading({
        title: '加载中',
        mask: true
      });
    }
    var beforeAdd = [];
    var value = wx.getStorageSync('newAdd')
    if (value.value) {
      beforeAdd = value.value;
    }
    var that = this;
    let params = new Object();
    params.dicType = 'infoItem';
    network.POST(
      {
        params: params,
        requestUrl: requestUrl.getSimpleDicByConditionUrl,
        success: function (res) {
          boo ? wx.stopPullDownRefresh() : wx.hideLoading();
          if (res.data.code == 0) {
            // console.log(res.data.data);
            if (res.data.data) {
              for (var i in res.data.data) {
                app.globalData.arr2.push(1);
                res.data.data[i].isChecked = false;
                res.data.data[i].canClick = false;
              }
              that.setData({
                more: res.data.data
              })
              wx.hideToast();
            }

          } else {
            util.toast(res.data.message);
          }
          if (beforeAdd.length != 0) {
            for (var i in beforeAdd) {
              app.globalData.arr2.push(1);
              that.data.more.push(beforeAdd[i]);
            }
          }
          // console.log(that.data.more);
          if (haveGetInfo) {
            for (var i in that.data.more) {
              for (var j in haveGetInfo) {
                if (that.data.more[i].dicName == haveGetInfo[j].dicName) {
                  app.globalData.arr2[i]++;
                }
              }
            }
          }
          // console.log(app.globalData.arr2);

          that.setData({
            more: that.data.more
          })
          // console.log(that.data.more);
          for (var i in that.data.more) {
            if (app.globalData.arr2[i] > 6) {
              that.data.more[i].canClick = true;
              that.data.more[i].isChecked = false;
              that.setData({
                more: that.data.more
              })
            }
          }

        },
        fail: function (res) {
          boo ? wx.stopPullDownRefresh() : wx.hideLoading();
          util.toast("网络异常，请稍后再试");
        }
      });
  },
  onPullDownRefresh: function () {
    // console.log("开始下拉刷新");
    this.getMoreList(true);
  },
  onShow: function () {
  }
})