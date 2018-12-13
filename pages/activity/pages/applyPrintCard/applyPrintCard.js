
var uitl = require('../../../../utils/util.js');
var network = require('../../../../utils/network.js')
const requestUrl = require('../../../../config.js')
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    myCardList:[],    //我的名片夹数组
    linepositionStyle:'',    //线条的位置
    templeCardList:[],
    currentIndex:0,    //当前选中的名片index
    haveName:false,   //名字输入框是否有信息
    havePhone:false,      //手机号输入框是否有信息
    haveAddress:false,    //是否有收获地址
    imageLoadSuccess:false   //图片加载是否成功
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPrintCardInfo(true);
  },
  chooseCardAction: function(e) {   //选择不同名片
  
    var cardList = this.data.myCardList;
    var index = e.currentTarget.dataset.index;

    if (index == this.data.currentIndex) {   //如果点击当前名片，不做处理直接返回
      return;
    }
    console.log("处理点击");

    for (var item in cardList) {
      var cardInfo = cardList[item];
      if (index == cardInfo.index) {
        cardInfo.selected = true;
      }else {
        cardInfo.selected = false;
      }
    }
    if (this.data.myCardList[index].cardAddress && this.data.myCardList[index].cardAddress.length>0) {
      this.setData({
        haveAddress: true
      });
    }else {
      this.setData({
        haveAddress: false
      });
    }
    this.setData({
      myCardList: cardList,
      currentIndex:index
    });
  },
  // 获取打印名片信息
  getPrintCardInfo: function(boo) {
    var that = this;
    if (boo) {
      wx.showLoading({
        title: '加载中',
        mask: true
      });
    }
    var params = new Object();
    params.uid = wx.getStorageSync("UIDKEY");
    network.POST({
      requestUrl: requestUrl.getPrintCardPageInfoUrl,
      params:params,
      success:function(res) {
        console.log(res);

        boo? wx.hideLoading() : wx.stopPullDownRefresh();
        if (res.data.code !=0) {
          uitl.toast(res.data.message);
          return;
        }
        that.setData({
          haveAddress:true,
          havePhone: true,
          haveName: true
        });
        //处理名片信息
        that.data.myCardList = [];
        var userList = JSON.parse(res.data.data.userOwnCards);
        for (let index = 0; index < userList.length; index++) {
          var item = userList[index];
          item.index = index;
          
          if (index == 0) {   //处理收货地址
            item.selected = true;   //第一张设置为选中
            if (!item.cardAddress || item.cardAddress.length<=0) {
              that.setData({
                haveAddress: false
              });
            }
          }else {
            item.selected = false;
          }
          that.data.myCardList.push(item);
        }
        that.setData({
          myCardList: that.data.myCardList
        });
        console.log(that.data.myCardList);
      

        //处理模板信息
        var tempList = JSON.parse(res.data.data.cardTemplates);
        that.setData({
          templeCardList:tempList
        });
        console.log(tempList);
      },
      fail:function(res) {
        boo? wx.hideLoading() : wx.stopPullDownRefresh();
        uitl.toast(res.msg);
      }
    });
  },
  //确认提交
  formSubmit:function(e) {
    console.log(e);
    if (this.data.haveAddress && this.data.haveName && this.data.havePhone) {   //触发请求
      let reg = new RegExp(/^((\+86)|(86))?[1][3456789][0-9]{9}$/);      //判断包括手机区号的正则
      if (!reg.test(e.detail.value.inputphone)) {
        uitl.toast('请输入正确的手机号');
        return;
      }
      var params = new Object();
      params.cardId = this.data.myCardList[this.data.currentIndex].cardId;
      params.cardTemplateId = this.data.templeCardList[0].id;
      params.receiveAddress = e.detail.value.inputaddress;
      params.receivePhone = e.detail.value.inputphone;
      params.receiveName = e.detail.value.inputname;
      params.activityId = app.globalData.getActivityData.id;
      params.uid = wx.getStorageSync("UIDKEY");
      if (!params.cardId) {
       uitl.toast("服务异常，请稍后重试"); 
       return;
      }
      wx.showLoading({
        title:'处理中',
        mask: true
      });
      console.log(params);
      network.POST({
        params: params,
        requestUrl: requestUrl.printCardUrl,
        success: function(res) {
          wx.hideLoading();
          if (res.data.code != 0) {
            uitl.toast(res.data.message);
            return;
          }
          uitl.toast('信息已经提交成功，名片邮寄后客服会与您联系');
          setTimeout(function(){
           wx.navigateBack()
          },2000);
        },
        fail:function(res) {
          wx.hideLoading();
          uitl.toast(res.msg);
        }
      });
    }

  },
  //图片加载完成触发的方法
  imageLoadFinishAction: function(ev) {
    console.log("图片加载完成");
    this.setData({
      imageLoadSuccess: true
    });
  },
  // 输入框内容改变
  inputAction:function(e) {
    console.log(e.detail.value);
    var iValue = e.detail.value;
    var type = e.currentTarget.dataset.type;
    if (type == 'name') {
      if (iValue && iValue.length>0) {
        this.setData({
          haveName: true
        });
      }else {
        this.setData({
          haveName: false
        });
      }
      // console.log("处理name");
      return;
    }
    if (type == 'phone') {
      if (iValue && iValue.length>0) {
        this.setData({
          havePhone: true
        });
      }else {
        this.setData({
          havePhone: false
        });
      }
      return;
    }
    if (type == 'address') {
      if (iValue && iValue.length>0) {
        this.setData({
          haveAddress: true
        });
      }else {
        this.setData({
          haveAddress: false
        });
      }
      return;
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },
  onPullDownRefresh:function() {
    this.getPrintCardInfo(false);
  }
})