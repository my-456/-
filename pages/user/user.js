// pages/user/user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    //被收藏商品的数量
    collectNum:0
  },
onShow(){
  const userInfo=wx.getStorageSync('userInfo')
  const collect=wx.getStorageSync('collect')
  let collectNum=collect.length
  this.setData({
    userInfo,
    collectNum
  })
}
})