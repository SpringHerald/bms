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
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    sessionExpired: false
  },

  loginScanCode: function() {
    console.log('in loginScanCode')

    //扫描二维码
    wx.scanCode({
      success: (res) => {
        console.log(res)
        console.log(res.result)

        if (res.result.length > 27 && res.result.substring(0, 27) == "https://mp.weixin.qq.com/a/") { // 27
          wx.reLaunch({
            url: '/pages/index/index',
          })
        } else {
          wx.showModal({
            content: "二维码错误！",
            showCancel: false
          })
        }
      }
    })

  },

  bindGetUserInfo: function(e) {
    console.log('in bindGetUserInfo')
    console.log(e)

    if (!e.detail.userInfo) { //用户拒绝授权
      return
    }

    app.globalData.userInfo = e.detail.userInfo

    //首次打开小程序，已授权
    loginAndReLaunch()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('in login onLoad')
    console.log(options)

    //如果不是用扫码打开的小程序
    if (!options.s) {
      wx.hideLoading()
    }

    if (app.globalData.userInfo) {
      console.log('in if')
      if (options.s) {
        loginAndReLaunch()
      }
      this.setData({
        sessionExpired: app.globalData.sessionExpired
      })
      if (this.data.sessionExpired) {
        wx.hideLoading()
        return
      }
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

        if (options.s) {
          loginAndReLaunch()
        }
        this.setData({
          sessionExpired: app.globalData.sessionExpired
        })
        if (this.data.sessionExpired) {
          wx.hideLoading()
          return
        }
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
          wx.request({
            url: app.globalData.server + 'update_user_info.php',
            data: {
              nickname: res.userInfo.nickName,
              session_id: wx.getStorageSync('PHPSESSID')
            },
            success: res => {
              console.log('in app bind success')
              console.log(res)

              if (res.data != '1') { //会话已过期
                if (options.s) {
                  loginAndReLaunch()
                }
                this.setData({
                  sessionExpired: app.globalData.sessionExpired
                })
                wx.hideLoading()
                return
              }

              wx.reLaunch({
                url: '/pages/index/index',
              })
            }
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

// 此函数在app已取到userInfo之后调用
function loginAndReLaunch() {
  wx.request({
    url: app.globalData.server + 'login.php',
    data: {
      code: app.globalData.code
    },
    success: res => {
      console.log('in login success')
      console.log(res)
      console.log(res.data)
      var wxSession = res.data
      wx.setStorageSync('PHPSESSID', wxSession);

      //TODO 可能可以简化成在login界面更新nickName
      wx.request({
        url: app.globalData.server + 'update_user_info.php',
        data: {
          nickname: app.globalData.userInfo.nickName,
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

    }
  })
}