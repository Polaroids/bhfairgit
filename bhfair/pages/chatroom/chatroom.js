// pages/chatroom/chatroom.js
const app=getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    my_id:null,     //我的id
    his_id:null,
    his_nick:"未知",
    focus:false,
    input:"",
    msgs:[{
      id:67834404,
      avatar:'https://media.ifanrusercontent.com/tavatar/db/c2/dbc2d5073fc100d87cb8fb57cfe8e3650ea3b451.jpg',
      time:'12:03',
      content:"在吗"
    },{
      id:67834189,
      avatar:'https://media.ifanrusercontent.com/tavatar/64/68/6468f879e5eabdfebc78ecaf6f065f4a3dd85495.jpg',
      time:'12:05',
      content: '在的'
    }]
  },
  //获得焦点
  getfocus:function(){
    this.setData({
      focus:true
    })
  },
  //发送消息
  sendmsg:function(e){
    console.log(e.detail.value)
    this.setData({
      input:""
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(this.data.my_id)
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
    this.setData({
      my_id: app.globalData.userInfo.id,     //我的id
    })
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