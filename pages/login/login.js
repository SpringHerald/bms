// pages/login/login.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  loginScanCode: function() {
    console.log('in login')

    //扫描二维码


    wx.reLaunch({
      url: '../index/index?s=405',
    })
  },

  bindGetUserInfo: function(e) {
    console.log('in bindGetUserInfo')
    console.log(e)

    if (!e.detail.userInfo) { //用户拒绝授权
      return
    }

    app.globalData.userInfo = e.detail.userInfo

    wx.request({
      url: app.globalData.server + 'update_user_info.php',
      data: {
        nickname: e.detail.userInfo.nickName,
        session_id: wx.getStorageSync('PHPSESSID')
      },
      success: function(res) {
        console.log('in bind success')
        console.log(res)
        // 已更新用户信息到数据库，跳转到首页
        wx.reLaunch({
          url: '/pages/index/index',
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('in login onLoad')
    console.log(options)

    //如果不是用扫码打开的小程序
    if (!options.s) {
      wx.showToast({
        title: 'not from QR code',
        icon: 'success',
        duration: 3000
      });


      wx.hideLoading()
    }

    if (app.globalData.userInfo) {
      console.log('in if')

      wx.reLaunch({
        url: '/pages/index/index',
      })
    } else if (this.data.canIUse) {
      console.log('in else if')
      console.log(this)
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        console.log('in callback')
        console.log(res)

        wx.reLaunch({
          url: '/pages/index/index',
        })
      }
      console.log('end of else if')
    } else {
      console.log('in else')
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo

          wx.reLaunch({
            url: '/pages/index/index',
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})