/*
1.用户上划页面 滚动条触底 开始加载下一页数据
  1.找到滚动条触底事件
  2.判断还有没有下一页数据
    1.获取总页数
    总页数=Math.ceil(总条数/页容量)
    2.获取到当前页码
    3.只要判断当前页码是否>总页数
  3.没有下一页，弹出提示
  4.有下一页加载下一页数据
    1.当前页码的++
    2.重新发送请求
    3.数据请求回来 要对data中的数组进行拼接而不是全部替换
2.下拉刷新页面
  1.触发下拉刷新页面 需要在页面的json中配置
  2.重置数据数组
  3.重置页面设置为1
*/
import { values } from "../../lib/runtime/runtime";
import { request } from "../../request/index.js";

// pages/goods_list/goods_list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[{
      id:0,
      value:"综合",
      isActive:true
    },
    {
      id:1,
      value:"销量",
      isActive:false
    },
    {
      id:2,
      value:"价格",
      isActive:false
    }
     
    ],
    goodsList:[],
  },
 QueryParams:{
    query:"",
    cid:"0",
    pagenum:1,
    pagesie:10
  },
  //总页数
  totalPages:1,
onLoad(options){
console.log(options)
this.QueryParams.cid=options.cid||""
this.QueryParams.query=options.query||""
this.getgoodsList()
},
//子组件传递过来的点击标题事件
handletabsItemChange(e){
  console.log(e)
  const {index}=e.detail
  console.log("索引",index)
  //修改原素组
  let {tabs} =this.data;
  tabs.map(v=>v.isActive=false)
  tabs[index].isActive=true
  // tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false)
 this.setData({
   tabs
 })
},
//获取商品列表事件
async getgoodsList(){
 const res=await request({
    url:"/goods/search",
    data:this.QueryParams
  })
    console.log(res)
    const total=res.total;
    this.totalPages=Math.ceil(total/this.QueryParams.pagesie)
    this.setData({
      goodsList:[...this.data.goodsList,...res.goods]
  })
  //关闭下拉刷新窗口 如果没有调用下拉刷新的窗口 直接关闭也不会报错
  wx-wx.stopPullDownRefresh({
    complete: (res) => {},
  })
},
//页面上划滚动条触底事件
onReachBottom(){
  //1.判断还有没有下一页数据
  if(this.QueryParams.pagenum>=this.totalPages){
    //没有下一页了
    console.log("没有下一页了")
    wx.showToast({
      title: '没有下一页数据了',
    })
  }else{
    this.QueryParams.pagenum++
    this.getgoodsList()
  }
},

//下拉刷新事件
onPullDownRefresh(){
  //重置数组
  this.setData({
    goodsList:[],
  })
  this.QueryParams.pagenum=1,
  this.getgoodsList()
}
})