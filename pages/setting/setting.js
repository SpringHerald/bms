// pages/setting/setting.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    level: null
  },

  importBook: function() {
    wx.scanCode({
      success: (res) => {
        console.log(res)
        var isbn = res.result
        console.log(isbn)

        wx.request({
          url: 'https://mini.hailingshiliao.com/import_book.php',
          data: {
            session_id: wx.getStorageSync('PHPSESSID'),
            isbn: isbn
          },
          success: res => {
            console.log('in setting importBook success')
            console.log(res)
            if(res.data.code != '1'){
              //导入失败
              wx.showModal({
                content: res.data,
                showCancel: false
              })
            } else {
              // i write here
            }
          }
        })
      },
      complete: (res) => {
        // wx.showToast({
        //   title: '失败',
        //   icon: 'success',
        //   duration: 2000
        // })
      }
    })


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo
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
    wx.request({
      url: 'https://mini.hailingshiliao.com/get_level.php',
      data: {
        session_id: wx.getStorageSync('PHPSESSID')
      },
      success: res => {
        console.log('in setting onShow success')
        console.log(res)
        this.setData({
          level: res.data
        })
      }
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