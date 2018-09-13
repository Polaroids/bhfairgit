//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    avatarUrl: null,
    nickName: null,
    showcode:false,
    showhelp:false,
    codesrc: "",
    form_id:null,
  },
  //去反馈
  feedback:function(){
    var self = this
    if (!app.globalData.hasuserinfo) {//如果用户没登录
      wx.showModal({
        title: '',
        content: '请点击头像登录',
        showCancel: false
      })
    }
    else {
      wx.navigateTo({
        url: '/pages/feedback/feedback',
      })
    }
  },
  //去收藏夹
  gotomystore:function(e){
    var self=this
    if (!app.globalData.hasuserinfo) {//如果用户没登录
      wx.showModal({
        title: '',
        content: '请点击头像登录',
        showCancel:false
      })
    }
    else{
      wx.navigateTo({
        url: '/pages/mystore/mystore',
      })
    }
  },
  //去我的发布
  gotomyproduct:function(){
    var self = this
    if (!app.globalData.hasuserinfo) {//如果用户没登录
      wx.showModal({
        title: '',
        content: '请点击头像登录',
        showCancel: false
      })
    }
    else {
      wx.navigateTo({
        url: '/pages/myproduct/myproduct',
      })
    }
  },
  //设置二维码
  setcode:function(){
    var self = this
    wx.chooseImage({
      count:1,
      sourceType:'album',
      success: function(res) {
        var myfile = new wx.BaaS.File()  //实例化一个对象
        var filepath = { filePath: res.tempFilePaths[0]}  //临时路径
        myfile.upload(filepath).then(res=>{
            var temp=res.data.path //云地址
            //更新用户数据库
            let myuser = new wx.BaaS.User()
            let currentuser = myuser.getCurrentUserWithoutData()

            currentuser.set('code',temp).update().then(res=>{
              //更新成功
              self.setData({
                codesrc:temp
              })
            },err=>{
                console.log('更新失败')
            })
        })

      },
      fail:function(){
        wx.showToast({
          title: '选择失败或没有选择',
          icon:'none',
          duration:2000
        })
      }
    })
  },
  formSubmit: function (e) {
    if (app.globalData.userInfo.openid != "" && e.detail.formId !="the formId is a mock one"){
      this.setData({
        form_id: e.detail.formId,
      })
      let tableID = 50899
      let Product = new wx.BaaS.TableObject(tableID)
      let product = Product.create()

      // 设置方式一
      let data = {
        formId:this.data.form_id,
        openid: app.globalData.userInfo.openid
      }

      product.set(data).save().then(res => {
        // success
        console.log("success:",data,"and",res)
      }, err => {
        // err
        console.log("failure:", data, "and", err)
      })
    }
  },
  //显示帮助
  showhelp:function(){
    this.setData({
      showhelp: true
    })
  },
  //隐藏帮助
  hidehelp:function(){
    this.setData({
      showhelp: false
    })
  },
  //显示收款码
  showcode:function(){
    var self = this
    if (!app.globalData.hasuserinfo) {//如果用户没登录
      wx.showModal({
        title: '',
        content: '请点击头像登录',
        showCancel: false
      })
    }
    else {
      this.setData({
        showcode: true
      })
    }
  },
  //用户点击confirm
  confirm:function(){
    this.setData({
      showcode:false
    })
  },
  //用户授权登陆
  authorize:function(e){
    var self = this
    if(!app.globalData.hasuserinfo){//如果用户没登录
      wx.showModal({
        title: '',
        content: '是否授权登录？',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确认');
            self.userInfoHandler(e)
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
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
      let myuser =new wx.BaaS.User()
      let userid=res.id
      myuser.get(userid).then(res=>{
        self.setData({
          codesrc:res.data.code
        })
      })
      app.globalData.hasuserinfo = true
      self.setData({
        avatarUrl: app.globalData.userInfo.avatarUrl,
        nickName: app.globalData.userInfo.nickName   
      })
      console.log("success");
    }, res => {
      // **res 有两种情况**：用户拒绝授权，res 包含基本用户信息：id、openid、unionid；其他类型的错误，如网络断开、请求超时等，将返回 Error 对象（详情见下方注解）
      console.log("failure");
    })
  },
  onLoad: function () {
    var self=this
    if (app.globalData.hasuserinfo && this.data.codesrc == "") {
      console.log('src')
      let myuser = new wx.BaaS.User()
      let userid = app.globalData.userInfo.id
      myuser.get(userid).then(res => {
        self.setData({
          codesrc: res.data.code
        })
      })
    }
  },
  onShow:function(){
    var self=this
    this.setData({
      avatarUrl: app.globalData.userInfo.avatarUrl,
      nickName: app.globalData.userInfo.nickName
    })
  }
})