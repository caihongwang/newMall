/**
 * 小程序配置文件,主要是网络请求地址配置,如有网络请求，请将url在这里配置,使用的时候在.js中引入：
 * const requestUrl = require('../../../../config').getSession
 */

// var host = "http://localhost:9040/newMall";                //本地

// var host = "https://dymapi.xiaqiu.cn/card"  //日常

var host = "https://www.91caihongwang.com/newMall"  //线上

// var host = "http://127.0.0.1:8080/newMall" //红旺

var config = {
  host,

  accountId: "gh_a0f2371300f9",
  accountName: "新商城",
  accountsecret: "e24a1be70e14c9f04a1bb5f61e7d82e8",

  getSessionUrl: `${host}/card/getSession`,    //获取session
  addUser: `${host}/user/addUser`, //用户信息

  // 微信积分商场接口
  getSimpleShopByCondition: `${host}/wxShop/getSimpleShopByCondition`,    //首页获取商家列表
  getShopByCondition: `${host}/wxShop/getShopByCondition`,  //获取商家具体信息
  getOrderSortTypeList: `${host}/wxShop/getOrderSortTypeList`,  //获取商家排序类型
  getMenuByConditionUrl: `${host}/wxFood/getMenuByCondition`,  //获取商家菜单列表

  // 登录机制
  getOauthTokenUrl: `${host}/oauth/token`,          //获取权限
  getUserBaseInfo: `${host}/wxUser/getUserBaseInfo`,   //获取用户基本信息
  wxAppLoginUrl: `${host}/wxUser/login`,   //检测登录
  updateUserUrl: `${host}/wxUser/updateUser`, //更新用户信息信息
  checkSession: `${host}/wxUser/checkSession`,   //检测session是否过期
  getUserBaseInfoUrl: `${host}/wxUser/getUserBaseInfo`,   //获取积分等数据

  // 商城积分
  getProductTypeListUrl: `${host}/wxProduct/getProductTypeList`,   //获取积分商商品类型列表
  getSimpleProductByCondition: `${host}/wxProduct/getSimpleProductByCondition`,   //获取单一积分商品列表
  getProductListUrl: `${host}/wxProduct/getProductList`,   //获取积分商品列表
  getProductDetailUrl: `${host}/wxProduct/getProductDetail`,   //获取积分商品列表

  // 地址管理
  getProvinceListUrl: `${host}/wxAddress/getProvinceList`,   //获取省份地址
  getCityListUrl: `${host}/wxAddress/getCityList`,   //获取市区地址
  getRegionListUrl: `${host}/wxAddress/getRegionList`,   //获取街道地址
  getStreetListUrl: `${host}/wxAddress/getStreetList`,   //获取街道地址
  getAddressListUrl: `${host}/wxAddress/getSimpleAddressByCondition`,   //获取用户当前收货地址
  addAddressUrl: `${host}/wxAddress/addAddress`,   //添加收货地址
  updateAddressUrl: `${host}/wxAddress/updateAddress`,   //更新收货地址
  deleteAddressUrl: `${host}/wxAddress/deleteAddress`,   //删除收货地址

  // 抽奖奖励
  getAllLuckDrawUrl: `${host}/wxLuckDraw/getAllLuckDrawShopByCondition`,   //获取商家全部订单
  getWaitLuckDrawUrl: `${host}/wxLuckDraw/getWaitLuckDrawShopByCondition`,   //获取等待奖励的商家列表
  getRecevicedLuckDrawUrl: `${host}/wxLuckDraw/getRecevicedLuckDrawShopByCondition`,   //获取已领取奖励的商家列表

  getAllLuckDrawRankUrl: `${host}/wxLuckDraw/getAllLuckDrawRankByCondition`,   //【全部奖励】获取某商家参与领取奖励的队列
  getWaitLuckDrawRankUrl: `${host}/wxLuckDraw/getWaitLuckDrawRankByCondition`,   //【等待奖励】获取某商家下待领取奖励的队列
  getRecevicedLuckDrawRankUrl: `${host}/wxLuckDraw/getRecevicedLuckDrawRankByCondition`,   //【获得奖励】获取某商家下已领取奖励的队列
  convertIntegralUrl: `${host}/wxLuckDraw/convertIntegral`,   //奖励转换用户积分
  getLuckDrawUrl: `${host}/wxLuckDraw/getLuckDraw`,   //点击【抽奖】即添加抽奖信息
  getLuckDrawProductListUrl: `${host}/wxLuckDraw/getLuckDrawProductList`,   //点击【抽奖】即添加抽奖信息
  deleteLuckDrawUrl: `${host}/wxLuckDraw/deleteLuckDraw`,   //修改中奖信息

  
  // 加盟
  getLeagueTypeUrl: `${host}/wxLeague/getLeagueTypeList`,   //获取加盟类型列表
  addLeagueUrl: `${host}/wxLeague/addLeague`,   //添加加盟商

  // 调用支付接口
  payTheBillInMiniUrl: `${host}/wxOrder/payTheBillInMiniProgram`,   //调用支付接口
  purchaseProductInMiniProgramUrl: `${host}/wxOrder/purchaseProductInMiniProgram`,   //获取积分等数据

  // 提现
  getCashFeeListUrl: `${host}/wxCashLog/getCashFeeList`,   //获取提现规则列表  暂时没调用
  getSimpleCashLogByConditionUrl: `${host}/wxCashLog/getSimpleCashLogByCondition`,   //获取当前用户的提现列表
  cashBalanceUrl: `${host}/wxCashLog/cashBalanceToWx`,   //提现至微信零钱  

  // 订单管理接口
  getAllPayGoodsOrderUrl: `${host}/wxOrder/getAllPayGoodsOrder`,   //所有订单-商城订单
  getWaitPayGoodsUrl: `${host}/wxOrder/getWaitPayGoodsOrder`,   //待支付-商城订单
  getAlreadyPayGoodsUrl: `${host}/wxOrder/getAlreadyPayGoodsOrder`,   //已支付-商城订单
  getAlreadyDeliverGoodsUrl: `${host}/wxOrder/getAlreadyDeliverGoodsOrder`,   //  已发货-商城订单 
  getCompletedGoodsUrl: `${host}/wxOrder/getCompletedGoodsOrder`,   //已完成-商城订单
  getGoodsOrderDetailByIdUrl: `${host}/wxOrder/getGoodsOrderDetailById`,   //获取商城订单详情

  getAllFoodsOrderUrl: `${host}/wxOrder/getAllFoodsOrder`,   //所有订单-点餐订单
  getWaitPayFoodsUrl: `${host}/wxOrder/getWaitPayFoodsOrder`,   //待支付-点餐订单
  getAlreadyPayFoodsUrl: `${host}/wxOrder/getAlreadyPayFoodsOrder`,   //已支付-点餐订单
  getFoodsOrderDetailByIdUrl: `${host}/wxOrder/getFoodsOrderDetailById`,   //获取点餐订单详情

  getSimpleIntegralLogByConditionUrl: `${host}/wxIntegralLog/getSimpleIntegralLogByCondition`,   //积分记录列表
  getSimpleBalanceLogByConditionUrl: `${host}/wxBalanceLog/getSimpleBalanceLogByCondition`,   //余额记录列表

}
module.exports = config