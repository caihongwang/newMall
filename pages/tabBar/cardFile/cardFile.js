//logs.js
var network = require('../../../utils/network.js')
const requestUrl = require('../../../config')
const util = require('../../../utils/util.js')

var app = getApp();
Page({
  data: {
    isShowFilter: false,//是否展示筛选弹窗
    howShops: 0,//共多少家店铺
    filterList:{
      type:['2','3','4','5'],
      distance:['1000','200','3000'],
      hot:['100','100','100','100']
  },
    // MOCKDATA
    sort:[
      {
        name: '分类',
        type: 1
      },
      {
        name: '距离',
        type: 2
      }, 
      {
        name: '热度',
        type: 3
      }
    ],
    list: [
      {
        images: '/images/logo.png',
        imagesHead:'/images/home.png',
        name: '相约楼',
        hot:'521',
        distance: '1023.3km',
        wheelImages: ['/images/logo.png', '/images/logo.png', '/images/logo.png']
      },
      {
        images: '/images/logo.png',
        imagesHead: '/images/home.png',
        name: '相约楼',
        hot: '521',
        distance: '1023.3km',
        wheelImages: ['/images/logo.png', '/images/logo.png', '/images/logo.png']
        
      },
      {
        images: '/images/logo.png',
        imagesHead: '/images/home.png',
        name: '相约楼',
        hot: '521',
        distance: '1023.3km',
        wheelImages: ['/images/logo.png', '/images/logo.png', '/images/logo.png']
      },
      {
        images: '/images/logo.png',
        imagesHead: '/images/home.png',
        name: '相约楼',
        hot: '521',
        distance: '1023.3km',
        wheelImages: ['/images/logo.png', '/images/logo.png', '/images/logo.png']
      },
      {
        images: '/images/logo.png',
        imagesHead: '/images/home.png',
        name: '相约楼',
        hot: '521',
        distance: '1023.3km',
        wheelImages: ['/images/logo.png', '/images/logo.png', '/images/logo.png']
      }
      
    ]
  },

getShopList:function(boo){
  var that = this;
  var params = new Object();
  params.uid = wx.getStorageSync("UIDKEY");
  params.shopStatus = 1;

  params.currentLon = app.globalData.latitude ;
  params.currentLat = app.globalData.longitude;
  params.dis = 100;

  if (!boo) {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
  }
  network.POST(
    {
      params: params,
      requestUrl: requestUrl.getShopByConditionUrl,
      success: function (res) {
        console.log(res.data);
        boo ? wx.stopPullDownRefresh() : wx.hideLoading();
        if (res.data.code == 0) {
          
          } else {
      
          }
      
      },
      fail: function (res) {
        boo ? wx.stopPullDownRefresh() : wx.hideLoading();
        util.toast("网络异常, 请稍后再试");
      }
    });

},

  onLoad: function (options) {
  },
  onShow: function (res) {
    this.getShopList(false);
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


  // 点击跳转商户详情
  goToDetail: function(e){
    var shopInformation = encodeURIComponent(JSON.stringify(e.currentTarget.dataset.cardinfo));
      wx.navigateTo({
        url: '../../cardFile/shopInformation/shopInformation?shopInformation=' + shopInformation
      });
    
  },
  
  onReady: function () {
    //获得dialog组件
  },

  onPullDownRefresh: function () {
  },

})
