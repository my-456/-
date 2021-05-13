// pages/auth/auth.js
import {
  getSetting,
  openSetting,
  chooseAddress,
  showModal,
  showToast,
  login
} from '../../utils/asyncWx'
import regeneratorRuntime from '../../lib/runtime/runtime'
import {request} from '../../request/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
   
    
  },
  //获取用户信息
async handleGetUserInfo(e){
  try {
    console.log(e)
    //获取用户信息
    const {encryptedData,rawData,iv,signature}=e.detail;
    //获取小程序登录成功后的code
    const {code}=await login()
    console.log(code)
      const loginParams={encryptedData,rawData,iv,signature,code}
    //发送请求 获取用户token值
    const {token}=await request({
      url:"/users/wxlogin",
      data:loginParams,
      method:"post"
    })
    console.log(res)
    //4.把token存入缓存中，同时跳转回上一个页面
    wx.setStorageSync('token', token);
    wx.navigateBack({
      delta:1
    })
  } catch (error) {
    console.log(error)
  }
    
}
  
})