// pages/commonPage/addAddress/addAddress.js
var network = require('../../../utils/network.js');
var util = require('../../../utils/util.js');
var requestUrl = require('../../../config.js');
// var address = require("../../..mock.js")

var address = {
  provinces: [{
    "name": "北京市",
    "id": "110000"
  }, {
      "name": "天津市",
      "id": "120000"
    }, {
      "name": "河北省",
      "id": "130000"
    }],
  citys: {
    "110000": [
      {
        "province": "北京市",
        "name": "市辖区",
        "id": "110100"
      }
    ],
    "120000": [
      {
        "province": "天津市",
        "name": "市辖区",
        "id": "120100"
      }
    ]
  },
  areas: {
    "110100": [
      {
        "city": "市辖区",
        "name": "东城区",
        "id": "110101"
      },
      {
        "city": "市辖区",
        "name": "西城区",
        "id": "110102"
      }]
  }
}

var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    animationAddressMenu: {},
    addressMenuIsShow: false,
    provincesIndex: 0,
    provinces: [],
    citys: [],
    citysIndex:0,
    regionIndex:0,
    streetIndex:0,
    areas: [],
    areaInfo: '',
    isProvinces: true,
    isCitys: false,
    isAreas:false,
    isCitysChoose:true,
    isareasChoose:true,
    isStreetChoose:true,




    isEdit: false,//是否是点击编辑过来
    inputName: '',
    inputPhone: '',
    detailAddress: ''
  },


getProvince:function(){
    var that = this;
    var params = new Object();
    params.uid = wx.getStorageSync("UIDKEY");
    params.dicType = 'province';
    network.POST(
      {
        params: params,
        requestUrl: requestUrl.getProvinceListUrl,
        success: function (res) {
          console.log(res.data.data);
          if (res.data.code == 0) {
            that.setData({
              provinces: res.data.data
            })
            console.log(that.data.provinces[0].provinceName);
          } else {
          }

        },
        fail: function (res) {
          util.toast("网络异常, 请稍后再试");
        }
      });
},
  getCity: function (provinceId){
    var that = this;
    var params = new Object();
    params.uid = wx.getStorageSync("UIDKEY");
    params.dicType = 'city';
    params.provinceId = that.data.provinces[this.data.provincesIndex].provinceId;
    network.POST(
      {
        params: params,
        requestUrl: requestUrl.getCityListUrl,
        success: function (res) {
          console.log(res.data.data);
          if (res.data.code == 0) {
            that.setData({
              citys: res.data.data
            })
          } else {

          }
        },
        fail: function (res) {
          util.toast("网络异常, 请稍后再试");
        }
    });

},
  getRegionList:function(){
    var that = this;
    var params = new Object();
    params.uid = wx.getStorageSync("UIDKEY");
    params.dicType = 'region';
    params.cityId = that.data.citys[this.data.citysIndex].cityId;

    network.POST(
      {
        params: params,
        requestUrl: requestUrl.getRegionListUrl,
        success: function (res) {
          console.log(res.data.data);
          if (res.data.code == 0) {
            that.setData({
              regins: res.data.data
            })
          } else {
          }
        },
        fail: function (res) {
          util.toast("网络异常, 请稍后再试");
        }
      });
  },


  getStreetList: function () {
    var that = this;
    var params = new Object();
    params.uid = wx.getStorageSync("UIDKEY");
    params.dicType = 'street';
    params.regionId = that.data.regins[this.data.regionIndex].regionId;
    network.POST(
      {
        params: params,
        requestUrl: requestUrl.getStreetListUrl,
        success: function (res) {
          console.log(res.data.data);
          if (res.data.code == 0) {
            that.setData({
              street: res.data.data
            })
          } else {
          }
        },
        fail: function (res) {
          util.toast("网络异常, 请稍后再试");
        }
      });
  },

  
  
  // 选择省
  provincesTap:function(){
    this.setData({
      isProvinces:false,
    });
  },
  cancelProvinces:function(){
    if(!this.data.selectProvinces){
      this.setData({
        isProvinces:true,
      });
    }
  },

  provincesChange:function(e){
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      provincesIndex: e.detail.value,
      selectProvinces:true,
      isCitys: true,
    })
    this.getCity();
  },




// 选择市区

citysTap:function(){
  this.setData({
    isCitysChoose:false,
  });
},
cancelCitys:function(){
  if(!this.data.selectCitys){
    this.setData({
      isCitysChoose:true,
    });
  }
},
citysChange:function(e){
    console.log('picker发送选择改变，携带值为', e.detail.value);
  console.log(e.detail.value);
   this.setData({
      citysIndex: e.detail.value,
      selectCitys:true,
      isAreas: true,
    })
    this.getRegionList();
},

// 选择县
areasTap:function(){
  this.setData({
    isareasChoose:false,
  });


},
cancelAreas:function(){
  if(!this.data.selectAreas){
    this.setData({
      isareasChoose:true,
    });
  }
  console.log(22222222);
},
areasChange:function(e){
  console.log('picker发送选择改变，携带值为', e.detail.value);
  console.log(e.detail.value);
  this.setData({
    regionIndex: e.detail.value,
    selectareas: true,
    isStreet: true,
  })
  
  console.log(this.data.isareasChoose);
  console.log('11111111');

  this.getStreetList();
},


  // 选择街道
  streetTap: function () {
    this.setData({
      isStreetChoose: false,
    });
  },
  cancelAreas: function () {
    if (!this.data.selectStreet) {
      this.setData({
        isStreetChoose: true,
      });
    }
  },
  streetChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    console.log(e.detail.value);
    this.setData({
      streetIndex: e.detail.value,
      selectStreet: true,
      isAreas: true,
    })
  },



  onLoad: function (options) {
    // 让他把value给我
    // 默认联动显示北京

    // 通过点击编辑过来的
    if (options.address){
      let address = JSON.parse(options.address);
      var id = address.provinces[0].id
      this.setData({
        provinces: address.provinces,
        citys: address.citys[id],
        areas: address.areas[address.citys[id][0].id],
        isEdit: true
      })
    }
  },


// 点击是否默认
  switchChange:function(e){
    console.log('switch1 发生 change 事件，携带值为', e.detail.value)
    if (e.detail.value){
      this.setData({
        isDefault: true
      })
    }
  },

  delete:function(){
    // 调用删除接口

  },

  sureSave:function(){
    // 调用保存按钮
  },

// 输入姓名
  bindName:function(e){
    this.setData({
      inputName: e.detail.value
    })
  },
    deleteName:function(){
      this.setData({
        inputName: ''
      })
  },

  // 输入电话
  bindPhone: function (e) {
    this.setData({
      inputPhone: e.detail.value
    })
  },
  deletePhone: function () {
    this.setData({
      inputPhone: ''
    })
  },
// 输入详细地址
  detailAddress: function (e) {
    this.setData({
      detailAddress: e.detail.value
    })
  },
  deleteDetail: function () {
    this.setData({
      detailAddress: ''
    })
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
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'linear',
    })
    this.animation = animation



    this.getProvince();
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