



class wxSDK {


  getSetting() {
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success: res => resolve(res),
        fail: e => reject(e)
      });
    });
  }

  getUserInfo(){
    return new Promise((resolve, reject) => {
      wx.getUserInfo({
        success: res => resolve(res),
        fail: e => reject(e)
      });
    });
  }

  






}


module.exports = new wxSDK();