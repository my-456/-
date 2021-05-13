// pages/collect/collect.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collect:[],
    tabs:[
      {
        id:0,
        value:"商品收藏",
        isActive:true
      },
      {
        id:1,
        value:"品牌收藏",
        isActive:false
      },
      {
        id:2,
        value:"店铺收藏",
        isActive:false
      },
      {
        id:3,
        value:"浏览足迹",
        isActive:false
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    const pages=getCurrentPages()
    const options=pages[pages.length-1].options
    const {type}=options
    console.log(options)
    this.changeTitleByIndex(type-1)

    const collect=wx.getStorageSync('collect')
    this.setData({
      collect
    })
  },
//子组件传递过来的点击标题事件
handletabsItemChange(e){
  console.log(e)
  const {index}=e.detail
  //修改原素组
  this.changeTitleByIndex(index)
},
changeTitleByIndex(index){
  let {tabs} =this.data;
  tabs.map(v=>v.isActive=false)
  tabs[index].isActive=true
  // tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false)
 this.setData({
   tabs
 })
}
})