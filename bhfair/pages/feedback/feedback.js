// pages/feedback/feedback.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
 
  },
  //提交反馈
  send:function(e){
    
    let data={
      id: app.globalData.userInfo.id,
      content: e.detail.value.content
    }
    if(data.content!=""){
    wx.showLoading({
      title: '正在提交'
    })
    wx.BaaS.invokeFunction('feedback',data).then(res=>{
      wx.hideLoading()
      wx.showToast({
        title: '成功提交',
        icon:"success",
        duration:2000
      })
    },err=>{
      wx.hideLoading()
      wx.showToast({
        title: '提交失败',
        icon:"none",
        duration:2000
      })
    })
    }
    else{
      wx.showToast({
        title: '反馈不能为空',
        icon: "none",
        duration: 2000
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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