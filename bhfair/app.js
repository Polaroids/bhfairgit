//app.js
App({
  onLaunch: function () {
    var self=this
    // 展示本地存储能力
    wx.BaaS = requirePlugin('sdkPlugin')
    //让插件帮助完成登录、支付等功能
    wx.BaaS.wxExtend(wx.login,
      wx.getUserInfo,
      wx.requestPayment)

    wx.BaaS.init('68168971994515bca615')
     
    //获取屏幕的宽高
    wx.getSystemInfo({
      success: function(res) {
          self.globalData.windowWidth=res.windowWidth
          self.globalData.windowHeight=res.windowHeight
      },
      fail:function(res){
        console.log('fail',res)
      }
    })
  },
  globalData: {
    userInfo: {
      id: null, //用户在用户表中的 ID
      openid: "",//用户唯一标识
      unionid: "",//用户在开放平台的唯一标识符
      avatarUrl: '/images/test.jpg',
      city: "",
      country: "",
      gender: "",
      language: "",
      nickName: "未知",
      province: "",
      created_by:null
    },
    hasuserinfo:false,
    windowWidth:null,
    windowHeight:null,
    comment_tableID: 50161,
    store_tableID:50757,
    product_tableID:51047
  }
})