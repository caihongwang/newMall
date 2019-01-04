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
    currentItem: 1,
    address:[
      {
        name:'你好呀',
      address:'年后地纷纷恩发你滴定法'
      },
      {
        name: '你好呀',
        address: '年后地纷纷恩发你滴定法'
      },
      {
        name: '你好呀',
        address: '年后地纷纷恩发你滴定法'
      },
      {
        name: '你好呀',
        address: '年后地纷纷恩发你滴定法'
      },
      {
        name: '你好呀',
        address: '年后地纷纷恩发你滴定法'
      },
      {
        name: '你好呀',
        address: '年后地纷纷恩发你滴定法'
      }


    ]

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
            that.setData({
              address: res.data.data
            })
          } else {
          }

        },
        fail: function (res) {
          util.toast("网络异常, 请稍后再试");
        }
      });
  },




// 选择地址列表
  filter: function (e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      currentItem: index
    })
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
    let address = JSON.stringify(this.data.address[index]);
    wx.navigateTo({
      url: '/pages/commonPage/addAddress/addAddress?address=' + address,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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