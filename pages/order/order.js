// pages/order/order.js
import {request} from '../../request/index';
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders:[
      {
        order_id:1,
        order_number:"HMDD20190812000000001104",
        order_price:"13618",
        create_time:"2019/8/12 下午9:36:25"
      },
      {
        order_id:2,
        order_number:"HMDD20190812000000001104",
        order_price:"13618",
        create_time:"2019/8/12 下午9:36:25"
      },
      {
        order_id:3,
        order_number:"HMDD20190812000000001104",
        order_price:"13618",
        create_time:"2019/8/12 下午9:36:25"
      },
      {
        order_id:4,
        order_number:"HMDD20190812000000001104",
        order_price:"13618",
        create_time:"2019/8/12 下午9:36:25"
      },
    ],
    tabs:[
      {
        id:0,
        value:"全部订单",
        isActive:true
      },
      {
        id:1,
        value:"代付款",
        isActive:false
      },
      {
        id:2,
        value:"待收货",
        isActive:false
      },
      {
        id:3,
        value:"价格",
        isActive:false
      }
    ]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    // const {type}=options
  },
  onShow(option){
    const token=wx.getStorageSync('token')
    // if(!token){
    //   wx.navigateTo({
    //     url: '../auth/auth',
    //   })
    // }
    //获取小程序的当前页面栈=数组,长度最大是10
    //数组中索引最大的页面就是当前页面
    let pages=getCurrentPages();
    let currentPage=pages[pages.length-1]
    const {type}=currentPage.options
    let index=type-1
    this.changeTitleByIndex(index)
    console.log(currentPage)
    this.getOrders(type)
  },
  async getOrders(type){
    const res=await request({
      url:"/orders/all",
      data:{type}
    })
    this.setData({
     // orders:res.orders.map(v,({...v,create_time_cn:(new Date(v.create_time*1000).toLocaleString)}))
    })
    console.log(res)
  },
  //根据标题索引来激活选中 标题数组
  changeTitleByIndex(index){
    //修改原素组
  let {tabs} =this.data;
  tabs.map(v=>v.isActive=false)
  tabs[index].isActive=true
  // tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false)
  this.setData({
   tabs
 })
  },
//子组件传递过来的点击标题事件
handletabsItemChange(e){
  console.log(e)
  const {index}=e.detail
  console.log("索引",index)
  //修改原素组
  this.changeTitleByIndex(index)
  //重新发送请求
  this.getOrders(index+1);
},
  
})