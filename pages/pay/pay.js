// pages/cart/cart.js
/**
 * 1.页面加载的时候
 *  1.从缓存中获取购物车数据
 *     这些数据checked必须为true
 * 2.微信支付
 *  1.那些人 可以实现微信支付
 *    1.企业账号
 *    2.企业账号的小程序后台中必须给开发者绑定白名单
 *      1个appid可以绑定多个开发者
 *      2这些开发者就可以共用这个开发权限
 * 
 * 3.支付按钮
 *    1.判断缓存中有没有token
 *    2.没有   跳转到授权页面  进行获取token
 *    3.有  向下进行
 * 6.手动删除缓存中 已经被选中了的商品
 * 7.删除后填充回缓存
 * 8.在跳转页面
 */
import {
  getSetting,
  openSetting,
  chooseAddress,
  showModal,
  showToast,
  requestPayment
} from '../../utils/asyncWx'
import regeneratorRuntime from '../../lib/runtime/runtime'
import {request} from '../../request/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onShow() {
    //1.获取缓存中的地址信息
    const address = wx.getStorageSync('address');
    //获取缓存中购物车数据
    let cart = wx.getStorageSync('cart') || [];
    //过滤后的购物车数组
    cart=cart.filter(v=>v.checked);
    this.setData({
      address,
    })

     //1.总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num
      }
    })
    //2.给data中的数据赋值
    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    })
  },

  //设置购物车状态 重新计算 底部工具栏的数据 全选 总价格 购买的数量
  setCart(cart) {
    //1.总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num
      } else {
        allChecked = false
      }
    })
    allChecked = cart.length != 0 ? allChecked : false
    //2.给data中的数据赋值
    this.setData({
      cart,
      totalPrice,
      totalNum,
      allChecked
    })
    wx.setStorageSync('cart', cart)
  },
  //点击支付
  async handleOrderPay(){
    try {
      //1.判断缓存中有没有token
    const token=wx.getStorageSync('token');
    //2.判断
    if(!token){
      wx.navigateTo({
        url: '/pages/auth/auth',
      })
      return
    }
    //3.创建订单
    //3.1准备请求头参数
    const header={Authorization:token};
    //3.2准备请求体参数
    const order_price=this.data.totalPrice
    const consignee_addr=this.data.address.all;
    const cart=this.data.cart;
    let goods=[];
    cart.forEach(v=>goods.push({
      goods_id:v.goods_id,
      good_number:v.num,
      goods_price:v.goods_price
    }))
    //4.准备发送请求
    const orderParams={order_price,consignee_addr,goods};
    const {order_number}=await request({url:"/api/public/v1/users/wxlogin",method:"post",data:orderParams,header})
    console.log(order_number)
  //5.发起预支付接口
    const {pay}= await request({url:"/my/orders/req_unifiedorder",method:"post",header,data:{order_number} })
 //6.调取微信支付
 const res=await requestPayment(pay);
 console.log(res);
 //7.查看订单
 const res1=await request({url:"/my/orders/chkOrder", method:"post",header,data:{order_number}});
 await showToast({title:"支付成功"})
 //8.手动删除缓存中已经支付的商品
 let newCart=wx.getStorageSync('cart');
 newCart=newCart.filter(v=>!v.checked);
 wx.setStorageSync('cart', newCart)
//8.支付成功了，跳转到订单页面
wx.navigateBack({
  url:'/pages/order/order',
})
console.log(res1)
    } catch (error) {
      console.log(error)
    }
    
}
})


 