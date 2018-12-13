//logs.js
var network = require('../../../utils/network.js')
const requestUrl = require('../../../config')
const util = require('../../../utils/util.js')

var app = getApp();
Page({
  data: {
    howShops: 0,//共多少家店铺

    // MOCKDATA
    sort:[
      {name: '分类',
      type: 1},
      {
        name: '距离',
        type: 2
      }, {
        name: '热度',
        type: 3
      }
    ]
   
  },
  onLoad: function (options) {
    app.globalData.isRefreshTagForCardFile = true;    //
  },
  onShow: function (res) {
   
  },
  onHide: function () {
  },
  // 点击返回地图
  backMap: function(){
    wx.switchTab({
      url: '/pages/tabBar/index/index'
    });
  },
//  调用排序列表接口
  clickSort:function(e){
    var type = e.currentTarget.dataset.type;

  
  },
  
  onReady: function () {
    //获得dialog组件
  },

  onPullDownRefresh: function () {
  },

})
