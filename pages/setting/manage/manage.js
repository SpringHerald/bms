// pages/setting/manage/manage.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    books: []
  },
  
  deleteBook: function(e) {
    console.log('in deleteBook')
    console.log(e)
    var book_id = e.currentTarget.dataset.id
    var nickname = e.currentTarget.dataset.nickname
    console.log(book_id)
    console.log(nickname)
    if (nickname) {
      wx.showModal({
        content: '该书已被 ' + nickname + ' 借阅，无法删除',
        showCancel: false
      })
      return
    }
    wx.showModal({
      title: '',
      content: '确认删除该本图书？',
      confirmText: "删除",
      cancelText: "取消",
      success: res => {
        console.log(res);
        if (res.confirm) {
          wx.request({
            url: app.globalData.server + 'delete_book.php',
            data: {
              session_id: wx.getStorageSync('PHPSESSID'),
              book_id: book_id
            },
            success: res => {
              console.log('in deleteBook success')
              console.log(res)
              if (res.data.code == '4') app.globalData.scanLogin()
              if (res.data != "1") {
                wx.showModal({
                  content: res.data,
                  showCancel: false
                })
              } else {
                //删除成功，刷新列表
                getBooks(this)
              }
            }
          })
        } else {
          return
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    getBooks(this)
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
function getBooks(page) {
  //TODO 按时间顺序倒序
  wx.request({
    url: app.globalData.server + 'get_book_list.php',
    data: {
      session_id: wx.getStorageSync('PHPSESSID')
    },
    success: res => {
      console.log('in manage getBooks success')
      console.log(res)
      if (res.data.code == '4') app.globalData.scanLogin()
      console.log(page)
      page.setData({
        books: res.data
      })
    }
  })
}