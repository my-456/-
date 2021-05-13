// pages/search/search.js
/**
 * 1.输入框绑定 值改变事件 input事件
 *  1.获取到输入框的值
 *  2.合法性判断
 *  3.检验通过 把输入框的值 发送到后台
 *  4.返回的数据打印到页面上
 * 2.防抖  定时器
 *  0.一般用在输入框 防止重复输入 重复发送请求
 *  1.节流 一般用在页面的上拉和下拉
 *  1.定义一个全局的定时器
 */
import {request} from '../../request/index';
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods:[],
    isFocus:false,
    inpValue:""
  },
  TimeId:1,
  //输入框改变就会触发的事件
  handleInput(e){
    //1.获取输入框的值
    const {value}=e.detail
    //检测合法性
    if(!value.trim()){
      this.setData({
       goods:[],
       isFocus:false
      })
        //值不合法
        return;
      }
      this.setData({
        isFocus:true
      })
      clearTimeout(this.TimeId);
      this.TimeId=setTimeout(() => {
        this.qsearch(value)
        
      }, 1000);
     
    
  },
 //3.准备发送请求获取数据
 async qsearch(query){
  const res=await request({url:"/goods/qsearch",data:{query}})
  console.log(res)
  this.setData({
    goods:res
  })
},
handleFocus(){
  this.setData({
    goods:[],
    isFocus:false,
    inpValue:""
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  }
})