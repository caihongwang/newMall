/**
 * 小程序配置文件,主要是网络请求地址配置,如有网络请求，请将url在这里配置,使用的时候在.js中引入：
 * const requestUrl = require('../../../../config').getSession
 */
// var host = "https://dymapi.xiaqiu.cn/card"  //日常

var host = "https://www.91caihongwang.com/newMall"  //线上

// var host = "http://192.168.43.196:8080/newMall" //宏旺

var config = {
  host,
  getSessionUrl: `${host}/card/getSession.do`,    //获取session
  addUser: `${host}/user/addUser.do`, //用户信息
// 微信积分商场接口

  getSimpleShopByCondition: `${host}/wxShop/getSimpleShopByCondition.do`,    //首页获取商家列表
  getShopByCondition: `${host}/wxShop/getShopByCondition.do`,  //获取商家具体信息
  getOrderSortTypeList: `${host}/wxShop/getOrderSortTypeList.do`,  //获取商家排序类型
  getMenuByConditionUrl: `${host}/wxFood/getMenuByCondition.do`,  //获取商家菜单列表

  // 登录机制 
  getUserBaseInfo: `${host}/wxUser/getUserBaseInfo.do`,   //获取用户基本信息
  wxAppLoginUrl: `${host}/wxUser/login.do`,   //检测登录
  updateUserUrl: `${host}/wxUser/updateUser.do`, //更新用户信息信息
  checkSession: `${host}/wxUser/checkSession.do`,   //检测session是否过期
  getUserBaseInfoUrl: `${host}/wxUser/getUserBaseInfo.do`,   //获取积分等数据

  // 商城积分
  getProductTypeListUrl: `${host}/wxProduct/getProductTypeList.do`,   //获取积分商商品类型列表
  getSimpleProductByCondition: `${host}/wxProduct/getSimpleProductByCondition.do`,   //获取单一积分商品列表
  getProductListUrl: `${host}/wxProduct/getProductList.do`,   //获取积分商品列表
  getProductDetailUrl: `${host}/wxProduct/getProductDetail.do`,   //获取积分商品列表

  // 地址管理
  getProvinceListUrl: `${host}/wxAddress/getProvinceList.do`,   //获取省份地址
  getCityListUrl: `${host}/wxAddress/getCityList.do`,   //获取市区地址
  getRegionListUrl: `${host}/wxAddress/getRegionList.do`,   //获取街道地址
  getStreetListUrl: `${host}/wxAddress/getStreetList.do`,   //获取街道地址
  getAddressListUrl: `${host}/wxAddress/getSimpleAddressByCondition.do`,   //获取用户当前收货地址
  addAddressUrl: `${host}/wxAddress/addAddress.do`,   //添加收货地址
  updateAddressUrl: `${host}/wxAddress/updateAddress.do`,   //更新收货地址
  deleteAddressUrl: `${host}/wxAddress/deleteAddress.do`,   //删除收货地址

// 抽奖奖励
  getAllLuckDrawUrl: `${host}/wxLuckDraw/getAllLuckDrawShopByCondition.do`,   //获取商家全部订单
  getWaitLuckDrawUrl: `${host}/wxLuckDraw/getWaitLuckDrawShopByCondition.do`,   //获取等待奖励的商家列表
  getRecevicedLuckDrawUrl: `${host}/wxLuckDraw/getRecevicedLuckDrawShopByCondition.do`,   //获取已领取奖励的商家列表

  getAllLuckDrawRankUrl: `${host}/wxLuckDraw/getAllLuckDrawRankByCondition.do`,   //【全部奖励】获取某商家参与领取奖励的队列
  getWaitLuckDrawRankUrl: `${host}/wxLuckDraw/getWaitLuckDrawRankByCondition.do`,   //【等待奖励】获取某商家下待领取奖励的队列
  getRecevicedLuckDrawRankUrl: `${host}/wxLuckDraw/getRecevicedLuckDrawRankByCondition.do`,   //【获得奖励】获取某商家下已领取奖励的队列
  convertIntegralUrl: `${host}/wxLuckDraw/convertIntegral.do`,   //奖励转换用户积分
  getLuckDrawUrl: `${host}/wxLuckDraw/getLuckDraw.do`,   //点击【抽奖】即添加抽奖信息
  getLuckDrawProductListUrl: `${host}/wxLuckDraw/getLuckDrawProductList.do`,   //点击【抽奖】即添加抽奖信息
  deleteLuckDrawUrl: `${host}/wxLuckDraw/deleteLuckDraw.do`,   //修改中奖信息

  
  // 加盟
  getLeagueTypeUrl: `${host}/wxLeague/getLeagueTypeList.do`,   //获取加盟类型列表
  addLeagueUrl: `${host}/wxLeague/addLeague.do`,   //添加加盟商

  // 调用支付接口
  payTheBillInMiniUrl: `${host}/wxOrder/payTheBillInMiniProgram.do`,   //调用支付接口
  purchaseProductInMiniProgramUrl: `${host}/wxOrder/purchaseProductInMiniProgram.do`,   //获取积分等数据

  //提现
  getCashFeeListUrl: `${host}/wxCashLog/getCashFeeList.do`,   //获取提现规则列表  暂时没调用
  getSimpleCashLogByConditionUrl: `${host}/wxCashLog/getSimpleCashLogByCondition.do`,   //获取当前用户的提现列表
  cashBalanceUrl: `${host}/wxCashLog/cashBalanceToWx.do`,   //提现至微信零钱  

  // 订单管理接口
  getAllPayGoodsOrderUrl: `${host}/wxOrder/getAllPayGoodsOrder.do`,   //所有订单
  getWaitPayGoodsUrl: `${host}/wxOrder/getWaitPayGoodsOrder.do`,   //待支付
  getAlreadyPayGoodsUrl: `${host}/wxOrder/getAlreadyPayGoodsOrder.do`,   //已支付
  getAlreadyDeliverGoodsUrl: `${host}/wxOrder/getAlreadyDeliverGoodsOrder.do`,   //  已发货 
  getCompletedGoodsUrl: `${host}/wxOrder/getCompletedGoodsOrder.do`,   //已完成
  getGoodsOrderDetailByIdUrl: `${host}/wxOrder/getGoodsOrderDetailById.do`,   //已完成

  getSimpleIntegralLogByConditionUrl: `${host}/wxIntegralLog/getSimpleIntegralLogByCondition.do`,   //积分记录列表
  getSimpleBalanceLogByConditionUrl: `${host}/wxBalanceLog/getSimpleBalanceLogByCondition.do`,   //余额记录列表

  
}
module.exports = config