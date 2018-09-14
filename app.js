//app.js
App({
  onLaunch: function () {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 5000)

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log('in wx.login')
        console.log(res)
        if (res.code) {
          //发起网络请求
          wx.request({
            url: this.globalData.server + 'login.php',
            data: {
              code: res.code
            },
            success: res => {
              console.log('in login success')
              console.log(res)
              console.log(res.data)
              var wxSession = res.data
              wx.setStorageSync('PHPSESSID', wxSession);
              // var app =getApp()

              // 获取用户信息
              wx.getSetting({
                success: res => {
                  console.log('in wx.getSetting')
                  console.log(res)
                  if (res.authSetting['scope.userInfo']) {
                    console.log('in wx.getSetting')
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                      success: res => {
                        console.log(res.userInfo)
                        // 可以将 res 发送给后台解码出 unionId
                        this.globalData.userInfo = res.userInfo

                        wx.request({
                          url: this.globalData.server + 'update_user_info.php',
                          data: {
                            nickname: res.userInfo.nickName,
                            session_id: wx.getStorageSync('PHPSESSID')
                          },
                          success: function (res) {
                            console.log('in app bind success')
                            console.log(res)
                          }
                        })

                        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                        // 所以此处加入 callback 以防止这种情况
                        if (this.userInfoReadyCallback) {
                          this.userInfoReadyCallback(res)
                        }
                      }
                    })
                  } else {
                    wx.hideLoading()
                    // 用户未登录
                    // wx.redirectTo({
                    //   url: '../login/login',
                    // })
                  }
                }
              })
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  globalData: {
    server: 'https://mini.hailingshiliao.com/',
    userInfo: null
  }
})