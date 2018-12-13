//logs.js
var network = require('../../../utils/network.js')
const requestUrl = require('../../../config')
const util = require('../../../utils/util.js')

var app = getApp();
Page({
  data: {
    logs: [],
    ifHaveCard: false,    //是否有名片  true：有, false表示没有
    cardList: [],    //card列表
    needReceiveCardCount: 0,     //待接收名片个数
    saveCardId: '',
    touchStart: 0,
    isOne: true//待接收是否是个位数
  },
  onLoad: function (options) {
    app.globalData.isRefreshTagForCardFile = true;    //
  },
  onShow: function (res) {
    if (app.globalData.myCardCount == -1) {   //如果用户直接进入到了名片夹，则发起请求当前登录用户名片数据
      this.getUseCardList();
    }
    //这里添加从相机或者相册进入前天是否刷新判断
    if (app.globalData.isRefreshTagForCardFile) {   //如果为true则刷新，不为true则不刷新
      var isCameraAndAlbumEnter = app.globalData.isChoosetoforgroundTag;
      if (isCameraAndAlbumEnter == 4) {   //从拍照、从相册进入到这个页面的时候，不进行刷新
        app.globalData.isChoosetoforgroundTag = 0;
        return;
      } else {
      }
      app.globalData.isRefreshTagForCardFile = false;    //
      if (app.globalData.uid && app.globalData.uid != 0) {
        this.getCardList(false);
      } else {
        app.userInfoReadyCallBack = res => {
          this.getCardList(false);
        }
      }
    }
  },
  onHide: function () {
    this.dialog.hideDialog();
  },
  sendCardAction: function (e) {
    if (!app.globalData.myCardCount || app.globalData.myCardCount == 0) {
      wx.showModal({
        title: "温馨提示",
        content: "您还没有创建过您自己的名片，请先去首页创建",
        confirmText: "去创建",
        success: function (res) {
          if (res.confirm) {
            // 没有创建名片时，这里需要代码切换到首页，用户自己手动去点击创建新名片按钮创建
            wx.switchTab({
              url: "/pages/tabBar/index/index"
            })
          }
        }
      })
      return;
    }
    var receiveUid = e.currentTarget.dataset.receiveuid;
    var mid = e.currentTarget.dataset.mid;
    var onlyOneCardId = wx.getStorageSync('isOneOwnCardListId');
    //如果自己有一张名片，则直接发送,不在执行选择名片case
    if (app.globalData.myCardCount && app.globalData.myCardCount == 1) {
      if (onlyOneCardId && onlyOneCardId != '') {
        this.reBackCard(receiveUid, onlyOneCardId, mid);
      } else {
        util.toast('系统异常，请稍后再试');
      }
      return;
    }
    //如果自己有多张名片，就跳转到多张选择页面
    wx.navigateTo({
      url: "../../cardFile/myCardList/myCardList?receiveUid=" + receiveUid + '&mappingId=' + mid
    })
  },
  goReceive: function () {
    wx.navigateTo({
      url: "../../cardFile/receivingCardList/receivingCardList"
    })
  },
  //获取用户自己名片列表、、这里不用展示loading
  getUseCardList: function () {
    let params = new Object();
    params.uid = wx.getStorageSync("UIDKEY");
    var that = this;
    network.POST(
      {
        params: params,
        requestUrl: requestUrl.getSimpleCardByConditionUrl,
        success: function (res) {
          if (res.data.code == 0) {
            app.globalData.myCardCount = res.data.data.length;
            if (res.data.data.length == 1) {
              wx.setStorageSync("isOneOwnCardListId", res.data.data[0].id);
            }
          } else {
            util.toast(res.data.message);
          }
        },
        fail: function (res) {
          util.toast("网络异常, 请稍后再试");
        }
      })
  },
  reBackCard: function (recevieuid, onlyOneCardId, mid) {
    wx.showLoading({
      mask: true
    })
    var that = this;
    var params = new Object();
    params.cardId = onlyOneCardId;
    params.receiveUid = recevieuid;
    params.id = mid;
    params.sendUid = app.globalData.uid;
    network.POST({
      params: params,
      requestUrl: requestUrl.returnCardUserMappingUrl,
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == 50005) {   //如果您与名片者互存了名片
          util.toast(res.data.message);
          that.getCardList(true);
          return;
        }
        if (res.data.code != 0) {
          util.toast(res.data.message);
          return;
        }
        wx.showToast({
          title: '回递成功',
          duration: 2000,
          success: function () {
            that.getCardList(true);
          }
        })
      },
      fail: function (res) {
        wx.hideLoading();
        util.toast("网络异常，请稍后再试");
      }
    })
  },
  //***********************boo为是否刷新,true为刷新加载，false为正常加载******************** */
  getCardList: function (boo) {   //获取名片列表
    this.data.cardList = [];
    var that = this;
    var params = new Object();
    params.receiveUid = wx.getStorageSync("UIDKEY");
    params.status = '1,2,5';
    if (!boo) {
      wx.showLoading({
        mask: true
      });
    }
    network.POST({
      params: params,
      requestUrl: requestUrl.getCardListUrl,
      success: function (res) {
        boo ? wx.stopPullDownRefresh() : wx.hideLoading();
        if (res.data.code != 0) {
          util.toast(res.data.message);
          return;
        }
        if (res.data.waitReceviceTotal > 9) {
          that.setData({
            isOne: false
          })
        }
        if (res.data.waitReceviceTotal > 99) {
          res.data.waitReceviceTotal = 99 + '+';
        }
        that.setData({
          needReceiveCardCount: res.data.waitReceviceTotal
        });

        if (res.data.data.length == 0) {
          that.setData({
            ifHaveCard: false
          });
          return;
        }
        that.setData({
          ifHaveCard: true,
        })
        var isGoDetail = false;
        var cardInfo = '';
        for (var item in res.data.data) {
          var bigItemInfo = new Object();   //这个是数组里面的内容
          var ttitem = Object.keys(res.data.data[item]);   //获取Key
          bigItemInfo.key = ttitem;
          bigItemInfo.values = [];
          var keywordValues = res.data.data[item][ttitem];     //获取某个Key里面的value
          var obj = JSON.parse(keywordValues)    //解析出来keyvalue中的多个联系人信息，是一个数组 
          for (var i in obj) {
            var item = obj[i];
            if (item.cardCompany && item.cardCompany.length > 18) {   //字符串截取
              item.tempCardCompany = item.cardCompany.slice(0, 15) + "...";
            } else {
              item.tempCardCompany = item.cardCompany;
            }
            if (item.status == 5) {    //已接收
              if (item.isOwnCard == 1) {   //如果是自己创建的名片，就显示回递名片
                item.rightStatus = 5;
              } else {    //否则不显示任何东西
                item.rightStatus = 3;
              }
            } else if (item.status == 1) {   //已互存
              item.rightStatus = 1;

            } else if (item.status == 2) {
              item.rightStatus = 2;
            } else {
              item.rightStatus = 3;
            }
            bigItemInfo.values.push(item);
            if (item.cardId == app.globalData.saveCardId) {
              app.globalData.saveCardId = '';
              isGoDetail = true;
              cardInfo = encodeURIComponent(JSON.stringify(obj[i]));
            }
          }
          that.data.cardList.push(bigItemInfo);
        }
        that.setData({
          cardList: that.data.cardList,
        });
        if (isGoDetail == true) {
          isGoDetail = false;
          wx.navigateTo({
            url: '../../cardFile/cardDetail/cardDetail?cardInfo=' + cardInfo
          })
        }
      },
      fail: function (res) {
        boo ? wx.stopPullDownRefresh() : wx.hideLoading();
        util.toast("网络异常，请稍后再试");
      }
    })
  },
  goToDetail: function (e) {   //点击进入详情页
    var cardInfo = encodeURIComponent(JSON.stringify(e.currentTarget.dataset.cardinfo));
    wx.navigateTo({
      url: '../../cardFile/cardDetail/cardDetail?cardInfo=' + cardInfo
    });
  },
  //******************************************* */
  clackReceive: function () {
    this.setData({
      select: false
    });
  },
  clackReceive1: function () {
    wx.navigateTo({
      url: '/pages/cardFile/cardDetial/cardDetail'
    })
    this.setData({
      select: true
    })
  },
  // 点击批量导入
  batchImport: function () {
    wx.navigateTo({
      url: '/pages/cardFile/batchImport/batchImport'
    })
  },
  //点击快速上传
  fastUpload: function () {
    this.dialog.showDialog();
    wx.hideTabBar({
      success: function (res) {
      }
    });
    this.setData({
      isCreatCard: true
    })
  },

  //以下是公共部分  接下来封装 到88行
  _cancelEvent() {
    this.dialog.hideDialog();
  },

  onReady: function () {
    //获得dialog组件
    this.dialog = this.selectComponent("#dialog");
  },

  onPullDownRefresh: function () {
    this.getCardList(true);
  },

})
