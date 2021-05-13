import {
  request
} from "../../request/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 轮播图数组
    swiperList: [],
    cateList:[],
    floorList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.getSwiperList();
    this.getCateList();
    this.getFloorList();

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

  },





  //获取轮播图数据
  getSwiperList() {
    request({
        url: '/home/swiperdata'
      })
      .then(result => {
        
        let res=result.map(v=>v.navigator_url.split("=")).map(v=>v[1])
        result.forEach((v,i) => {
          v.navigator_url=res[i]
        });
        this.setData({
          swiperList: result
        })
      })
    //发送异步请求
    // wx-wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success: (result) => {
    //     console.log(result)
    //     this.setData({
    //      swiperList:result.data.message
    //     })
    //   },
    // })
  },
   //获取导航菜单数据
   getCateList() {
    request({
        url: '/home/catitems'
      })
      .then(result => {
        this.setData({
          cateList: result
        })
      })
  },
   //获取楼层数据
   getFloorList() {
    request({
        url: '/home/floordata'
      })
      .then(result => {
       result.map(v=>v.product_list).forEach((v,i)=>{
        v.forEach((v2,i)=>{
          v2.navigator_url=v2.navigator_url.replace("goods_list","goods_list/goods_list")
      })
      })

       console.log(result)
        this.setData({
          floorList: result
        })
      })
  },
})