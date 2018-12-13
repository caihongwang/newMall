// pages/howFind/index.js
var network = require('../../utils/network.js');
var util = require('../../utils/util.js');
var requestUrl = require('../../config.js');
var netool = require('../../utils/netool.js')

var app = getApp();
Page({
  data: {
    isIpx: app.globalData.isIpx, //判断是否是iphonex
    copyValue: '',//复制的文字值
    clickName: '-1',//要点击复制的文字
    a: 1,
    isHaveDelete: false,     //改名片是否被删除，根据cardStatus判断0是未删除，1是已删除
    mailList: false,//保存到名片夹
    isHaveSave: false, //判断名片是否被收藏
    isMySelf: false,//判断是否是自己收藏的名片
    isStillExist: false,//判断自己创建的是否还存在
    cardShareInfo: {},
    ifSelfCreateOther: false,   //是否是自己创建的别人的名片，如果是则跳到名片夹   
    seeDetail: false, //点击查看名片详情 
    info: {},
    "data": { // 发送模板消息的data
      "keyword1": {
      },
      "keyword2": {
      },
      "keyword3": {
      }
    },
    isShowShare: false, //上来加载时让本页面不显示
    disabled: false,//保存按钮是否可点击
    activity:false, //是否有点选进入活动的按钮
    // singUpPopup:false, //是否展示报名参加的弹窗 true为展示
    activityId:'',
    onlyPersonImage: '',//是否只是唯一的个人
  },
  goActivity: function (res) {
    if (res.detail.userInfo) {
      var that = this;
      let activityInfo = {};
      activityInfo.activityId = that.data.activityId;   //activity Id
      var activityStr = JSON.stringify(activityInfo);
      wx.navigateTo({
        // 跳转到一个选择列表的页
        url: '/pages/activity/index?activityInfo=' + activityStr
      })
      netool.updateAgainUserInfo();
    } else {
      uitl.toast("我们在活动中需要使用您的昵称头像，请允许后再试");
    }
  },
  formSubmit: function (e) {   //提交，如果当前不是自己，并且自己没有收藏过这个名片，就会触发这个事件
    var that = this;
    var params = new Object();
    var cardShareInfo = {};
    params.sendUid = this.data.cardShareInfo.sendUid;
    params.cardId = this.data.cardShareInfo.cardId;
    params.receiveUid = app.globalData.uid;
    params.formId = e.detail.formId;
    if (app.globalData.getActivityData && JSON.stringify(app.globalData.getActivityData != '{}')
    ) {
      params.activityId = app.globalData.getActivityData.id;
    } else {
      app.userActivityReadyCallBack = (getActivityData) => {
        params.activityId = getActivityData;
      }
    }

    if (e.detail.target.dataset.value == 'phone') {    //存入通讯录
      wx.addPhoneContact({
        lastName: util.getLastName(that.data.info.cardName),
        firstName: util.getFirstName(that.data.info.cardName),//联系人姓名  
        mobilePhoneNumber: that.data.info.cardPhone,//联系人手机号  
        organization: that.data.info.cardCompany,
        title: that.data.info.cardJob,
        email: that.data.info.cardEmail,
        addressStreet: that.data.info.cardAddress,
        success: function (res) {
          if (that.data.info.isOwnCard == 1 && that.data.info.uid == app.globalData.uid) {   //如果是自己的名片，就不保存
            console.log("自己创建的自己的名片，不用保存");
            return;
          }
          if (that.data.isStillExist) {   //自己点击存自己的信息到通讯录
            console.log("是自己创建的");
            // if (that.data.ifSelfCreateOther) {    //   如果是创建他人的
              console.log("自己创建的他人的");
              if (that.data.isHaveDelete) {   //已经删除
                console.log("已经删除");
                app.globalData.saveCardId = that.data.cardShareInfo.cardId;
                network.POST(
                  {
                    params: params,
                    requestUrl: requestUrl.addCardUserMappingUrl,
                    success: function (res) {
                      if (res.data.code == 0) {
                        that.setData({
                          mailList: false,
                          seeDetail: true,
                          isMySelf: false
                        });
                      }
                    },
                    fail: function (res) {
                    }
                  });
              } else {   //没有删除
                console.log("存入到名片夹");
                app.globalData.saveCardId = that.data.cardShareInfo.cardId;
                if (!that.data.isHaveSave) {    //没有存过
                  network.POST(
                    {
                      params: params,
                      requestUrl: requestUrl.addCardUserMappingUrl,
                      success: function (res) {
                        if (res.data.code == 0) {
                          that.setData({
                            mailList: false,
                            seeDetail: true,
                            isMySelf: false
                          });
                        }
                      },
                      fail: function (res) {
                      }
                    });
                }
                return;
              }
            // } else {   //创建自己的
            //   console.log("不用处理");
            // }
            console.log("自己的名片，不用存入到名片夹");
            return;
          }
         
        }
      });
      return;
    }
    //下面操作是存入名片夹
    this.setData({    //所有按钮不可点击状态
      disabled: true
    });
    wx.showLoading({
      mask: true
    });
    network.POST(
      {
        params: params,
        requestUrl: requestUrl.addCardUserMappingUrl,
        success: function (res) {
          wx.hideLoading();
          if (res.data.code == 0) {
            that.sendTempleMessageAction(e);
            util.toast('保存名片成功!');
            // that.setData({   //设置保存状态
            //   isHaveSave: true,
            //   isWillHaveSave: false,
            //   mailList:false
            // })
            //开发发送模板消息
            app.globalData.saveCardId = that.data.cardShareInfo.cardId;

            wx.switchTab({   //存入名片夹成功，直接跳转到详情页
              url: '/pages/tabBar/cardFile/cardFile',
            });
          } else {
            that.setData({
              disabled: false
            });
            util.toast(res.data.message);
          }
        },
        fail: function (res) {
          this.setData({
            disabled: false
          });
          wx.hideLoading();
          util.toast("网络异常, 请稍后再试");
        }
      })
  },
  // 点击复制之外的地方复制隐藏
  clickOther: function (e) {
    if (e.target.dataset.copy == undefined) {
      this.setData({
        clickName: '',
        copyValue: ''
      });
    }
  },
  goCardList: function () { //进入小程序
    app.globalData.saveCardId = '';
    wx.switchTab({
      url: '/pages/tabBar/index/index',
    })

  },
  //发送模板消息   TODO模板消息需要更改
  sendTempleMessageAction: function (e) {
    console.log(this.data.cardShareInfo);
    var userInfo = wx.getStorageSync('USERINFO');
    var that = this;
    let params1 = new Object()
    console.log(e.detail.formId);
    params1.page = 'pages/tabBar/index/index';
    params1.template_id = 'so4YFEEr1rGm20UMP2pGqxm5OcYZ0511no6MRZSKwn0';
    params1.receiveUid = that.data.cardShareInfo.sendUid;    //接收人的uid
    that.data.data.keyword1.value = userInfo.nickName;   //收藏人
    that.data.data.keyword1.color = "#000000";
    that.data.data.keyword2.value = util.getNowFormatDate();   //收藏时间
    that.data.data.keyword2.color = "#000000";

    that.data.data.keyword3.value = '您的名片已经被' + userInfo.nickName + '（先生/女士）收藏。如果名片信息有变更，请重新给好友递名片。'  //备注
    that.data.data.keyword3.color = "#000000";
    that.setData({
      data: that.data.data
    });
    params1.data = JSON.stringify(that.data.data);
    console.log(params1);
    network.POST(
      {
        params: params1,
        requestUrl: requestUrl.sendTemplateMessageUrl,
        success: function (res) {   //不管发送成功与否，都不会产生异常。这样不会影响用户使用
        }
      })
  },
  selfOpen: function () {
    app.globalData.saveCardId = this.data.cardShareInfo.cardId;
    console.log(app.globalData.saveCardId);
    if (this.data.ifSelfCreateOther) {    //如果是创建别人的
      wx.switchTab({
        url: '/pages/tabBar/cardFile/cardFile',
      });
      return;
    }
    wx.switchTab({
      url: '/pages/tabBar/index/index',
    });
  },
  seeDetail: function () {
    app.globalData.saveCardId = this.data.cardShareInfo.cardId;
    wx.switchTab({
      url: '/pages/tabBar/cardFile/cardFile',
    })
  },
  //点击要复制的文案
  cilckWillCopy: function (e) {

    console.log(e.currentTarget.dataset);
    var str = "" + e.currentTarget.dataset.index;
    var str1 = "" + e.currentTarget.dataset.value;
    console.log(str);
    this.setData({
      clickName: str,
      copyValue: str1
    });
    console.log(this.data.clickName);
  },
  // 点击复制
  copy: function () {
    var that = this;
    console.log(that.data.copyValue);
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
    var that = this;
    //  提示呼叫号码还是将号码添加到手机通讯录  
    wx.makePhoneCall({
      phoneNumber: that.data.info.cardPhone
    })

  },
  getShareInfo: function (session,uid) {  //得到分享过来的列表数据
    var that = this;
    var paramsShare = new Object();
    var cardShareInfo = {};
    cardShareInfo = this.data.cardShareInfo;
    paramsShare.id = cardShareInfo.cardId;
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    // 调用列表的接口，通过cardid获取card详情
    network.POST(
      {
        params: paramsShare,
        requestUrl: requestUrl.getSimpleCardByConditionUrl,
        success: function (res) {
          console.log(res.data.data);
          var date = new Date();
          var now = date.getTime();
          if (res.data.code == 0) {
            that.setData({   //设置整体要展示的信息
              isShowShare: true,
            });
            if (res.data.data[0].logoUrl && res.data.data[0].logoUrl != undefined){
              that.setData({
                onlyPersonImage: res.data.data[0].logoUrl
              })
            }
            console.log(that.data.onlyPersonImage);
            var arr = [];
            if (res.data.data[0].cardCustomMessage && res.data.data[0].cardCustomMessage.length !== 0) {
              arr = JSON.parse(res.data.data[0].cardCustomMessage);
              res.data.data[0].cardCustomMessage = [];
              res.data.data[0].cardCustomMessage = arr;
            }
            that.setData({   //设置整体要展示的信息
              info: res.data.data[0]
            });
            if (that.data.info.cardStatus && that.data.info.cardStatus == 1) {  //如果该名片已经删除，则展示删除信息
              that.setData({
                isHaveDelete: true
                // mailList: true,
                // isMySelf: false,
                // seeDetail:false,
              });
              
            }else{
              that.setData({
                isHaveDelete: false
                // mailList: true,
                // isMySelf: false,
                // seeDetail:false,
              });
            }
            console.log(cardShareInfo.sendUid);
            console.log(uid);
            console.log(app.globalData.uid);

            if (cardShareInfo.sendUid != app.globalData.uid) {   //不是分享用户点击进入,不是自己打开
              console.log(that.data.info.uid == app.globalData.uid);
              if (that.data.info.uid == app.globalData.uid) {   //转发张三的的给张三。则相当于张三查看的是自己的名片
                console.log(that.data.info.isOwnCard);
                if (that.data.info.isOwnCard == 1) {   //创建自己的名片
                  wx.hideLoading();
                  that.setData({
                    isMySelf: true,
                    seeDetail: false,
                    mailList: false,
                    ifSelfCreateOther: false,
                  });
                  return;
                } else {   //创建他人的名片
                  if (that.data.isHaveDelete){
                    let params2 = new Object();
                    params2.sendUid = cardShareInfo.sendUid;
                    params2.cardId = cardShareInfo.cardId;
                    params2.receiveUid = app.globalData.uid;
                    // 调用是否收藏接口
                    network.POST(
                      {
                        params: params2,
                        requestUrl: requestUrl.checkIsSaveUrl,
                        success: function (res) {
                          wx.hideLoading();
                          if (res.data.code == 0) {   //该名片没有被收藏
                            that.setData({
                              seeDetail: false,
                              mailList: true,
                              // isMySelf: false,
                              ifSelfCreateOther: true,
                              isStillExist: true
                            });
                          } else if (res.data.code == 50004) {   //该名片已经被收藏
                            that.setData({
                              isHaveSave: true,
                              seeDetail: true,
                              mailList: false,
                              isMySelf: false,
                              isStillExist: false
                            });
                          } else {
                            util.toast(res.data.message);
                          }
                        },
                        fail: function (res) {
                          wx.hideLoading();
                          util.toast("网络异常, 请稍后再试");
                        }
                      });
                   
                }else{

                    that.setData({
                      seeDetail: true,
                      mailList: false,
                      isMySelf: false,
                      ifSelfCreateOther: true,
                      isStillExist: false
                    });
                }
                 
                }
                wx.hideLoading();
                // that.setData({
                //   isHaveSave: false,
                //   // mailList:false,
                //   // isMySelf: true,
                // });
                return;
              }
              console.log(3333);
              // that.setData({
              //   ifSelfCreateOther: true
              // });
              //别人发送给自己
              let params2 = new Object();
              params2.sendUid = cardShareInfo.sendUid;
              params2.cardId = cardShareInfo.cardId;
              params2.receiveUid = app.globalData.uid;
              // 调用是否收藏接口
              network.POST(
                {
                  params: params2,
                  requestUrl: requestUrl.checkIsSaveUrl,
                  success: function (res) {
                    wx.hideLoading();
                    if (res.data.code == 0) {   //该名片没有被收藏
                      that.setData({
                        mailList: true,
                        isMySelf:false,
                        seeDetail: false,
                        isStillExist: true,
                        isHaveDelete1:true,
                      });
                    } else if (res.data.code == 50004) {   //该名片已经被收藏
                      that.setData({
                        isHaveSave: true,
                        seeDetail: true,
                        mailList:false,
                        isMySelf:false,
                        isStillExist: false
                      });
                    } else {
                      util.toast(res.data.message);
                    }
                  },
                  fail: function (res) {
                    wx.hideLoading();
                    util.toast("网络异常, 请稍后再试");
                  }
                });
            } else {   //如果是自己分享的，则直接这只如下的信息
              wx.hideLoading();
              if (that.data.info.isOwnCard != 1 || that.data.info.uid != app.globalData.uid) {   //如果是创建自己的他人的名片名片
               console.log(32444);
                if (that.data.isHaveDelete) { //删除
                  that.setData({
                    ifSelfCreateOther: true,
                    isMySelf: false,
                    seeDetail: false,
                    mailList: true,
                    isStillExist:true
                  });
                }else {
                  that.setData({
                    ifSelfCreateOther: true,
                    isMySelf: true,
                    isStillExist:false,
                    seeDetail: false,
                    mailList: false,
                  });
                }
               
              } else  {   //分享的为创建自己的
                that.setData({
                  isMySelf: true,
                  ifSelfCreateOther: false,
                  mailList: false,
                  seeDetail: false
                });
                return;
              }
              //下面是自己进入创建他人的名片
              if (that.data.info.cardStatus && that.data.info.cardStatus == 1) {   //是自己的，并且已经删除，则展示保存
                var params2 = new Object();   //检测自己是否保存
                params2.sendUid = cardShareInfo.sendUid;
                params2.cardId = cardShareInfo.cardId;
                params2.receiveUid = app.globalData.uid;
                // 调用是否收藏接口
                network.POST(
                  {
                    params: params2,
                    requestUrl: requestUrl.checkIsSaveUrl,
                    success: function (res) {
                      wx.hideLoading();
                      if (res.data.code == 0) {   //改名片没有被收藏
                        that.setData({
                          mailList: true,
                          isMySelf:false,
                          seeDetail: false,
                          isStillExist: false

                        });
                      } else if (res.data.code == 50004) {   //该名片已经被收藏
                        that.setData({
                          isHaveSave: true,
                          seeDetail: true,
                          mailList:false,
                          isMySelf:false,
                          isStillExist: false
                        });
                      } else {
                        util.toast(res.data.message);
                      }
                    },
                    fail: function (res) {
                      wx.hideLoading();
                      util.toast("网络异常, 请稍后再试");
                    }
                  });
              } else {   //这里是创建他人的没有删除
                that.setData({
                  seeDetail: true,
                  isMySelf: false,
                  mailList: false,
                });
              }
            }
          } else {   //获取消息失败
            wx.hideLoading();
            util.toast(res.data.message);
          }
        },
        fail: function (res) {
          wx.hideLoading();
          util.toast("网络异常，请稍后再试");
        }
      })
  },
//  检测是否报名接口
  isSingUp: function (joinUid, activityId) {
    var that = this;
    var params = new Object();
    params.activityId = activityId.id;
    params.joinUid = joinUid;
    console.log(params);

    network.POST(
      {
        params: params,
        requestUrl: requestUrl.checkJoinActivityUrl,
        success: function (res) {
          if (res.data.code == 0) {  //未报名
          //   if (!wx.getStorageSync('isAgainShowSing')){
          //     that.setData({
          //       singUpPopup:true
          //     })
          //    }else{
          //     that.setData({
          //       singUpPopup: false
          //     })
          //    }
          // }else{
          //   that.setData({
          //     singUpPopup: false
          //   })
          }
        },
        fail: function (res) {
          util.toast("网络异常, 请稍后再试");
        }
      });

  },
  onLoad: function (options) {
    if (options.cardShareInfo) {
      var testData = {};
      testData = JSON.parse(options.cardShareInfo);
      this.setData({
        cardShareInfo: testData
      });
      if (testData.activityId ){
        this.setData({
          activityId: testData.activityId 
        });
      }
      // { "sendUid":"117", "cardId":"1224" }
      return;
    }
    // 扫描二维码获取的数据
    if (options.scene) {
      console.log(options.scene);

      var scene = decodeURIComponent(options.scene)
      var arrPara = scene.split("&");
      var arr = [];

      var testData = {};
      for (var i in arrPara) {
        arr = arrPara[i].split("=");
        if (i == 0) {
          testData.sendUid = arr[1];
        } else {
          testData.cardId = arr[1]
        }
      }
      console.log(testData);
      console.log(app.globalData.getActivityData.id);
      // var scene = decodeURIComponent(options.scene)
      this.setData({
        cardShareInfo: testData
      });
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  //检测活动是否正在进行
  checkActivityDoing: function () {
    var params = new Object();
    wx.showLoading({
      mask: true
    });
    params.activityId = this.data.activityId;
    network.POST({
      params: params,
      requestUrl: requestUrl.checkActivityDoingUrl,
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == 90008) {   //活动已失效
          util.toast("活动已经结束，请关注第二季");
          app.globalData.getActivityData = {};
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/tabBar/index/index'
            });
          }, 2000);
        }
      },
      fail: function (res) {
        wx.hideLoading();
        uitl.toast(res.msg);
      }
    });
  },

  getActivityDetail(sessionKey, uid) {  //获取活动详情
    var params = new Object();
    params.sessionKey = sessionKey;
    params.uid = uid;
    var that = this;
    network.POST(
      {
        params: params,
        requestUrl: requestUrl.getActiveActivityUrl,
        success: function (res) {
          if (res.data.code == 0) {
            app.globalData.getActivityData = res.data.data[0];
                that.setData({
                  activity: true,
                  activityId:res.data.data[0].id
                });
                that.isSingUp(uid, res.data.data[0]);
          } else if (res.data.code == 90010){
            that.setData({
              activity: false
            });
            wx.setStorageSync('isAgainShowSing', true);
          }else{
            util.toast(res.data.message);
          }
        },
        fail: function () {
          util.toast("网络异常, 请稍后再试");
        }
      })
  },
  onShow: function () {
    // console.log(app.globalData.uid);
    if (app.globalData.uid) {
      this.getActivityDetail(wx.getStorageSync("SESSIONKEY"), app.globalData.uid);
      this.getShareInfo(wx.getStorageSync("SESSIONKEY"),  app.globalData.uid,false);

    } else {
      app.userInfoReadyCallBack = (res1, res2) => {
        this.getActivityDetail(res2, res1);
            this.getShareInfo(wx.getStorageSync("SESSIONKEY"), res1, false);
          
        }
      }
  }
})