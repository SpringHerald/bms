//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function() {
    this.setData({
      userInfo: app.globalData.userInfo,
      hasUserInfo: true
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
      if (res.data.code == '4') app.globalData.scanLogin()
      if (res.data.code == "1") {
        if (status == "0") var title = '借阅成功'
        else var title = '还书成功'
        wx.showToast({
          title: title,
          icon: 'success',
          duration: 2000
        })
      } else if (res.data.code == "2") {
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
            } else {}
          }
        })
      } else {
        //后端异常
        wx.showModal({
          content: res.data,
          showCancel: false,
          success: function(res) {}
        });
      }
    }
  })
}