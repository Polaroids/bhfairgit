// pages/item/item.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    name: "", //商品的类别
    hidden: true,//回复的弹出框
    reply_template_id: "F0phicxYskBb7z2AzCEUc6OtVquG1ddfDFKgPWjetks",
    message_template_id: "ecDKL9Mvd0oZfq5R47wYS4OWNlwsknoSp6YTpyR6R_w",
    codersrc:null,
    form_id:null,
    access_token:"",
    return_message:"",
    user_info_id:null,
    item_info: {
      id: '',
      title: "",  //商品标题
      sort:"",    //商品类型
      price: 0,  //商品价格
      bargain:'',//是否可刀
      condition:1,//商品成色
      images: [],   //商品图片
      amount: 1, //商品数量
      description:"",//商品描述
      salerid: "",  //商品卖者
      campus:"",//校区
      openid:"",//卖家的openid
      created_by:0,
      //后续浏览次数，喜欢，评论。。。
    },//商品信息
    message:[{
      id: 0,
      nick_name:"",
      content:"",
      created_at:0,
      created_by:0,
      avatar:"",
      nick_name:"",
      user_type:"",
      receiver:0,
      rec_nickname:"",
    }],
    input:"",
    receiver:0,
    rec_nickname:"",
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this
    if(app.globalData.hasuserinfo){ //如果已登录
      self.setData({
        user_info_id: app.globalData.userInfo.id  //当前用户的id
      })
    }
    
    let tableid = app.globalData.product_tableID  //商品表ID
    let Product = new wx.BaaS.TableObject(tableid)
    Product.get(options.id).then(res => {
        var itemdata = res.data;
          this.setData({
            item_info:{
              id: itemdata.id,
              title: itemdata.pname,
              sort: itemdata.type,
              price: itemdata.price,
              bargain: itemdata.bargain == 1 ? "是" : "否",
              condition: itemdata.condition,
              images: itemdata.photos,
              amount: itemdata.amount,
              description: itemdata.description,
              salerid: itemdata.seller_id,
              campus: itemdata.campus,
              created_by: itemdata.created_by,
            }
          })
        this.getcodesrc(res.data.seller_id)
      },err =>{
        wx.showToast({
          title: '此商品可能已下架',
          icon:'none',
          duration:2000,
        })
        console.log("fail to get product infomation")
        setTimeout(function(){wx.navigateBack({delta: 1})},2000)
      })//获取商品信息

      let tableID = app.globalData.comment_tableID  //评论表格的id
      let query = new wx.BaaS.Query()
      query.compare('product_id', '=',options.id)
      let messages = new wx.BaaS.TableObject(tableID)
      messages.setQuery(query).find().then(data=>{
        for (var i = 0; i < data.data.objects.length;i++){
          data.data.objects[i].created_at = this.todata(data.data.objects[i].created_at)
        }
        this.setData({
          message:data.data.objects,
        })
      });//获取留言
  },
  //设置formid
  formSubmit: function (e) {
    if(app.globalData.userInfo.openid != ""){ 
      console.log('form发生了submit事件，携带数据为：', e.detail.formId)
      this.setData({
        form_id: e.detail.formId,
      })
      let tableID = 50899
      let Product = new wx.BaaS.TableObject(tableID)
      let product = Product.create()

      // 设置方式一
      let data = {
        formId: this.data.form_id,
        openid:app.globalData.userInfo.openid
      }
      console.log("上传数据为:",data)
      product.set(data).save().then(res => {
        // success
        console.log("上传formid成功:", data, "and", res)
      }, err => {
        // err
        console.log("failure:", data, "and", err)
      })
    }
  },

  //预览大图函数
  preview:function(e){
    var self = this;
    wx.previewImage({
      current:e.target.id,
      urls: self.data.item_info.images,
    })
  },

  //回复留言
  reply:function(e){
    if (app.globalData.hasuserinfo == false) {
      console.log("未授权")
      var self = this;
      this.authorize(e)
    }
    else{
      this.setData({
        hidden: !this.data.hidden,
        receiver:e.target.dataset.message.created_by,
        rec_nickname: e.target.dataset.message.nick_name,
      })
      console.log("已授权");
      }
  },
  //更新回复留言内容
  return_message: function(e){
      this.setData({
        return_message:e.detail.value,
      })

  },
  //取消回复留言
  cancel: function () {
    this.setData({
      hidden: true,
      receiver: 0,
      rec_nickname: "",
      return_message:"",
    });
  },
  //获取收款码
  getcodesrc: function (userID) {
    let self = this
    let myuser = new wx.BaaS.User()
    myuser.get(userID).then(res => {
      self.setData({
        codesrc: res.data.code
      })
    }, err => {
      console.log('查询收款码失败', err)
    })
  },
  //显示二维码
  showcode: function () {
    if(this.data.codersrc!=undefined){
    this.setData({
      showcode: true
    })}
    else{
      wx.showToast({
        title: '卖家尚未上传收款码',
        icon: 'none',
        duration: 2000,
      })
    }
  },
  hidecode: function () {
    this.setData({
      showcode: false
    })
  },
  //将图片保存至本地
  saveimage: function () {
    var self = this
    wx.showModal({
      title: '',
      content: '确认保存到本地相册？',
      success: function (res) {
        if (res.confirm) {
          wx.downloadFile({
            url: self.data.codesrc,
            success: function (res) {
              let path = res.tempFilePath
              wx.saveImageToPhotosAlbum({
                filePath: path,
                success: function () {
                  wx.showToast({
                    title: '已成功保存至本地',
                    icon: 'success',
                    duration: 2000
                  })
                }
              })
            }
          })
        }
      }
    })
  },

  //确认回复留言
  confirm: function () {
    this.setData({
      hidden: true,
    })
    if(this.data.return_message==''){
      this.setData({
        receiver: 0,
        rec_nickname: "",
      })
      wx.showToast({
        title: '回复内容不能为空',
        icon:'none',
        duration: 2000,
      })
    }
    else{
      wx.showLoading({
        title: '处理中...',
        mask: true,
      })
      //修改本地数据并且上传
      let tableID = 50161;
      let MyTableObject = new wx.BaaS.TableObject(tableID);
      let MyRecord = MyTableObject.create();
      var temp_message = this.data.message
      temp_message.push({
        created_at: this.todata(this.getdate()),
        product_id: this.data.item_info.id,
        content: this.data.return_message,
        user_type: this.data.item_info.salerid == app.globalData.userInfo.id ? "卖家" : "普通用户",
        avatar: app.globalData.userInfo.avatarUrl,
        nick_name: app.globalData.userInfo.nickName,
        receiver: this.data.receiver,
        openid:app.globalData.userInfo.openid,
        rec_nickname: this.data.rec_nickname,
        created_by: app.globalData.userInfo.id,
        id: 0,
      })
      console.log('留言list',temp_message)
      this.setData({
        message: temp_message
      }),
      MyRecord.set(this.data.message[this.data.message.length - 1])
      console.log("新增数据项设置完成,为")
      console.log(this.data.message[this.data.message.length - 1])
      MyRecord.save().then(res => {
        wx.hideLoading()
        wx.showToast({
          title: '留言成功',
          icon: 'success',
          duration: 2000
        })

        console.log("开始发送推送")     
        var id = this.data.receiver
        if(id != app.globalData.userInfo.id){
          let access_token_table_ID = 50924
          let query_access = new wx.BaaS.Query()
          query_access.compare('created_by', '=', 67820503)
          let message = new wx.BaaS.TableObject(access_token_table_ID)
          message.setQuery(query_access).find().then(data => {
            this.setData({
              access_token: data.data.objects[0].access_token,
            })
            this.service_info({
              id: id,
              template_id: this.data.reply_template_id,
              content: this.data.message[this.data.message.length - 1].content,
              nick_name: this.data.message[this.data.message.length - 1].nick_name
            })//被回复者
            console.log("access_token:", this.data.access_token)
          }, error => {
          });// 获取access_token
          console.log("access_token:", this.data.access_token)
          console.log("刷新data中")
          this.setData({
            'this.data.message': this.data.message,
            return_message: "",
            rec_nickname: "",
            receiver: 0,
          })}
        }, err => {
          console.log("上传失败")
          wx.hideLoading()
          wx.showToast({
            title: '留言失败',
            icon: 'fail',
            duration: 2000
          })
        })
    }
  },

  //更新本地输入
  setmessage: function (e) {
    this.setData({
      input: e.detail.value
    })
  },

  //传入时间戳，返回日期,形如:2018-9-5
  todata: function toDate(number) {
    var n = number * 1000;
    var date = new Date(n);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return(Y + M + D)
  },

  service_info:function(event){
    //需要传入template_id （e.openid，e.template_id）id
    //查询form_id,openid
    var self = this
    console.log("传入模板消息的数据为:",event)
    var access_token = this.data.access_token

    let table_id = 50899
    let query = new wx.BaaS.Query()
    query.compare('created_by', '=', event.id)
    let message = new wx.BaaS.TableObject(table_id)
    var handler = function(data, rty) {
      console.log("formid list:", data)
      let recordID = data.data.objects["0"].id
      var form_id = data.data.objects["0"].formId
      var openid = data.data.objects["0"].openid

      wx.request({
        method: "POST",
        url: 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + access_token,
        data: {
          "template_id": event.template_id,
          "touser": openid,
          "form_id": form_id,
          "page": "/pages/item/item?id=" + self.data.item_info.id,    //跳转的商品链接
          "data": {
            "keyword1": {
              "value": event.content
            },
            "keyword2": {
              "value": event.nick_name
            }
          }
        },
        success: function (res) {
          console.log("access_token:", self.data.access_token)
          console.log("send message successfully:", res)
          if (res.data.errmsg != "ok" && rty == undefined) {
            setTimeout(handler, 1000, data, 1)
          }
        },
        fail: function (err) {
          console.log("fail to send message:", err)
        }
      })//发送模板消息
      message.delete(recordID).then(res => {
        console.log("成功删除id：", recordID)
        console.log(res)
      }, err => {
        console.log("删除id：", recordID, "失败")
        console.log(err)
      })

    }
    message.setQuery(query).find().then(handler);//form_id
  },//发送推送

  //获取当前时间戳
  getdate: function (){
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    return timestamp
  },

  //上传留言
  upload_message: function(e){
    //判断是否符合上传条件
    if (this.data.input.length > 0 
      && this.data.input.length <= 140 
      && app.globalData.hasuserinfo == true){
      wx.showLoading({
        title: '处理中...',
        mask: true,
      })
      //修改本地数据并且上传
      let tableID = 50161;
      let MyTableObject = new wx.BaaS.TableObject(tableID);
      let MyRecord = MyTableObject.create();
      var temp_message = this.data.message
      temp_message.push({
        created_at: this.todata(this.getdate()),
        product_id: this.data.item_info.id,
        content: this.data.input,
        user_type: this.data.item_info.salerid == app.globalData.userInfo.id ? "卖家" : "普通用户",
        avatar: app.globalData.userInfo.avatarUrl,
        nick_name: app.globalData.userInfo.nickName,
        receiver: 0,
        rec_nickname: "",
        openid:app.globalData.userInfo.openid,
        created_by: app.globalData.userInfo.id,
        id:0,
      })
      this.setData({
        message:temp_message,
        input:"",
      }),
      MyRecord.set(this.data.message[this.data.message.length - 1])
      console.log("新增数据项设置完成")
      MyRecord.save().then(res => {
        wx.hideLoading()
        wx.showToast({
          title: '留言成功',
          icon: 'success',
          duration: 2000
        })
        //这里发送消息推送
        console.log("卖家id：",this.data.item_info.created_by)
        let access_token_table_ID = 50924
        let query_access = new wx.BaaS.Query()
        query_access.compare('created_by', '=', 67820503)
        let message = new wx.BaaS.TableObject(access_token_table_ID)
        message.setQuery(query_access).find().then(data => {
          this.setData({
            access_token: data.data.objects[0].access_token,
          })
          this.service_info({
            id: this.data.item_info.created_by,
            template_id:this.data.message_template_id,
            content: this.data.message[this.data.message.length - 1].content,
            nick_name: this.data.message[this.data.message.length - 1].nick_name
          })//给卖家
          console.log("access_token:", this.data.access_token)
        }, error => {
        });// 获取access_token
        
        
        


        this.data.message[this.data.message.length - 1].id = res.data.id
        this.setData({
          'this.data.message':this.data.message,
          input:"",
        })
      },err => {
        console.log("上传留言失败")
        wx.hideLoading()
        wx.showToast({
          title: '留言失败',
          icon: 'fail',
          duration: 2000
        })
      })
    }
    else if (app.globalData.hasuserinfo == false){
      var self = this;
      this.authorize(e)
      //进入授权函数
      
    }
    else if (this.data.input.length ==0){
      wx.showToast({
        title: '留言内容不能为空',
        icon: 'none',
        duration: 2000
      })
      
    }
    else{
      console.log("请输入少于140字内容")
      wx.showToast({
        title: '请输入少于140字内容',
        icon: 'none',
        duration: 2000
      })
    }
  },

  //删除留言
  del_message: function(info){
    var self = this
    wx.showModal({
      title: '',
      content: '确认删除？',
      success: function (res) {
        if (res.confirm) {
          var index = info.target.dataset.index
          var message_id = self.data.message[index].id;
          var message = self.data.message 

          message.splice(index, 1)
          self.setData({
            message:message
          })
          //删除本地数据

          let tableID = 50161
          let MyTableObject = new wx.BaaS.TableObject(tableID)
          MyTableObject.delete(message_id).then(res => {
            console.log("delete successful")
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 1500
            })
          },err => {
            console.log("fail to delete!")
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
   
  },
  //用户授权登陆
  authorize: function (e) {
    var self = this;
    if (!app.globalData.hasuserinfo) {//如果用户没登录
      wx.showModal({
        title: '',
        content: '是否授权登录？',
        success: function (res) {
          if (res.confirm) {
            self.userInfoHandler(e)
          } else if (res.cancel) {
            wx.showToast({
              title: '请授权登录后重试',
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
    }
  },

  //获取用户信息
  userInfoHandler: function (e) {
    var self = this
    console.log("获取用户数据中")
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
        avatarUrl: res.avatarUrl,
        created_by: res.id,
      }
      self.setData({
        user_info_id: res.id //当前用户id
      })
      app.globalData.hasuserinfo = true
    }, res => {
      // **res 有两种情况**：用户拒绝授权，res 包含基本用户信息：id、openid、unionid；其他类型的错误，如网络断开、请求超时等，将返回 Error 对象（详情见下方注解）
      console.log("fail to get user information");
    })
  },
  contact_seller:function(e){
    wx.showToast({
      title: '正在开发中，敬请期待',
      icon:'none'
    })
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