/**
 * 小程序配置文件,主要是网络请求地址配置,如有网络请求，请将url在这里配置,使用的时候在.js中引入：
 * const requestUrl = require('../../../../config').getSession
 */
// var host = "https://dymapi.xiaqiu.cn/card"  //日常


var host = "https://card.shuqudata.com/card"  //线上
// var host = "http://192.168.0.144:8080/card"  //宏旺

// var host = "http://192.168.1.131:8080/card"  //建世

// var host = "http://iburap.k'.com/mockjs/26"
//这里用来配置所有请求地址
var config = {
  host,
  getSessionUrl: `${host}/card/getSession.do`,    //获取session
  getSimpleDicByConditionUrl: `${host}/dic/getSimpleDicByCondition.do`,    //获取添加更多信息的tag&&获取厂商
  getCardListUrl: `${host}/cardUserMapping/getCardUserMappingByCondition.do`,  //获取名片列表，这里是获取好友名片列表和待接收名片列表
  addUser: `${host}/user/addUser.do`, //用户信息
  getVerificationCodeUrl: `${host}/user/getVerificationCode.do`, //据手机号获取验证码
  getCheckVerificationCodeUrl: `${host}/user/getCheckVerificationCode.do`,//对手机验证码进行校验
  getTag: `${host}/card/getTag.do`, //更多信息时的标签
  checkSession: `${host}/user/checkSession.do`,   //检测session是否过期
  wxAppLoginUrl: `${host}/user/login.do`,   //检测登录
  getSimpleCardByConditionUrl: `${host}/card/getSimpleCardByCondition.do`,   //获取自己的名片列表
  addCardUrl: `${host}/card/addCard.do`, //添加名片列表
  updateCardUrl: `${host}/card/updateCard.do`, //修改名片列表
  deleteCardUrl: `${host}/card/deleteCard.do`, //删除自己名片列表
  checkIsSaveUrl: `${host}/cardUserMapping/checkIsSave.do`,//是否已经收藏
  addCardUserMappingUrl: `${host}/cardUserMapping/addCardUserMapping.do`,//收藏名片
  importCardUrl: `${host}/batchImport/batchImportDataForCC.do`,     //导入名片
  sendTemplateMessageUrl: `${host}/common/sendMessage.do`,      //发送模板消息
  feedBackUrl: `${host}/comments/addComments.do`,       //意见反馈
  getDecryptPhoneUrl: `${host}/common/getDecryptPhone.do`,      //获取解密后的手机号
  scanCardUrl: `${host}/card/scanCard.do`,       //名片识别
  receiveuserMappingUrl: `${host}/cardUserMapping/receviceCardUserMapping.do`,   //接受名片
  returnCardUserMappingUrl: `${host}/cardUserMapping/returnCardUserMapping.do`,  //回递名片
  getSimilarCardByPhoneUrl: `${host}/card/getSimilarCardByPhone.do`,   //获取手机号相同的类似名片
  deleteOthersCardUrl: `${host}/cardUserMapping/deleteCardUserMapping.do`,   //删除他人的名片
  searchCardUrl: `${host}/cardUserMapping/searchCardUserMappingByCondition.do`,   //在名片夹中搜索名片
  // saveFormIdUrl: `${host}/my/saveFormId.do`,  //保存formId
  cutCardUrl: `${host}/card/cutCard.do`,   //区域裁剪

  //运营活动
  checkJoinActivityUrl: `${host}/userTeamActivityMapping/checkJoinActivity.do`,  //检测是否已经报名活动
  getActiveActivityUrl: `${host}/activity/getActiveActivityByCondition.do`,  //获取正在进行的活动，目前只返回一个正在进行的活动
  joinActivityUrl: `${host}/userTeamActivityMapping/joinActivity.do`, //报名参加活动
  getMoreDicByConditionUrl: `${host}/dic/getMoreDicByCondition.do`, //奖品展示列表和积分获取方式列表
  getPrintCardPageInfoUrl: `${host}/cardTemplate/getCardAndTemplateByCondition.do`,  //获取打印名片页面的名片信息
  printCardUrl: `${host}/printCard/applyPrintCard.do`,   //提交打印名片信息
  checkTeamLeaderUrl: `${host}/team/checkTeamLeader.do`,   //检测当前用户是否是团长
  checkJoinTeamUrl: `${host}/userTeamActivityMapping/checkJoinTeam.do`,   //检测是否参加团队
  getUserDetailIntegralUrl: `${host}/userTeamActivityMapping/getUserDetailIntegral.do`, //获取当前用户的积分
  checkPrintCardUrl: `${host}/printCard/checkPrintCard.do`, //检测是否可以免费领奖进入领取名片
  getContactsIntegralTopUrl: `${host}/userTeamActivityMapping/getContactsIntegralTop.do`,//获取人脉排行榜积分排名，size和start用于进行分页查询，表示从第start条开始查询，总数是size条
  getTeamInfoUrl: `${host}/team/getTeamMemberByCondition.do`,   //获取团队详情
  createTeamUrl: `${host}/team/creatTeam.do`,   //创建团队
  getIntegralTopInTeamUrl: `${host}/userTeamActivityMapping/getIntegralTopInTeam.do`,   //获取当前团队中的人员的积分排名
  updateUserInfoUrl: `${host}/user/updateUser.do`,   //更新用户信息
  joinTeamUrl: `${host}/userTeamActivityMapping/joinTeam.do`,   //加入team
  addFormIdUrl: `${host}/userFormMapping/addUserFormMapping.do`,   //保存formid
  checkActivityDoingUrl:`${host}/activity/checkActivity.do`  //检测活动是否正在进行

}
module.exports = config