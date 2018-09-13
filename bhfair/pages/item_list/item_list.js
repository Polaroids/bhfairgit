// pages/item_list/item_list.js
const app=getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    name:"", //商品的类别
    item_info: [], //后续浏览次数，喜欢，评论。。。//商品信息
    offset:0
  },
  //进入详细页
  enter:function(e){
    wx.navigateTo({
      url: "/pages/item/item?id="+e.currentTarget.dataset.id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      name:options.name,
    })
    //加载商品信息
    this.loaditems()
  },
  //滚到底部，继续加载
  loadmore:function(){
    this.loaditems()
  },
  //加载10个商品，不足10个则全部加载
  loaditems:function(){
    var self=this
    let tableID = app.globalData.product_tableID    //商品表格
    let tableobject=new wx.BaaS.TableObject(tableID)
    let query =new wx.BaaS.Query()

    query.compare('types','=',self.data.name)//设置查询条件
    tableobject.setQuery(query).orderBy('-updated_at').limit(10).offset(self.data.offset).find().then(res=>{
      var item_info=self.data.item_info
      for(var i=0;i<res.data.objects.length;i++){
        var temp=res.data.objects[i]
        var key = 'short_dsp'
        var value = String(temp.description).substring(0, 12)
        temp[key]=value
        item_info.push(temp)  //把商品加进数组
      }

      self.setData({            //更新商品列表和偏移量
        item_info:item_info,              
        offset:self.data.offset+res.data.objects.length
      })
      console.log('offset is',self.data.offset)
    },err=>{
      console.log('failure')
    })
  },
  //添加收藏
  like:function(e){
    let id = e.currentTarget.dataset.index
    var self=this.data.item_info[id]
    if (!app.globalData.hasuserinfo) {//如果用户没登录
      wx.showModal({
        title: '',
        content: '请先登录',
        showCancel: false
      })
    }
    else{
      wx.showModal({
        title: '',
        content: '添加收藏',
        success: function (res) {
          if (res.confirm) {
            let tableID = app.globalData.store_tableID //表
            let tableobject = new wx.BaaS.TableObject(tableID)

            //先查询是否已收藏
            let query = new wx.BaaS.Query()
            query.compare('storeby', '=', app.globalData.userInfo.openid)
            query.compare('product_id', '=', self.id)

            tableobject.setQuery(query).find().then(res=>{
              if(res.data.objects.length==0){     //如果查询结果为空，则收藏
                let record = tableobject.create()

                var data = {
                  product_id: self.id,
                  pname: self.pname,
                  types: self.types,
                  bargain: self.bargain,
                  photos: self.photos,
                  amount: self.amount,
                  description: self.description,
                  seller_id: self.seller_id,
                  campus: self.campus,
                  price: self.price,
                  condition: self.condition,
                  openid: self.openid,
                  storeby: app.globalData.userInfo.openid
                }
                //更新表
                record.set(data).save().then(res => {
                  wx.showToast({
                    title: '收藏成功',
                    icon: 'success',
                    duration: 2000
                  })
                }, err => {
                  wx.showToast({
                    title: '收藏失败',
                    icon: 'none',
                    duration: 2000
                  })
                  console.log('储存失败', err)
                })
              }
              else{
                wx.showToast({
                  title: '您已收藏',
                  icon:'none',
                  duration:2000
                })
              }
            },err=>{
              console.log('查询失败',err)
            })
            
          }
          else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
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