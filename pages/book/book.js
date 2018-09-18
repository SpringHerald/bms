// pages/book/book.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    books: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.request({
      url: app.globalData.server + 'get_book_list.php',
      data: {
        session_id: wx.getStorageSync('PHPSESSID')
      },
      success: res => {
        console.log('in book onLoad success')
        console.log(res)
        if (res.data.code == '4') app.globalData.scanLogin()

        console.log(this)
        this.setData({
          books: res.data
        })
      }
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
    wx.startPullDownRefresh()
    wx.request({
      url: 'https://mini.hailingshiliao.com/get_book_list.php',
      data: {
        session_id: wx.getStorageSync('PHPSESSID')
      },
      success: res => {
        console.log('in book refresh success')
        console.log(res)
        if (res.data.code == '4') app.globalData.scanLogin()

        console.log(this)
        this.setData({
          books: res.data
        })
      }
    })
    wx.stopPullDownRefresh()
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