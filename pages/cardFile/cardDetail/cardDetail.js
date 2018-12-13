// pages/cardFile/cardDetial/cardDetail.js
var util = require('../../../utils/util.js');
var network = require('../../../utils/network.js')
const requestUrl = require('../../../config')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    copyValue:'',//复制的文字值
    clickName:'-1',//要点击复制的文字
    cardInfo: null,     //名片信息详情
    isIphoneX: false,
    isIpx: app.globalData.isIpx,
    ifSelfCard: false,    //是否是自己创建的名片，如果是则展示编辑，如果不是则不展示编辑
    activity: false
  },
  editAction: function () {
    var that = this;
    if (that.data.ifSelfCard) {   //如果是自己的名片，则显示编辑里面的编辑和删除
      wx.showActionSheet({
        itemList: ['修改信息', '删除名片','存入通讯录'],
        success: function (res) {
          if (res.tapIndex == 0) {
            that.data.cardInfo.modify = true;
            that.data.cardInfo.isUpUserPhone = true;

            let editData = JSON.stringify(that.data.cardInfo);
            app.globalData.addMoreMes = [];
            app.globalData.cardCustomMessage2 = [];
           wx.navigateTo({
              url: '../../commonPage/handWrite/handWrite?editData=' + editData
            });
            return;
          }
          if (res.tapIndex == 1) {   //删除名片
            that.dialog.showDialog();
            return;
          }
          if (res.tapIndex == 2) {   //删除名片
            wx.addPhoneContact({
              firstName: util.getFirstName(that.data.cardInfo.cardName),//联系人姓名  
              lastName: util.getLastName(that.data.cardInfo.cardName),
              mobilePhoneNumber: that.data.cardInfo.cardPhone,//联系人手机号  
              organization: that.data.cardInfo.cardCompany,
              title: that.data.cardInfo.cardJob,
              email: that.data.cardInfo.cardEmail,
              addressStreet: that.data.cardInfo.cardAddress,
              success: function (res) {
                console.log(res);

              }
            });
            return;
          }

        }
      });
      return;
    }
    // 这里是展示他人编辑页面
    wx.showActionSheet({
      itemList: ['删除名片','存入通讯录'],
      success: function (res) {
        if (res.tapIndex == 0) {  //删除名片
          that.dialog.showDialog();
          return;
        }
        if (res.tapIndex == 1) {   //存入通讯录
          wx.addPhoneContact({
            firstName: util.getFirstName(that.data.cardInfo.cardName),//联系人名  
            lastName: util.getLastName(that.data.cardInfo.cardName),   //联系人姓
            mobilePhoneNumber: that.data.cardInfo.cardPhone,//联系人手机号  
            organization: that.data.cardInfo.cardCompany,
            title: that.data.cardInfo.cardJob,
            email: that.data.cardInfo.cardEmail,
            addressStreet: that.data.cardInfo.cardAddress,
            success: function (res) {
              console.log(res);
            }
          });
          return;
        }

      }
    })

  },

  // 点击复制之外的地方复制隐藏
  clickOther:function(e){
    if (e.target.dataset.copy == undefined){
      this.setData({
        clickName: '',
        copyValue: ''
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.globalData.saveCardId = '';
    var passValue = decodeURIComponent(options.cardInfo);
    var cardDetail = JSON.parse(passValue);
    if (cardDetail.cardCustomMessage) {
      var jsValue = JSON.parse(cardDetail.cardCustomMessage);
      cardDetail.cardCustomMessage = jsValue;
    }
    if (!cardDetail.receiveUid || cardDetail.receiveUid == null) {   //这里根据接收人id判断是否展示编辑中的修改选项，
      this.setData({
        ifSelfCard: true
      })
    }
    if (cardDetail.cardName) {
      cardDetail.firstWord = cardDetail.cardName.substr(0, 1)
    }
    this.setData({
      cardInfo: cardDetail,
      isIphoneX: app.globalData.isIpx,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.dialog = this.selectComponent("#dialog");
  },
  deleteCreateCard: function () {   //删除创建的他人的名片
    wx.showLoading({
      title: "删除中",
      mask: true
    })
    var params = new Object();
    params.id = this.data.cardInfo.id;
    network.POST({
      params: params,
      requestUrl: requestUrl.deleteCardUrl,
      success: function (res) {
        wx.hideLoading();
        if (res.data.code != 0) {
          util.toast(res.data.message);
          return;
        }
        wx.showToast({
          title: '删除名片成功',
          mask: true,
          duration: 2000,
          complete: function () {
            app.globalData.isRefreshTagForCardFile = true;
            wx.navigateBack();
          }

        })
      },
      fail: function () {
        wx.hideLoading();
        util.toast('网络异常，请稍后再试');
      }
    })

  },
  fbackAction: function () {    //回递名片
    var mid = this.data.cardInfo.id;
    var that = this;
    if (!app.globalData.myCardCount || app.globalData.myCardCount == 0) {
      wx.showModal({
        title: "温馨提示",
        content: "您还没有创建过您自己的名片，请先去首页创建",
        confirmText: "去创建",
        success: function (res) {
          if (res.confirm) {
            wx.switchTab({      //如果没有名片，直接跳转到首页，让其去创建名片（通过点击创建名片按钮）
              url: "/pages/tabBar/index/index"
            })
          }
        }
      })
      return;
    }
    var receiveUid = that.data.cardInfo.cardUid;    //接收人的id
    var onlyOneCardId = wx.getStorageSync('isOneOwnCardListId');
    //如果自己有一张名片，则直接发送,不在执行选择名片case
    if (app.globalData.myCardCount && app.globalData.myCardCount == 1) {
      if (onlyOneCardId && onlyOneCardId != '') {
        that.reBackCard(receiveUid, onlyOneCardId,mid);
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
  reBackCard: function (recevieuid, onlyOneCardId,mid) {   //回递
    wx.showLoading({
      mask: true
    })
    var that = this;
    var params = new Object();

    params.cardId = onlyOneCardId;
    params.receiveUid = recevieuid;
    params.id = mid;     //mapping映射表的id 
    params.sendUid = app.globalData.uid;
    network.POST({
      params: params,
      requestUrl: requestUrl.returnCardUserMappingUrl,
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == 50005) {   //如果您与名片者互存了名片
          that.data.cardInfo.rightStatus = 1;   //状态标记为已互存
          util.toast(res.data.message);
          that.setData({
            cardInfo: that.data.cardInfo
          })
          return;
        }
        if (res.data.code != 0) {
          util.toast(res.data.message);
          return;
        }
        util.toast("回递成功");
        that.data.cardInfo.rightStatus = 2;   //状态标记为已发送
        app.globalData.isRefreshTagForCardFile = true;
        that.setData({
          cardInfo: that.data.cardInfo
        })
      },
      fail: function (res) {
        wx.hideLoading();
        util.toast("网络异常，请稍后再试");
      }
    })
  },
  transAction: function () {
  },
  // dailog action
  //取消事件
  _cancelEvent() {
    this.dialog.hideDialog();
  },
  //确认事件
  _confirmEvent() {     //点击下一步按钮触发的事件
    this.dialog.hideDialog();
    if (this.data.ifSelfCard) {   //删除自己的名片
      this.deleteCreateCard();
    } else {    //删除他人的名片
      this.deleteFriendCard();
    }
  },

//点击要复制的文案
  cilckWillCopy:function(e){
    console.log(e.currentTarget.dataset);
    var str = "" + e.currentTarget.dataset.index;
    var str1 = "" + e.currentTarget.dataset.value;
    this.setData({
      clickName: str,
      copyValue: str1
    });
    console.log(this.data.clickName);
  },
// 点击复制
  copy:function(){
    var that = this;
      wx.setClipboardData({
        data: that.data.copyValue,
        success: function (res) {
          util.toast('复制成功');
          that.setData({
            clickName: '-1'
          });
        }
      })
  },
    // 长按手机号调用保存手机号
  makePhoneAction: function (e) {  //拨打电话
    var  that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.cardInfo.cardPhone
    })
  },
  // 删除他人回递过来的名片或者自己收藏的名片
  deleteFriendCard: function () {
    wx.showLoading({
      title: "删除中",
      mask: true
    })
    var params = new Object();
    params.id = this.data.cardInfo.id;
    network.POST({
      params: params,
      requestUrl: requestUrl.deleteOthersCardUrl,
      success: function (res) {
        wx.hideLoading();
        if (res.data.code != 0) {
          util.toast(res.data.message);
          return;
        }
        wx.showToast({
          title: '删除名片成功',
          mask: true,
          duration: 2000,
          complete: function () {
            app.globalData.isRefreshTagForCardFile = true;
            wx.navigateBack();
          }

        })
      },
      fail: function () {
        wx.hideLoading();
        util.toast('网络异常，请稍后再试');
      }
    })
  },
  /**
 * 用户点击右上角分享
 */
  onShareAppMessage(res) {
    var that = this;
    let cardShareInfo = {};
    cardShareInfo.sendUid = app.globalData.uid;   //转发人的uid,不是card所有人id
    cardShareInfo.activityId = app.globalData.getActivityData.id;
    cardShareInfo.cardId = that.data.cardInfo.cardId;
    if (!cardShareInfo.cardId) {
      util.toast("服务异常，请稍后再试");
    }
    cardShareInfo = JSON.stringify(cardShareInfo);
    console.log(cardShareInfo);
    if (JSON.stringify(app.globalData.getActivityData) != "{}" && app.globalData.getActivityData != undefined) {    //这里用来请求用户数据
      that.setData({
        activity: true
      });
      //ZG
    } else {   //这里用来处理异步请求数据过来后的处理
      app.userActivityReadyCallBack = getActivityData => {
        if (getActivityData) {
          that.setData({
            activity: true
          });
        } 
      }
    }
    var title = '';
    if (that.data.activity && that.data.activity != undefined) {
      title = '点击保存该名片到通讯录，参加活动免费拿iPhone8。';
    } else {
      title = '您好，这是' + that.data.cardInfo.cardName + '电子名片，点击存入手机通讯录';
    }
    // var title = '您好，这是' + that.data.cardInfo.cardName + '电子名片，点击存入手机通讯录';
    var shareObj = {
      title: title,
      path: '/pages/shareOpen/index?cardShareInfo=' + cardShareInfo,
      success: function (res) {
      },
      fail: function (res) {
      }
    };
    if (res.from == 'button') {
      shareObj.path = '/pages/shareOpen/index?cardShareInfo=' + cardShareInfo;
    }
    return shareObj;
  }
})