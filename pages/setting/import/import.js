// pages/setting/import/import.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: null,
    author: null,
    isbn: null
  },
  goBack:function() {
    wx.navigateBack()
  },

  importBook: function () {
    wx.scanCode({
      success: (res) => {
        console.log(res)
        var isbn = res.result
        console.log(isbn)
        wx.showLoading({
          title: '加载中',
          mask: true
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 5000)
        wx.request({
          url: app.globalData.server + 'import_book.php',
          data: {
            session_id: wx.getStorageSync('PHPSESSID'),
            isbn: isbn
          },
          success: res => {
            wx.hideLoading()
            console.log('in setting importBook success')
            console.log(res)
            if (res.data.code != '1') {
              //导入失败"导入失败，豆瓣中查询不到该书籍"
              wx.showModal({
                content: res.data,
                showCancel: false
              })
            } else {
              console.log('import/import?author=' + res.data.author + "&title=" + res.data.title + "&isbn=" + res.data.isbn)
              wx.redirectTo({
                url: './import?author=' + res.data.author + "&title=" + res.data.title + "&isbn=" + res.data.isbn
              })
            }
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      title: options.title,
      author: options.author,
      isbn: options.isbn
    })
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