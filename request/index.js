//同时发送ajax的次数
 let ajaxTimes=0;
export const request=(params)=>{
  //判断url中是否有/my/
  let header={...params.heaadergf};
  if(params.url.includes("/my/")){
    //拼接header 带上token
    header["Authorrization"]=wx.getStorageSync('token')
  }

  ajaxTimes++
  //显示加载中
  wx.showLoading({
    title: '加载中',
    mask:true
  })
  return new Promise((resolve,reject)=>{
    const baseUrl="https://api-hmugo-web.itheima.net/api/public/v1"
    wx.request({
      ...params,
      header,
      url:baseUrl+params.url,
      success:(result)=>{
        resolve(result.data.message);
      },
      fail:(err)=>{
        reject(err)
      },
      complete:()=>{
        ajaxTimes--
        if(ajaxTimes===0){
           //关闭图标
        wx.hideLoading({
          complete: (res) => {},
        })
        }
       
      }
    })
  })
}