// pages/category/category.js
import {request} from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    leftMenuList:[],
    rightContent:[],
    currentIndex:0,
    scrollTop:0
  },
  Cates:[],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /*
    0.本地存储：wxwx.getStorageSync('key'),wx.getStorageSync('key')
    1.判断一下本地存储中有没有旧的数据
    {time：Date.now(),data:[...]}
    2.没有旧数据 直接发送请求
    3.有旧的数据 同时旧的数据过期就使用本地存储中的旧数据即可
    */
     //1.获取本地存储
     const Cates=wx.getStorageSync('cates')
     //2.判断
     if(!Cates){
      this.getCates()
     }else{
       //有旧数据，过期时间10s
       if(Date.now()-Cates.time>1000*10){
         this.getCates();
       }else{
         //可以使用旧数据
         this.Cates=Cates.data;
         let leftMenuList=this.Cates.map(v=>v.cat_name);
         let rightContent=this.Cates[0].children;
         this.setData({
          leftMenuList,
          rightContent
         })
       }

     }
   
  },

 async getCates(){
   //使用es7
   const res=await request({url:"/categories"})
   this.Cates=res;
     //存储数据
     wx.setStorageSync("cates",{time:Date.now(),data:this.Cates});
     //左侧大菜单数据
     let leftMenuList=this.Cates.map(v=>v.cat_name)
     //右侧商品数据
     let rightContent=this.Cates[0].children;
     this.setData({
       leftMenuList,
       rightContent

     })
    // request({
    //   url:"/categories"
    // }).then(res=>{
    //   this.Cates=res.data.message;
    //   //存储数据
    //   wx.setStorageSync("cates",{time:Date.now(),data:this.Cates});
    //   //左侧大菜单数据
    //   let leftMenuList=this.Cates.map(v=>v.cat_name)
    //   //右侧商品数据
    //   let rightContent=this.Cates[0].children;
    //   this.setData({
    //     leftMenuList,
    //     rightContent

    //   })
    //  console.log(this.Cates)
    // })
  },
  handleItemTap(e){
    console.log("点击")
    /**
     * 1.获取被点击的标题身上的索引
     * 2.给data中的currentIndex赋值就可以了
     * 3.根据不同的所引渲染内容
     */
    const {index}=e.currentTarget.dataset
    console.log(index)
    let rightContent=this.Cates[index].children;
    this.setData({
      currentIndex:index,
      rightContent,
      //重新设置 右侧内容的scroll-view顶部标签的距离
      scrollTop:0
    })
    

  }
})