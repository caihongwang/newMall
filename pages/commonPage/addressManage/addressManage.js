// pages/commonPage/addressManage/addressManage.js
var network = require('../../../utils/network.js');
var util = require('../../../utils/util.js');
var requestUrl = require('../../../config.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isFromPayProductOrderPage: false,
    selectedAddressItem: 1,
    addressList:[]
  },

  getAddressList: function () {
    var that = this;
    var params = new Object();
    params.uid = wx.getStorageSync("UIDKEY");
    network.POST(
      {
        params: params,
        requestUrl: requestUrl.getAddressListUrl,
        success: function (res) {
          console.log(res.data.data);
          if (res.data.code == 0) {
            var addressList = res.data.data;
            for (var i in addressList){
              var iterm = addressList[i];
              var addressDeatailInfo = iterm.provinceName + " " +
                iterm.cityName + " " + iterm.regionName + " " +
                iterm.streetName + " " + iterm.detailAddress;
              addressDeatailInfo = addressDeatailInfo.length > 55 ? addressDeatailInfo.substring(0, 55) + "..." : addressDeatailInfo;
              addressList[i].addressDeatailInfo = addressDeatailInfo;
            }
            that.setData({
              addressList: addressList
            });
          } else {
          }

        },
        fail: function (res) {
          util.toast("网络异常, 请稍后再试");
        }
      });
  },




// 选择地址列表
  selectAddress: function (e) {
    var selectedAddressItem = e.currentTarget.dataset.index;
    this.setData({
      selectedAddressItem: selectedAddressItem
    });
    wx.setStorageSync('selectedAddress', this.data.addressList[selectedAddressItem]);
    if (this.data.isFromPayProductOrderPage){ //如果是从支付订单页面过来的，则选中地址后直接调回支付订单页面
      // wx.redirectTo({
      //   url: '/pages/commonPage/payProductOrder/payProductOrder',
      // });
      wx.navigateBack();
    }
    //调用筛选接口
  },
  // 点击新增收货地址
  addNewAddress:function(){
      wx.navigateTo({
        url: '/pages/commonPage/addAddress/addAddress',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
  },

  // // 删除地址
  // deleteAddress:function(){
  //   wx.showModal({
  //     title: '提示',
  //     content: '是否删除吗?',
  //     success(res) {
  //       if (res.confirm) {
  //         //  TODO调用删除接口 重新刷新页面
  //       } else if (res.cancel) {
  //         console.log('用户点击取消')
  //       }
  //     }
  //   })

  // },

  // 点击编辑跳转到编辑页面
  editAddress:function(e){
    // e.currentTarget.dataset.index
    let index = e.currentTarget.dataset.index;
    let addressList = JSON.stringify(this.data.addressList[index]);
    wx.navigateTo({
      url: '/pages/commonPage/addAddress/addAddress?addressList=' + addressList,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var isFromPayProductOrderPage = options.isFromPayProductOrderPage;
    if (isFromPayProductOrderPage){
      this.setData({
        isFromPayProductOrderPage: isFromPayProductOrderPage
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getAddressList();

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})