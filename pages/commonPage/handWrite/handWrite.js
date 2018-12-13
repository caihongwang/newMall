// pages/howFind/index.js
var network = require('../../../utils/network.js');
var util = require('../../../utils/util.js');
var requestUrl = require('../../../config.js');
var netool = require('../../../utils/netool.js');


var app = getApp();
Page({
  data: {
    inputToast: '', //头部错误提示存放的信息
    isIpx: app.globalData.isIpx, //判断是否是ipx
    isHaveValue: false,
    canClick: false, //保存按钮是否可以点击
    canSave: false,
    formId: '',     // 提交表单生成的id
    scrollY: true,// 是否可以滚动
    more: [
      // { isChecked: false, name: '手机', palce: '请输入您的手机号' },
      // { isChecked: false, name: '部门', palce: '请输入您的手机号' },
      // { isChecked: false, name: '邮箱', palce: '请输入您的手机号' },
      // { isChecked: false, name: '电话', palce: '请输入您的手机号' },
      // { isChecked: false, name: '传真', palce: '请输入您的手机号' },
      // { isChecked: false, name: '地址', palce: '请输入您的手机号' },
      // { isChecked: false, name: '网址', palce: '请输入您的手机号' },
      // { isChecked: false, name: '微信号', palce: '请输入您的手机号' },
      // { isChecked: false, name: 'QQ', palce: '请输入您的手机号' },
      // { isChecked: false, name: '微博', palce: '请输入您的手机号' },
      // { isChecked: false, name: '其他', palce: '请输入您的手机号' , isOther: true}
    ],
    userInfo: {},
    addMore: [],    //添加更多选中的信息
    userName: '',
    cardCompany: "",
    cardPhone: '',
    // 点击编辑之后跳转过来后的保存的数据
    editData: {
      // cardName: '',
      // cardCompany: '',
      // cardJob: '',
      // cardPhone: '',
      // cardEmail: '',
      // cardAddress: '',
      // cardDepartment: '',
      cardCustomMessage: [
        // { name: "手机", value: "行政总监" },
        // { name: "手机", value: "行政总监" },
        // { name: "职位2", value: "行政总监" },
        // { name: "职位3", value: "行政总监" },
        // { name: "职位4", value: "行政总监" },
      ],
      // cardCustomMessage2: [],
    },
    cardCustomMessage: [],
    other: [],
    arr1: [],
    // 定时器
    time: '',
    beforeEditData: false,//判断之前是否有已经输入的信息
    // 发送模板消息的data
    "data": {
      "keyword1": {
      },
      "keyword2": {
      },
      "keyword3": {
      },
      "keyword4": {
      },
      "keyword5": {

      }
    },
    //是否显示扫描的页面
    isScanned: false,
    // 接收上页传递过来的图片
    takePhotoImg: '',
    // 接收上页传递过来的图片 判断是否是新增 1是新增
    isNewAdd: '',
    scanName: {  //扫描图片成功的信息
    },
    isOwnCard: '1',
    isUpUserPhone: true,     //手动输入手机号是否可以修改 true不可以修改
    isGoWrite: true,
    placeAddress: '请输入您的公司地址', //textarea输入框默认的placeholder
    placeName: '请输入您的姓名', //textarea输入框默认的placeholder
    placeCompany: '请输入您的公司名称',//textarea输入框默认的placeholder
    placeWork: '请输入您的职位',//textarea输入框默认的placeholder
    placeDepart: '请输入您的部门',//textarea输入框默认的placeholder
    placePhone: '请输入正确的手机号', //textarea输入框默认的placeholder
    placeEamil: '请输入您的公司邮箱', //textarea输入框默认的placeholder
    imageNoLoad: true,//二维码没有加载时的图片
  },
  imageLoad(ev) {
    this.setData({
      imageNoLoad: false,
    })
  },
  photoUp: function () {   // 点击重新拍照
    var that = this;
    var beforeEditData = JSON.stringify(that.data.editData);
    // modify == true表示是重编辑界面过去的
    if (that.data.editData.modify == undefined && beforeEditData) {
      //新增
    // 第一个一是否是第一次调用选择相机
      util.chooseWxImage('camera',1, 1, that.data.editData.isOwnCard, that.data.editData.cardPhone, that.data.isGoWrite, beforeEditData)
    } else if (that.data.editData.modify == undefined) {
      util.chooseWxImage('camera',1, 1, that.data.editData.isOwnCard, that.data.editData.cardPhone, that.data.isGoWrite)
    } else if (beforeEditData) {
      //修改
      util.chooseWxImage('camera',1, 0, that.data.editData.isOwnCard, that.data.editData.cardPhone, that.data.isGoWrite, beforeEditData, that.data.editData.modify)
    }
  },
  albumSletion: function () {   //点击获取相册
    var that = this;
    var beforeEditData = JSON.stringify(that.data.editData);
    if (that.data.editData.modify == undefined && beforeEditData) {
      //新增
      util.chooseWxImage('album',1, 1, that.data.editData.isOwnCard, that.data.editData.cardPhone, that.data.isGoWrite, beforeEditData)
    } else if (that.data.editData.modify == undefined) {
      util.chooseWxImage('album',1,1, that.data.editData.isOwnCard, that.data.editData.cardPhone, that.data.isGoWrite)
    } else if (beforeEditData) {
      //修改
      util.chooseWxImage('album',1, 0, that.data.editData.isOwnCard, that.data.editData.cardPhone, that.data.isGoWrite, beforeEditData, that.data.editData.modify)
    }
  },

//重新上传
  photoUpAgain:function(){
    var that = this;
    wx.showActionSheet({
      itemList: ['拍照上传', '相册选取'],
      success: function (res) {
        if (res.tapIndex == 0) {  //拍照上传
          that.photoUp();
         return;
        };
        if (res.tapIndex == 1) {  //拍照上传
          that.albumSletion();
          return;
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })

  },
  isShowCanSave: function (that) {
    if (that.data.editData.cardName && that.data.editData.cardName.length != 0 && that.data.editData.cardCompany && that.data.editData.cardCompany.length != 0 && that.data.editData.cardPhone && that.data.editData.cardPhone.length != 0) {
      that.setData({
        canSave: true
      })
    } else {
      that.setData({
        canSave: false
      })
    }
  },
  userNameInput: function (e) {   // 获取姓名
    this.setData({
      placeName: '请输入您的姓名'
    })
    var that = this;
    that.data.editData.cardName = e.detail.value.replace(/\s+/g, '');
    that.setData({
      editData: that.data.editData
    })
    if (that.data.editData.cardName.length == 0 || that.data.editData.cardName.length == 1) {
      that.toast.showToast('请输入您的姓名')
    }
    that.isShowCanSave(that);
  },

  userNameInput1: function (e) {   // 获取姓名
    this.setData({
      placeName: ''
    })
  },

  userCopmpanyInput: function (e) {    // 获取公司
    this.setData({
      placeCompany: '请输入您的公司名称'
    })
    var that = this;
    that.data.editData.cardCompany = e.detail.value.replace(/\s+/g, '');
    that.setData({
      editData: that.data.editData
    });
    if (that.data.editData.cardCompany.length == 0 || that.data.editData.cardCompany.length == 1) {
      that.toast.showToast('请输入您的公司名称')
    }
    that.isShowCanSave(that);
  },
  userCopmpanyInput1: function () {
    this.setData({
      placeCompany: ''
    })
  },


  userPhoneInput: function (e) {     // 获取电话
    this.setData({
      placePhone: '请输入正确的手机号'
    })
    var that = this;
    that.data.editData.cardPhone = e.detail.value.replace(/\s+/g, '');
    that.setData({
      editData: that.data.editData
    })
    let reg = new RegExp(/^((\+86)|(86))?[1][3456789][0-9]{9}$/);      //判断包括手机区号的正则
    if (that.data.editData.cardPhone.length == 0) {
      that.toast.showToast('请输入您的手机号');

    } else if (!reg.test(that.data.editData.cardPhone)) {
      that.toast.showToast('请输入正确的手机号');

    }
    that.isShowCanSave(that);
  },
  userPhoneInput1: function () {
    this.setData({
      placePhone: ''
    })
  },


  userWorkInput: function (e) {      // 获取职位
    this.setData({
      placeWork: '请输入您的职位'
    })
    this.data.editData.cardJob = e.detail.value.replace(/\s+/g, '');

    this.setData({
      editData: this.data.editData
    })
  },
  userWorkInput1: function (e) {      // 获取职位
    this.setData({
      placeWork: ''
    })
  },


  userDepartInput: function (e) {  //获取部门信息
    this.setData({
      placeDepart: '请输入您的部门'
    })
    this.data.editData.cardDepartment = e.detail.value.replace(/\s+/g, '');
    this.setData({
      editData: this.data.editData
    })
  },
  userDepartInput1: function (e) {  //获取部门信息
    this.setData({
      placeDepart: ''
    })
  },
  userEmailInput: function (e) {    // 获取邮箱
    this.setData({
      placeEamil: '请输入您的公司邮箱'
    })
    this.data.editData.cardEmail = e.detail.value.replace(/\s+/g, '');
    this.setData({
      editData: this.data.editData
    })
  },
  userEmailInput1: function (e) {    // 获取邮箱
    this.setData({
      placeEamil: ''
    })
  },
  userAdressInput: function (e) {    // 获取地址
    this.setData({
      placeAddress: '请输入您的公司地址'
    })
  },
  userAdressInput1: function (e) {    // 获取地址
    this.setData({
      placeAddress: ''
    })
    this.data.editData.cardAddress = e.detail.value.replace(/\s+/g, '');
    this.setData({
      editData: this.data.editData
    })
  },
  // 更改已有的列表数据
  haveMessage: function (e) {
    var index = e.currentTarget.dataset.index;
    this.data.editData.cardCustomMessage[index].value = e.detail.value.replace(/\s+/g, '');
    this.setData({
      editData: this.data.editData
    })
  },

  // 添加新的列表数据
  addMoreBlur: function (e) {
    var newAdd = {};
    var index = e.currentTarget.dataset.index;
    newAdd.dicName = this.data.arr1[index].dicName;
    newAdd.value = e.detail.value.replace(/\s+/g, '');
    app.globalData.cardCustomMessage2[index] = newAdd;
    this.setData({
      editData: this.data.editData
    })
  },
  // 点击保存的时候
  formSubmit: function (e) {
    var reg1 = new RegExp(/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/);
    this.setData({
      formId: e.detail.formId
    });
    netool.addFormId(this.data.formId);
    
    var that = this;
    if (that.data.editData.cardName.length == 0 || that.data.editData.cardName.length == 1) {
      that.toast.showToast('请输入您的姓名');

    } else if (that.data.editData.cardCompany.length == 0 || that.data.editData.cardCompany.length == 1) {
      that.toast.showToast('请输入您的公司名称');

    } else if (that.data.editData.cardPhone.length == 0) {
      that.toast.showToast('请输入您的手机号');

    } else {
      // let reg = new RegExp(/^1[3|4|5|7|8|9][0-9]{9}$/);
      let reg = new RegExp(/^((\+86)|(86))?[1][3456789][0-9]{9}$/);
      if (!reg.test(that.data.editData.cardPhone)) {
        that.toast.showToast('请输入正确的手机号');

      } else if (that.data.editData.cardEmail == undefined || that.data.editData.cardEmail.length == 0 || reg1.test(that.data.editData.cardEmail)) {

        let params = new Object();
        if (that.data.editData.cardAddress != undefined) {
          params.cardAddress = that.data.editData.cardAddress;
        }
        if (that.data.editData.cardCompany != undefined) {
          params.cardCompany = that.data.editData.cardCompany;
        }
        if (that.data.editData.cardEmail != undefined) {
          params.cardEmail = that.data.editData.cardEmail;
        }
        if (that.data.editData.cardName != undefined) {
          params.cardName = that.data.editData.cardName;
        }
        if (that.data.editData.cardPhone != undefined) {
          params.cardPhone = that.data.editData.cardPhone;
        }
        if (that.data.editData.cardJob != undefined) {
          params.cardJob = that.data.editData.cardJob;
        }
        if (that.data.editData.cardDepartment != undefined) {
          params.cardDepartment = that.data.editData.cardDepartment;
        }
        if (that.data.editData.cardPositiveImgUrl != undefined) {
          params.cardPositiveImgUrl = that.data.editData.cardPositiveImgUrl;
        }
        let arr = [];
        for (var i in that.data.editData.cardCustomMessage) {
          if (that.data.editData.cardCustomMessage[i].dicName && that.data.editData.cardCustomMessage[i].dicName != '' && that.data.editData.cardCustomMessage[i].value && that.data.editData.cardCustomMessage[i].value != '') {
            if (that.data.editData.cardCustomMessage[i].dicName && that.data.editData.cardCustomMessage[i].dicName != '') {
              arr.push(that.data.editData.cardCustomMessage[i]);
            }
          }
        }
          if (app.globalData.cardCustomMessage2 && app.globalData.cardCustomMessage2.length != 0) {
            for (var i in app.globalData.cardCustomMessage2) {
              if (app.globalData.cardCustomMessage2[i].dicName && app.globalData.cardCustomMessage2[i].dicName != '' && app.globalData.cardCustomMessage2[i].value && app.globalData.cardCustomMessage2[i].value != '') {
                arr.push(app.globalData.cardCustomMessage2[i]);
              }
            }
          }
          if (arr && arr.length != 0) {
            params.cardCustomMessage = JSON.stringify(arr);
          } else {
            params.cardCustomMessage = '';
          }
          if (that.data.editData.modify == undefined || that.data.isNewAdd == 1) {
            // 新增
            params.isOwnCard = that.data.editData.isOwnCard;
            params.uid = app.globalData.uid;
            params.uid = app.globalData.uid;


            if (app.globalData.getActivityData && JSON.stringify(app.globalData.getActivityData != '{}')
            ) {
              params.activityId = app.globalData.getActivityData.id;
            } else {
              app.userActivityReadyCallBack = (getActivityData) => {
                params.activityId = getActivityData;

              }
            }


            params.page = 'pages/shareOpen/index';    //不能添加"/"更多参见这里https://mp.weixin.qq.com/debug/wxadoc/dev/api/qrcode.html
            if (that.data.editData.isOwnCard == 1) {   //创建自己的名片，设置为自己的头像
              params.cardHeadImgUrl = that.data.userInfo.avatarUrl;
            }
            wx.showLoading({
              mask: true
            })
            params.formId = that.data.formId;

            network.POST(
              {
                params: params,
                requestUrl: requestUrl.addCardUrl,
                success: function (res) {
                  wx.hideLoading();
                  if (res.data.code == 0) {
                    if (that.data.editData.isOwnCard == 0) {  //自己创建别人的名片成功提醒
                      let params1 = new Object()
                      params1.form_id = that.data.formId;
                      params1.page = 'pages/tabBar/cardFile/cardFile';
                      params1.template_id = 'hnQie-Q7q1jnR6f-ELSiUTwvO_naG9lsPqz9MKWJ2nk';
                      params1.receiveUid = app.globalData.uid;   //接收人的uid

                      that.data.data.keyword1.value = that.data.editData.cardName;
                      that.data.data.keyword1.color = "#000000";

                      that.data.data.keyword2.value = that.data.editData.cardCompany;
                      that.data.data.keyword2.color = "#000000";

                      that.data.data.keyword3.value = that.data.editData.cardJob;
                      that.data.data.keyword3.color = "#000000";

                      that.data.data.keyword4.value = util.getNowFormatDate();
                      that.data.data.keyword4.color = "#000000";

                      that.data.data.keyword5.value = that.data.userInfo.nickName + '（先生/女士），您已成功为' + that.data.editData.cardName + '创建了一张名片。点击进入名片夹中查看。'
                      that.data.data.keyword5.color = "#000000";
                      that.setData({
                        data: that.data.data
                      });
                      params1.data = JSON.stringify(that.data.data);
                      //发送模板消息，如果失败了也不给用户提示
                      network.POST(
                        {
                          params: params1,
                          requestUrl: requestUrl.sendTemplateMessageUrl,
                          success: function (res) {
                          },
                          fail: function (res) {
                          }
                        })
                      app.globalData.isRefreshTagForCardFile = true;

                      wx.switchTab({   //不管是否发送模板消息成功，都不能影响正常操作
                        url: '/pages/tabBar/cardFile/cardFile'
                      })

                    } else if (that.data.editData.isOwnCard == 1) {   //如果是自己的就跳转到首页
                      app.globalData.isRefreshTagForIndex = true; //新增成功之后刷新首页

                      wx.switchTab({
                        url: '/pages/tabBar/index/index'
                      })
                    }
                  } else {
                    util.toast(res.data.message);
                  }
                },
                fail: function (res) {
                  wx.hideLoading();
                  util.toast("网络异常，请稍后再试");
                }
              })
          } else {
            // 修改名片列表
            params.id = that.data.editData.id;
            params.cardSource = that.data.editData.cardSource;
            params.isOwnCard = that.data.editData.isOwnCard;
            if (app.globalData.getActivityData && JSON.stringify(app.globalData.getActivityData != '{}')
            ) {
              params.activityId = app.globalData.getActivityData.id;
            } else {
              app.userActivityReadyCallBack = (getActivityData) => {
                params.activityId = getActivityData;
              }
            }
            params.uid = app.globalData.uid;
            params.formId = that.data.formId;
            params.page = '/pages/tabBar/index/index';
            // params.cardHeadImgUrl = this.data.userInfo.avatarUrl;
            if (that.data.editData.isOwnCard == 1) {   //创建自己的名片，设置为自己的头像
              params.cardHeadImgUrl = that.data.userInfo.avatarUrl;
              app.globalData.isRefreshTagForIndex = true;//如果是修改自己创建的就直接返回,并且刷新页面
            } else {   //自己创建他人的名片，不传入头像

            }
            wx.showLoading({
              mask: true
            })
            network.POST(
              {
                params: params,
                requestUrl: requestUrl.updateCardUrl,
                success: function (res) {
                  wx.hideLoading();
                  if (res.data.code == 0) {
                    if (that.data.editData.isOwnCard == 1) {   //自己的名片修改跳转到首页
                      // 修改名片成功
                      wx.switchTab({
                        url: '/pages/tabBar/index/index',
                        success: function (res) {
                        }
                      })
                    } else {    //如果是修改自己创建的他人的页面就直接返回,并且刷新页面
                      app.globalData.isRefreshTagForCardFile = true;
                      wx.switchTab({
                        url: '/pages/tabBar/cardFile/cardFile'
                      })
                    }
                  } else {
                    util.toast(res.data.message);
                  }
                },
                fail: function (res) {
                  wx.hideLoading();
                  util.toast("网络异常，请稍后再试");
                }
              })
          }
        } else {
        that.toast.showToast('请输入正确邮箱');

      }
    }
  },

  preventD: function () {
  },
  addMore: function () {
    var cardCustomMessage1 = [];
    if (this.data.editData.cardCustomMessage && this.data.editData.cardCustomMessage != undefined) {
      this.setData({
        cardCustomMessage: this.data.editData.cardCustomMessage
      });
      cardCustomMessage1 = this.data.cardCustomMessage;
    }
    if (this.data.arr1) {
      for (var i in this.data.arr1) {
        cardCustomMessage1.push(this.data.arr1[i]);
      }
    };
    var cardCustomMessage = JSON.stringify(cardCustomMessage1);
    wx.navigateTo({
      url: '/pages/commonPage/addMoreMessage/addMoreMessage?cardCustomMessage=' + cardCustomMessage
    })
  },
  /**
  * 生命周期函数--监听页面初次渲染完成
  */

  scanInfoList: function (scanInfo, isOwnCard, modify, id, cardSource, cardPhone) {
    this.data.editData = {};
    this.data.editData.cardCustomMessage = [];
    this.data.editData.isOwnCard = isOwnCard;
    this.data.editData.modify = modify;
    this.data.editData.cardSource = cardSource;
    this.data.editData.cardPhone = cardPhone;

  
    this.data.editData.id = id;
    // var scanInfo = JSON.parse(scanInfo.data);
    // scanInfo = JSON.parse(scanInfo.data);
    for (var key in scanInfo) {
      var scanInfoArr = JSON.parse(scanInfo[key]);
      // 判断是图片
      if (key == 'cardHeadImgUrl' && scanInfoArr != undefined) {
        for (var i in scanInfoArr) {
          if (i == 0) {
            this.data.editData.cardPositiveImgUrl = scanInfoArr[i];
          }
        }
      }
      // 判断是其他信息
      if (key == 'cardCustomMessage' && scanInfoArr && scanInfoArr != undefined) {
        for (var i in scanInfoArr) {
          for (var j in scanInfoArr[i]) {
            var scanInfoArr1 = JSON.parse(scanInfoArr[i][j]);
            for (var k in scanInfoArr1) {
              var obj = {};
              obj.dicName = j;
              obj.value = scanInfoArr1[k];
              this.data.editData.cardCustomMessage.push(obj);
            }
          }
        }
      }
      // 判断是地址
      if (key == 'cardAddress' && scanInfoArr != undefined) {
        for (var i in scanInfoArr) {
          if (i == 0) {
            this.data.editData.cardAddress = scanInfoArr[i];
          } else {
            var obj = {};
            obj.dicName = '地址';
            obj.value = scanInfoArr[i];
            this.data.editData.cardCustomMessage.push(obj);
          }
        }
      }
      // 判断是公司
      if (key == 'cardCompany' && scanInfoArr != undefined) {
        for (var i in scanInfoArr) {
          if (i == 0) {
            this.data.editData.cardCompany = scanInfoArr[i];
          } else {
            var obj = {};
            obj.dicName = '公司';
            obj.value = scanInfoArr[i];
            this.data.editData.cardCustomMessage.push(obj);
          }
        }
      }
      //  判断是部门
      if (key == 'cardDepartment' && scanInfoArr != undefined) {
        for (var i in scanInfoArr) {
          if (i == 0) {
            this.data.editData.cardDepartment = scanInfoArr[i];
          } else {
            var obj = {};
            obj.dicName = '部门';
            obj.value = scanInfoArr[i];
            this.data.editData.cardCustomMessage.push(obj);
          }
        }
      }
      //  判断是邮箱
      if (key == 'cardEmail' && scanInfoArr != undefined) {
        for (var i in scanInfoArr) {
          if (i == 0) {
            this.data.editData.cardEmail = scanInfoArr[i];
          } else {
            var obj = {};
            obj.dicName = '邮箱';
            obj.value = scanInfoArr[i];
            this.data.editData.cardCustomMessage.push(obj);
          }
        }
      }
      //  判断是名字
      if (key == 'cardName' && scanInfoArr != undefined) {
        for (var i in scanInfoArr) {
          if (i == 0) {
            this.data.editData.cardName = scanInfoArr[i];
          } else {
            var obj = {};
            obj.dicName = '姓名';
            obj.value = scanInfoArr[i];
            this.data.editData.cardCustomMessage.push(obj);
          }
        }
      }
      //  判断是手机号
      if (key == 'cardPhone' && scanInfoArr != undefined) {
        for (var i in scanInfoArr) {
          if (this.data.editData.cardPhone && this.data.editData.cardPhone != undefined) {
            var obj = {};
            if (isOwnCard == 0 && i == 0) {
              this.data.editData.cardPhone = scanInfoArr[i];
            } else {
              obj.dicName = '手机号';
              obj.value = scanInfoArr[i];
              this.data.editData.cardCustomMessage.push(obj);
            }

          } else {
            if (i == 0) {
              this.data.editData.cardPhone = scanInfoArr[i];
            } else {
              var obj = {};
              obj.dicName = '手机号';
              obj.value = scanInfoArr[i];
              this.data.editData.cardCustomMessage.push(obj);
            }
          }
        }
      }
      //  工作
      if (key == 'cardJob' && scanInfoArr != undefined) {
        for (var i in scanInfoArr) {
          if (i == 0) {
            this.data.editData.cardJob = scanInfoArr[i];
          } else {
            var obj = {};
            obj.dicName = '手机号';
            obj.value = scanInfoArr[i];
            this.data.editData.cardCustomMessage.push(obj);
          }
        }
      }
      if (this.data.editData.cardName && this.data.editData.cardCompany && this.data.editData.cardPhone) {
        this.setData({
          canSave: true
        })
      };
      this.setData({
        editData: this.data.editData
      });
    }
  },
  onReady: function () {
  },
  onLoad: function (options) {
    var that = this;
    // 判断用户头像是否存在
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    // 从手动输入跳转过来传入的数据
    if (options.testData) {
      var testData = {};
      testData = JSON.parse(options.testData);
      this.data.editData.isOwnCard = testData.isOwnCard;
      this.data.editData.cardSource = testData.cardSource;
      if (testData.cardPhone) {
        that.data.editData.cardPhone = testData.cardPhone;
        that.setData({
          isUpUserPhone: true
        })
      } else {
        that.setData({
          isUpUserPhone: false
        })
      }
      // this.data.editData.cardCustomMessage = testData
      this.setData({
        canSave: false,
        editData: this.data.editData
      })
    }
    // 从首页编辑传过来的数据
    if (options.editData) {
      let editData = {};
      editData = JSON.parse(options.editData);
      that.data.editData.modify = true;
      this.setData({
        editData: editData,
        canSave: true,
        isNewAdd: 0
      });
      if (editData.isUpUserPhone == true) {
        this.setData({
          isUpUserPhone: false
        });
      }
    }
    //从可能的列表里面进入传的参数
    if (options.addMayUserInfo) {
      let editData = {};
      editData = JSON.parse(options.addMayUserInfo);
      editData.cardSource = 'manually'
      this.setData({
        editData: editData,
        canSave: true,
      });
      this.data.editData.isOwnCard = '1';
    }
    // 从选取图片的列表里面进入传的参数
    if (options.tempFilePath) {
      app.globalData.addMoreMes = [];
      app.globalData.arr2 = [];
      app.globalData.cardCustomMessage2 = [];
      this.setData({
        placeAddress: '',
      });
      this.isCilp(options.tempFilePath);

    }
  },

  isCover: function (data, isOwnCard, modify, id, cardSource, cardPhone) {  //是否覆盖的提示
    var that = this;
    wx.showModal({
      title: '是否要替换当前名片信息？',
      content: '识别后检查到名片快照信息与当前信息有部分差异',
      confirmText: '确认替换',
      confirmColor: '#09BB07',
      success: function (res) {
        if (res.confirm) {
          that.scanInfoList(data, isOwnCard, modify, id, cardSource, cardPhone);
        } else if (res.cancel) {
        }
      }
    })

  },
  isCilp: function (clipImageMes1) {
    this.setData({
      placeAddress: '',
    });
    var that = this;
    if (clipImageMes1) {

      let clipImageMes = JSON.parse(clipImageMes1);
      if (clipImageMes.beforeEditData) {
        that.data.editData = JSON.parse(clipImageMes.beforeEditData);
        that.setData({
          beforeEditData: true,
          editData: that.data.editData,
        })
      }
      if (!clipImageMes.isGoWrite) {
        that.setData({
          isGoWrite: true
        })
      }
      that.data.editData.isOwnCard = clipImageMes.isOwnCard;
      that.data.editData.modify = clipImageMes.modify;
      if (clipImageMes.cardPhone) {
        that.data.editData.cardPhone = clipImageMes.cardPhone;

        if (clipImageMes.isOwnCard == 0) {
          that.setData({
            isUpUserPhone: false
          })
        } else {
          that.setData({
            isUpUserPhone: true
          })

        }
      } else {
        that.setData({
          isUpUserPhone: false
        })
      }
      this.setData({
        editData: that.data.editData
      });
      this.setData({
        placeAddress: '',
        isScanned: true,
        scrollY: false,
        takePhotoImg: clipImageMes.imageSrc,
        isNewAdd: clipImageMes.isNewAdd,
        editData: that.data.editData
      });
      if (this.data.takePhotoImg) {
        var that = this;
        // let params = new Object();
        // params.imgBase64Data = that.data.takePhotoImg;
        // params.sessionKey = wx.getStorageSync("SESSIONKEY");
        var formData = {
          uid: app.globalData.uid,
          sessionKey: wx.getStorageSync("SESSIONKEY")
        };
        network.UPLOADFILE(requestUrl.scanCardUrl, that.data.takePhotoImg, 'file', formData,
          function (res) {
            var result = {};
            result = JSON.parse(res);
            if (result.code == 0) {
              // 判断是否是编辑，是编辑则覆盖
              if (that.data.beforeEditData == true) {
                that.isCover(result.data, that.data.editData.isOwnCard, that.data.editData.modify, that.data.editData.id, that.data.editData.cardSource, that.data.editData.cardPhone);
              } else {
                that.scanInfoList(result.data, that.data.editData.isOwnCard, that.data.editData.modify, that.data.editData.id, that.data.editData.cardSource, that.data.editData.cardPhone);
              }
            } else {
              that.setData({
                isScanned: false,
                placeAddress: '请输入您的公司地址'
              })
              util.toast(result.message);
            }
            that.setData({
              isScanned: false,
              placeAddress: '请输入您的公司地址'
            })
          },
          function (res) {
            that.setData({
              isScanned: false,
              placeAddress: '请输入您的公司地址'
            })
            util.toast("网络异常，请稍后再试");

          }
        )
      }
    }
  },
  onShow: function () {
    var that = this;
    this.toast = this.selectComponent("#toast");

    //裁剪过来保存的图片信息 放到这里是解决页面深度问题
    // if (app.globalData.isClickBack) {
    //   this.setData({
    //     placeAddress: '',
    //   });
    //   app.globalData.isClickBack = false;
    //   // this.isCilp();
    // } else {
    //   this.setData({
    //     placeAddress: '请输入您的公司地址',
    //   });
    // }
    var that = this;
    var value = wx.getStorageSync('addName');
    // app.globalData.cardCustomMessage2 = [];
    that.setData({
      editData: that.data.editData
    })
    if (app.globalData.addMoreMes && app.globalData.addMoreMes.length != 0) {
      for (var i in app.globalData.addMoreMes) {
        app.globalData.cardCustomMessage2.push({});
      }
      this.setData({
        editData: this.data.editData
      })
    }
    if (app.globalData.addMoreMes) {
      this.setData({
        arr1: app.globalData.addMoreMes
      })
    }
  }
})