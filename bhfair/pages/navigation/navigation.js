// pages/navigation/navigation.js
const app=getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    items: [{ name: '鞋包服饰'},{ name: '电子设备'},{ name: '图书'},{ name: '食品'}]
  },
  //选择类别，导航到相应页面
  selecttype:function(e){
   var id=e.target.dataset.index  //类别序号
   var item_url='/pages/item_list/item_list?name='+this.data.items[id].name
   
   wx.navigateTo({
     url: item_url,
     fail:function(){
       console.log('fail to ',item_url,err)
     }
   })
  },
  //去发布
  gotopost:function(e){
    //判断是否已授权登陆
    var self=this
    if(!app.globalData.hasuserinfo){
      //若没授权先授权
      wx.showModal({
        title: '',
        content: '是否授权登录？',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确认');
            self.userInfoHandler(e)
            app.globalData.hasuserinfo=true
            wx.navigateTo({
              url: '/pages/postproduct/postproduct',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
    else{
      wx.navigateTo({
        url: '/pages/postproduct/postproduct',
      })
    }
  },
  //获得用户信息
  userInfoHandler: function (e) {
    var self = this
    wx.BaaS.handleUserInfo(e).then(res => {
      // res 包含用户完整信息，详见下方描述
      app.globalData.userInfo = {
        id: res.id,
        openid: res.openid,
        unionid: res.unionid,
        city: res.city,
        country: res.country,
        gender: res.gender,
        language: res.language,
        nickName: res.nickName,
        province: res.provincvince,
        avatarUrl: res.avatarUrl
      }
      app.globalData.userInfo.hasuserinfo = true
      console.log("success");
      console.log(app.globalData.userInfo)
    }, res => {
      // **res 有两种情况**：用户拒绝授权，res 包含基本用户信息：id、openid、unionid；其他类型的错误，如网络断开、请求超时等，将返回 Error 对象（详情见下方注解）
      console.log("failure",res);
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.connectSocket({
    //   url: 'wss://140.143.14.239:3000',
    //   data: {send_id:"1041165394"},
    //   method: 'GET',
    //   success: function (res) {
    //     console.log(res)
    //     console.log("connectSocket 成功")
    //   },
    //   fail: function (res) {
    //     console.log(res)
    //     console.log("connectSocket 失败")
    //   }
    // })
    // wx.onSocketOpen(function () {
    //   // callback
    //   var mCmd = { "cmd": "connect.Connect", "data": {} }
    //   wx.sendSocketMessage({
    //     data: JSON.stringify(mCmd),
    //     success: function (res) {
    //       console.log(res)
    //       console.log("sendSocketMessage 成功")
    //     },
    //     fail: function (res) {
    //       console.log(res)
    //       console.log("sendSocketMessage 失败")
    //     }
    //   });

    //   wx.onSocketMessage(function (data) {
    //     console.log("onSocketMessage ", data)
    //   })
    // })


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