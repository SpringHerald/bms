//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function() {
    console.log('in onLoad')
    if (app.globalData.userInfo) {
      console.log('in if')
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      console.log('in else if')
      console.log(this)
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        console.log('in callback')
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
      console.log('end of else if')
    } else {
      console.log('in else')
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  bindGetUserInfo: function(e) {
    console.log('hello!')
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })

    wx.request({
      url: app.globalData.server + 'update_user_info.php',
      data: {
        nickname: e.detail.userInfo.nickName,
        session_id: wx.getStorageSync('PHPSESSID')
      },
      success: function(res) {
        console.log('in bind success')
        console.log(res)
      }
    })
  },
  bindScanBarCode: function(e, force = 0) {
    console.log(e)
    var status = e.target.dataset.status
    wx.scanCode({
      success: (res) => {
        console.log(res)
        // this.show = "结果:" + res.result + "二维码类型:" + res.scanType + "字符集:" + res.charSet + "路径:" + res.path;
        var isbn = res.result
        console.log(isbn)

        borrowRequest(isbn, status, 0)
      },
      complete: (res) => {
        // wx.showToast({
        //   title: '失败',
        //   icon: 'success',
        //   duration: 2000
        // })
      }
    })
  }
})

function borrowRequest(isbn, status, force) {
  wx.request({
    url: app.globalData.server + 'borrow.php',
    data: {
      session_id: wx.getStorageSync('PHPSESSID'),
      isbn: isbn,
      status: status,
      force: force
    },
    success: res => {
      console.log('in borrow scan success')
      console.log(res)
      if (res.data.code == "1") {
        if (status == "0") var title = '借阅成功'
        else var title = '还书成功'
        wx.showToast({
          title: title,
          icon: 'success',
          duration: 2000
        })
      } else if(res.data.code == "2"){
        console.log(res.data.code)
        console.log(res.data.msg)

        wx.showModal({
          title: '',
          content: res.data.msg,
          confirmText: "继续",
          cancelText: "取消",
          success: function(res) {
            console.log(res);
            if (res.confirm) {
              console.log('用户点击主操作')
              borrowRequest(isbn, status, 1)
            } else {
            }
          }
        })
      } else {
        //后端异常
        wx.showModal({
          content: res.data,
          showCancel: false,
          success: function (res) {
          }
        });
      }
    }
  })
}