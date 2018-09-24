// pages/mine/mine.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    myBooks: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo
    })

    wx.request({
      url: app.globalData.server + 'get_level.php',
      data: {
        session_id: wx.getStorageSync('PHPSESSID')
      },
      success: res => {
        console.log('in setting onShow success')
        console.log(res)
        if (res.data.code == '4') app.globalData.scanLogin()
        app.globalData.level = res.data
        
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
    wx.request({
      url: app.globalData.server + 'get_my_book_list.php',
      data: {
        session_id: wx.getStorageSync('PHPSESSID')
      },
      success: res => {
        console.log('in mine onLoad success')
        console.log(res)
        if (res.data.code == '4') app.globalData.scanLogin()
        this.setData({
          myBooks: res.data
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