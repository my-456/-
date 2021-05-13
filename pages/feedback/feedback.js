// pages/feedback/feedback.js
/**
 * 1.点击+触发tap点击事件
 *   1.调用小程序内置的 选择 图片的api
 *   2.获取到图片的路径
 *   3.把图片路径 存到data的变量中
 *   4.页面就可以根据 图片数组 进行循环显示 自定义组件
  2.点击自定义图片
    1.获取被点击元素的索引
    2.获取data中的图片数组
    3.根据索引 数组中删除对应的元素
    4.把数组重新设置回data中
  3.点击提交
    1.获取文本域内容
    2.对这些内容合法性验证
    3.通过验证 用户选择的图片 上传到专门的图片的服务器 返回外网图片的连接
    4.文本域 和外网图片的路径 一起提交到服务器
    5.清空当前页面
    6.返回上一页
    */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageList:[],
    textVal:"",
    tabs:[{
      id:0,
      value:"体验问题",
      isActive:true,
      
    },
    {
      id:1,
      value:"商品/商家投诉",
      isActive:false
    },
    ],
  },
//外网的图片路径的数组
  UploadImgs:[],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
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
  //点击选择图片
  handleChooseImg(){
    //调用小程序内置的选择图片的api
    wx.chooseImage({
      //同时选中图片的数量
      count:9,
      //图片的格式 原图 压缩
      sizeType:["original","compressed"],
      //图片的来源 相机 照相机
      sourceType:["album","camera"],
      success:(res)=>{
        console.log(res.tempFilePaths)
        let imageList=res.tempFilePaths
        this.setData({
          imageList:[...this.data.imageList,...imageList]
        })
      }
    })
  },
  //点击自定义图片组件
  handleRemoveImg(e){
    //获取被点击的索引
    const {index}=e.currentTarget.dataset;
    console.log(index)
    //获取原图数组
    let imageList=this.data.imageList
    //删除元素
    imageList.splice(index,1)
    this.setData({
      imageList
    })
  },
//文本域的输入事件
  handleTextInput(e){
    this.setData({
      textVal:e.detail.value
    })
  },
  //点击提交按钮
  handleFormSubmit(){
    let {textVal,imageList}=this.data
    if(!textVal.trim()){
      //不合法
      wx.showToast({
        title: '输入不合法',
        icon:"none"
      });
      return;
    }
    //准备上传图片到专门服务器
    //上传图片的api不支持 多个文件同时上传 需：遍历数组 挨个上传
    //显示正在等待弹窗
    // wx.showLoading({
    //   title: '正在上传中',
    // })
    wx.showToast({
      title: '上传成功',
    })
    wx.navigateBack({
      delta:1
    })
    //判断有没有需要上传的图片数组
    if(imageList.length!=0){
    imageList.forEach((v,i)=>{
      console.log("222222222")
      
    wx-wx.uploadFile({
      
      filePath: v,//上传图片的路径
      name: 'file',//上传图片的名称
      url: 'https://api.ooopn.com/tu/sina/api.php',//图片要上传到哪里
      formData:{},
      success: (result) => {
        console.log(result)
        let url=JSON.parse(result.data)
        this.UpLoadImgs.push(url)
        console.log(this.UpLoadImgs)

        //所有的图片都上传完毕了才触发
        if(i===chooseImgs.length-1){
          //弹窗关闭
          wx.hideLoading();
          console.log("把文本和图片数组 提交到后台")
          //提交成功,重置页面
          this.setData({
            textVal:"",
            imageList:[],
          })
          //返回上一个页面
          wx.navigateBack({
            delta:1
          })
        }
      },
    })
  })
}else{
  wx.hideLoading();
  console.log("只是提交文本")
    //提交成功,重置页面
    this.setData({
      textVal:"",
      imageList:[],
    })
    //返回上一个页面
    wx.navigateBack({
      delta:1
    })
}

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