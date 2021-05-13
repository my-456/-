// pages/cart/cart.js
/**
 * 获取用户收货地址
 *  1.绑定点击事件
 *  2.调用小程序内置api 获取用户收货地址  
 * 2.获取 用户对小程序所授予获取地址的权限状态scope
 *  1.假设 用户点击获取收货地址的提示框 确定 authSetting scope.address scope值true 直接调用收货地址
 *  2.假设 用户 点击获取收货地址的提示框 取消 scope值false
 * 3.假设用户从来没有调用过 收货地址的api scope undefined
 * 4.把获取到的收货地址存到缓存中
 * 
 * 2.页面加载完毕
 *    1.获取本地存储中的数据
 *    2.把数据设置给dada中的变量
 * 
 * 3.onshow
 * 0.回到了商品详情页面 第一次添加商品的时候，手动添加属性
 *    1.num=1;
 *    2.checked=true
 * 1.获取缓存中的购物车数组
 * 2.把购物车数据填充在data中
 * 
 * 4.全选的实现
 * 1.onshow获取缓存中的购物车数组
 * 2.根据购物车中的商品数据，所有的商品都被选中 checked=true 全选就被选中
 * 
 * 5.总价格和总数量
 * 1.都需要商品被选中 我们才拿他来计算
 * 2.获取购物车数组
 * 3.遍历
 * 4.判断商品是否被选中
 * 5.总价格+=商品的单价*商品的数量
 * 6.总数量+=商品的数量
 * 7.把计算后的价格和数量设置回data中即可
 * 
 * 6.商品的选中功能
 *  1.绑定change事件
 *  2.获取被修改的商品对象
 *  3.商品对象的选中状态 取反
 *  4.重新填充回data中和缓存中
 *  5.重新计算全选
 * 
 * 7.全选和反选
 *  1.全选复选框绑定事件 change
 *  2.获取data中的全选变量allChecked改变而改变
 *  3.直接取反allChecked=!allChecked
 *  4.遍历购物车数组 让里面的商品选中状态跟随
 *  5.把购物车数组 和选中状态重新设置回缓存中
 * 
 * 8.商品数量的点击事件
 *  1.+,-绑定同一个点击事件 区分的关键 自定义属性
 *  2.传递被点击的商品的goods_id
 *  3.获取data中的购物车数组，来获取需要被修改的商品对象
 *  4.当购物车的数量=1同时用户点击"-"
 *    弹窗提示 询问用户是否要删除
 *    1.确定 直接执行删除
 *    2.取消 什么都不做
 *  4.直接修改商品对象的数量num
 *  5.把cart数组 重新设置回缓存和data中
 * 
 * 9.点击结算
 *  1.判断有没有收获地址信息
 *  2.判断用户有没有选购商品
 *  3.经过以上的验证 跳转到支付页面
 *  */
import {
  getSetting,
  openSetting,
  chooseAddress,
  showModal,
  showToast
} from '../../utils/asyncWx'
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    allChecked: false,
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
    const cart = wx.getStorageSync('cart') || [];
    //计算全选
    //every 数组方法 会遍历 会接收一个回调函数 那么每一个回调函数都返回true 那么every方法的返回值为true
    //只要有一个回调函数返回了false 那么不在循环执行，直接返回false
    //如果数组为空调用了every，那么返回值为true
    //const allChecked=cart.length!=0?cart.every(v=>v.checked):false;
    //2.给data中的数据赋值
    this.setData({
      address,

    })
    this.setCart(cart)
  },
  // 点击收货地址
  async handleChooseAddress() {
    //1.获取权限状态
    // wx.getSetting({
    //  success:(result)=>{
    //   //2.获取权限状态
    //   const scopeAddress=result.authSetting["scope.address"];
    //   if(scopeAddress===true||sopeAddress===undefined){
    //     wx.chooseAddress({
    //       success:(result1)=>{
    //         console.log(result1)
    //       }
    //     })
    //   }else{
    //     //3.用户 以前拒绝过授予权限 先诱导用户打开授权页面
    //     wx.openSetting({
    //       success: (result2) => {
    //         //4.可以调用收货地址代码
    //         wx.chooseAddress({
    //           success:(result3)=>{
    //             console.log(result3)
    //           }
    //         })
    //       },
    //     })
    //   }
    //  }
    // })
    try {
      //1.获取权限状态
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.address"];
      //2.判断权限状态
      if (scopeAddress === false) {
        //3.用户 以前拒绝过授予权限 先诱导用户打开授权页面
        await openSetting()
      }
      //调用获取收货地址
      const address = await chooseAddress()
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo
      //存入缓存
      wx.setStorageSync('address', address)

    } catch (error) {
      console.log(error)
    }
  },
  //商品的选中
  handeItemChange(e) {
    //获取被修改的商品的id
    const id = e.currentTarget.dataset.id;
    console.log(id)
    //获取购物车数组
    let {
      cart
    } = this.data;
    //找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === id);
    //选中状态取反
    cart[index].checked = !cart[index].checked;
    //把购物车数据重新设置回data中和缓存中
    this.setCart(cart)

  },
  //设置购物车状态 重新计算 底部工具栏的数据 全选 总价格 购买的数量
  setCart(cart) {
    this.setData({
      cart
    })
    //1.总价格 总数量
    let allChecked = true
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
  //商品的全选功能
  allChange() {
    let {
      cart,
      allChecked
    } = this.data;
    allChecked = !allChecked
    cart.forEach(v => v.checked = allChecked)
    this.setCart(cart)
  },
  //点击+ -号
  //  add(e){
  //   const {cart}=this.data
  //   const id=e.currentTarget.dataset.id
  //   let index=cart.findIndex(v=>v.goods_id===id)
  //   cart[index].num++
  //   this.setCart(cart)
  //  },
  //  edit(){
  //   const {cart}=this.data
  //   const id=e.currentTarget.dataset.id
  //   let index=cart.findIndex(v=>v.goods_id===id)
  //   cart[index].num--
  //   this.setCart(cart)
  //  },
  async handelEdit(e) {
    const {id,open} = e.currentTarget.dataset
    const {cart} = this.data
    let index = cart.findIndex(v => v.goods_id === id)
    if (cart[index].num === 1 && open === -1) {
      const res = await showModal({
        content: '您是否要删除？',
      })
      if (res.confirm) {
        cart.splice(index, 1)
        this.setCart(cart)
      } else if (res.cancel) {}
    } else {
      cart[index].num += open
      this.setCart(cart)
    }
  },
//点击结算
  async handlePay(){
    //1.判断收货地址
    const {address,totalNum}=this.data;
    if(!address.userName){
      const res= await showToast({title:"请添加收货地址"});
      return
    }
    //2.判断是否选中商品
    if(totalNum===0){
      const res= await showToast({title:"请选择商品~"});
      return
    }
    //3.跳转结算页面
    wx.navigateTo({
      url: '/pages/pay/pay',
    })
  }
})