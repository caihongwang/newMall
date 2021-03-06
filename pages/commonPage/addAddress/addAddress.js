// pages/commonPage/addAddress/addAddress.js
var network = require('../../../utils/network.js');
var util = require('../../../utils/util.js');
var requestUrl = require('../../../config.js');

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
    citysIndex: 0,
    regionIndex: 0,
    streetIndex: 0,
    areas: [],
    areaInfo: '',
    isProvinces: true,
    isCitys: false,
    isAreas: false,
    isCitysChoose: true,
    isareasChoose: true,
    isStreetChoose: true,
    isEdit: false, //是否是点击编辑过来
    inputName: '',
    inputPhone: '',
    detailAddress: ''
  },

  /**
   * 获取省份
   */
  getProvince: function() {
    var that = this;
    var params = new Object();
    params.uid = wx.getStorageSync("UIDKEY");
    params.dicType = 'province';
    network.POST({
      params: params,
      requestUrl: requestUrl.getProvinceListUrl,
      success: function(res) {
        console.log(res.data.data);
        if (res.data.code == 0) {
          that.setData({
            provinces: res.data.data
          })

          if (that.data.provinceId) {
            for (var i in that.data.provinces) { //x = index
              if (that.data.provinceId == that.data.provinces[i].id) {
                that.setData({
                  isProvinces: false,
                  provincesIndex: i,
                  isProvinces: false,
                  provincesIndex: i,
                })
              }
            }
            that.getCity();
          }
          console.log(that.data.provinces[0].provinceName);
        } else {}

      },
      fail: function(res) {
        util.toast("网络异常, 请稍后再试");
      }
    });
  },

  /**
   * 获取城市
   */
  getCity: function(provinceId) {
    var that = this;
    var params = new Object();
    params.uid = wx.getStorageSync("UIDKEY");
    params.dicType = 'city';
    params.provinceId = that.data.provinces[this.data.provincesIndex].provinceId;
    network.POST({
      params: params,
      requestUrl: requestUrl.getCityListUrl,
      success: function(res) {
        console.log(res.data.data);
        if (res.data.code == 0) {
          that.setData({
            citys: res.data.data
          })

          if (that.data.cityId) {
            console.log(that.data.cityId);
            console.log(3266666666666666);

            for (var i in that.data.citys) { //x = index
              if (that.data.cityId == that.data.citys[i].id) {
                console.log(32666666666666661111111111);

                that.setData({
                  isCitys: true,
                  isCitysChoose: false,
                  citysIndex: i,
                })
                that.getRegionList();

              }
            }
          }
        } else {

        }
      },
      fail: function(res) {
        util.toast("网络异常, 请稍后再试");
      }
    });

  },

  /**
   * 获取地区
   */
  getRegionList: function() {
    var that = this;
    var params = new Object();
    params.uid = wx.getStorageSync("UIDKEY");
    params.dicType = 'region';
    params.cityId = that.data.citys[this.data.citysIndex].cityId;

    network.POST({
      params: params,
      requestUrl: requestUrl.getRegionListUrl,
      success: function(res) {
        console.log(res.data.data);
        if (res.data.code == 0) {
          that.setData({
            regins: res.data.data
          })

          if (that.data.regionId) {
            for (var i in that.data.regins) { //x = index
              if (that.data.regionId == that.data.regins[i].id) {
                that.setData({
                  isAreas: true,
                  isareasChoose: false,
                  regionIndex: i,
                })
                that.getStreetList();
              }
            }
          }

        } else {}
      },
      fail: function(res) {
        util.toast("网络异常, 请稍后再试");
      }
    });
  },

  /**
   * 获取街道
   */
  getStreetList: function() {
    var that = this;
    var params = new Object();
    params.uid = wx.getStorageSync("UIDKEY");
    params.dicType = 'street';
    params.regionId = that.data.regins[this.data.regionIndex].regionId;
    network.POST({
      params: params,
      requestUrl: requestUrl.getStreetListUrl,
      success: function(res) {
        console.log(res.data.data);
        if (res.data.code == 0) {
          that.setData({
            street: res.data.data
          })

          if (that.data.streetId) {
            console.log(that.data.streetId);
            console.log(that.data.street);
            for (var i in that.data.street) { //x = index

              if (that.data.streetId == that.data.street[i].id) {
                that.setData({
                  isStreet: true,
                  isStreetChoose: false,
                  streetIndex: i,
                })
              }
            }
          }

        } else {}
      },
      fail: function(res) {
        util.toast("网络异常, 请稍后再试");
      }
    });
  },

  // 选择省
  provincesTap: function() {
    this.setData({
      isProvinces: false,
    });
  },
  cancelProvinces: function() {
    if (!this.data.selectProvinces) {
      this.setData({
        isProvinces: true,
      });
    }
  },

  provincesChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      selectProvinces: true,
      isCitys: true,
      provinceName: this.data.provinces[this.data.provincesIndex].provinceName,
    })
    if (e.detail.value != this.data.provincesIndex) {
      this.setData({
        provincesIndex: e.detail.value,
        citysIndex: 0,
        isCitysChoose: true,
        isAreas: false,
        isStreet: false,
      })
    }

    this.getCity();
  },




  // 选择市区

  citysTap: function() {
    this.setData({
      isCitysChoose: false,
    });
  },
  cancelCitys: function() {
    if (!this.data.selectCitys) {
      this.setData({
        isCitysChoose: true,
      });
    }
  },
  citysChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    console.log(e.detail.value);
    this.setData({
      selectCitys: true,
      isAreas: true,
      cityName: this.data.citys[this.data.citysIndex].cityName,
    })
    if (this.data.citysIndex != e.detail.value) {
      this.setData({
        citysIndex: e.detail.value,
        isareasChoose: true,
        regionIndex: 0,
        isStreet: false,
      })
    }

    this.getRegionList();
  },

  // 选择县
  areasTap: function() {
    this.setData({
      isareasChoose: false,
    });


  },
  cancelAreas: function() {
    if (!this.data.selectAreas) {
      this.setData({
        isareasChoose: true,
      });
    }
    console.log(22222222);
  },
  areasChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    console.log(e.detail.value);
    this.setData({
      selectareas: true,
      isStreet: true,
      reginName: this.data.regins[this.data.regionIndex].regionName,
    })
    if (this.data.regionIndex != e.detail.value) {
      this.setData({
        regionIndex: e.detail.value,
        isStreetChoose: true,
        streetIndex: 0,
      })
    }


    console.log(this.data.isareasChoose);
    console.log('11111111');

    this.getStreetList();
  },


  // 选择街道
  streetTap: function() {
    this.setData({
      isStreetChoose: false,
    });
  },
  cancelAreas: function() {
    if (!this.data.selectStreet) {
      this.setData({
        isStreetChoose: true,
      });
    }
  },
  streetChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    console.log(e.detail.value);
    this.setData({
      streetIndex: e.detail.value,
      selectStreet: true,
      isAreas: true,
      streetName: this.data.street[this.data.streetIndex].streetName
    })
    if (this.data.streetIndex != e.detail.value) {}

  },



  onLoad: function(options) {
    if (options.address) {
      let address = JSON.parse(options.address);
      this.setData({
        provinceId: address.provinceId,
        cityId: address.cityId,
        regionId: address.regionId,
        streetId: address.streetId,
        inputName: address.name,
        inputPhone: address.phone,
        detailAddress: address.detailAddress,
        checked: address.isDefaultAddress == '1',
        id: address.id,
        isEdit: true
      });
      //更改当前小程序的标题
      wx.setNavigationBarTitle({
        title: "修改收货地址"
      });
    } else {
      //更改当前小程序的标题
      wx.setNavigationBarTitle({
        title: "新增收货地址"
      });
    }
    this.getProvince();
  },


  // 点击是否默认
  switchChange: function(e) {
    console.log('switch1 发生 change 事件，携带值为', e.detail.value)
    if (e.detail.value) {
      this.setData({
        isDefault: true
      })
    }
  },



  deleteAddress: function() {
    var that = this;
    var params = new Object();
    params.uid = wx.getStorageSync("UIDKEY");
    params.uid = '1';
    params.start = 0;
    params.size = 2; //能直接获取全部吗
    network.POST({
      params: params,
      requestUrl: requestUrl.deleteAddressUrl,
      success: function(res) {
        console.log(res.data.data);
        if (res.data.code == 0) {
          that.setData({
            address: res.data.data
          })
        } else {}

      },
      fail: function(res) {
        util.toast("网络异常, 请稍后再试");
      }
    });
  },

  // 删除收货地址
  deleteAddress: function() {
    var that = this;
    var params = new Object();
    params.uid = wx.getStorageSync("UIDKEY");
    params.id = this.data.id;
    network.POST({
      params: params,
      requestUrl: requestUrl.deleteAddressUrl,
      success: function(res) {
        console.log(res.data.data);
        if (res.data.code == 0) {
          wx.navigateBack({})
        } else {}

      },
      fail: function(res) {
        util.toast("网络异常, 请稍后再试");
      }
    });
  },

  addAddressUrl: function() {
    var that = this;
    var params = new Object();
    params.uid = wx.getStorageSync("UIDKEY");
    params.name = this.data.inputName;
    params.phone = this.data.inputPhone;
    params.provinceId = this.data.provinces[this.data.provincesIndex].provinceId;
    params.provinceName = this.data.provinces[this.data.provincesIndex].provinceName;

    params.cityId = this.data.citys[this.data.citysIndex].cityId;
    params.cityName = this.data.citys[this.data.citysIndex].cityName;

    params.regionId = this.data.regins[this.data.regionIndex].regionId;
    params.regionName = this.data.regins[this.data.regionIndex].regionName;

    params.streetId = this.data.street[this.data.streetIndex].streetId;
    params.streetName = this.data.street[this.data.streetIndex].streetName;

    params.detailAddress = this.data.detailAddress;
    params.isDefaultAddress = this.data.isDefault ? '1' : '0';

    network.POST({
      params: params,
      requestUrl: requestUrl.addAddressUrl,
      success: function(res) {
        console.log(res.data.data);
        if (res.data.code == 0) {
          wx.navigateBack();
        } else {
          util.toast("1");

        }

      },
      fail: function(res) {
        util.toast("网络异常, 请稍后再试");
      }
    });
  },


  updateAddress: function() {
    var that = this;
    var params = new Object();
    params.uid = wx.getStorageSync("UIDKEY");
    params.id = this.data.id;

    params.name = this.data.inputName;
    params.phone = this.data.inputPhone;
    params.provinceId = this.data.provinces[this.data.provincesIndex].provinceId;
    params.provinceName = this.data.provinces[this.data.provincesIndex].provinceName;

    params.cityId = this.data.citys[this.data.citysIndex].cityId;
    params.cityName = this.data.citys[this.data.citysIndex].cityName;


    params.regionId = this.data.regins[this.data.regionIndex].regionId;
    params.regionName = this.data.regins[this.data.regionIndex].regionName;

    params.streetId = this.data.street[this.data.streetIndex].streetId;
    params.streetName = this.data.street[this.data.streetIndex].streetName;

    params.detailAddress = this.data.detailAddress;
    params.isDefaultAddress = this.data.isDefault ? '1' : '0';

    network.POST({
      params: params,
      requestUrl: requestUrl.updateAddressUrl,
      success: function(res) {
        console.log(res.data.data);
        if (res.data.code == 0) {
          wx.navigateBack();
        } else {
          util.toast("1");
        }
      },
      fail: function(res) {
        util.toast("网络异常, 请稍后再试");
      }
    });
  },

  sureSave: function() {
    // 调用保存按钮
    // 判断是否是编辑  编辑调用保存接口     新增调用新增接口
    if (this.data.isEdit) { //  编辑
      if (this.data.inputName) {
        if (this.data.inputPhone) {
          this.updateAddress();

        } else {
          util.toast("请输入电话");

        }

      } else {
        util.toast("请输入姓名");
      }

    } else {
      if (this.data.inputName) {
        if (this.data.inputPhone) {
          if (this.data.provinceName) {
            if (this.data.cityName) {

              if (this.data.reginName) {
                if (this.data.streetName) {
                  this.addAddressUrl();

                } else {
                  util.toast("请选择街道");
                }
              } else {
                util.toast("请选择区");
              }

            } else {
              util.toast("请选择市");
            }
          } else {
            util.toast("请选择省");

          }


        } else {
          util.toast("请输入手机号");
        }


      } else {
        util.toast("请输入姓名");
      }

    }


  },

  // 输入姓名
  bindName: function(e) {
    this.setData({
      inputName: e.detail.value
    })
  },
  deleteName: function() {
    this.setData({
      inputName: ''
    })
  },

  // 输入电话
  bindPhone: function(e) {
    this.setData({
      inputPhone: e.detail.value
    })
  },
  deletePhone: function() {
    this.setData({
      inputPhone: ''
    })
  },
  // 输入详细地址
  detailAddress: function(e) {
    this.setData({
      detailAddress: e.detail.value
    })
  },
  deleteDetail: function () {
    this.setData({
      detailAddress: ''
    })
  },
  //清空 省 市 区 街道
  deleteProvinces: function () {
    this.setData({
      isProvinces: true,
      isAreas: false,
      isStreet: false,
      isCitys:false

    })
  },
  deleteCity: function () {
    this.setData({
      isCitysChoose: true,
      isAreas: false,
      isStreet:false,

    })
  },
  deleteRegion: function () {
    this.setData({
      isareasChoose: true,
      isStreet:false
    })
  },
  deleteStreet: function () {
    this.setData({
      isStreetChoose: true
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'linear',
    })
    this.animation = animation



  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})