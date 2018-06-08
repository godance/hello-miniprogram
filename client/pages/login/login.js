
const wxSDK = require("../../lib/wxSDK");
const app = getApp();

Page({
  data: {
    userInfo: {},
    logged: null,
    percent: 80
  },
  onLoad: async function (e) {
    wx.showLoading({ title: "加载中", mask: true });
    let me = this;
    if (e.menuid) {
      app.globalData.menuid = e.menuid;
    }


    if (app.globalData.logged) {
      me.setData(app.globalData);
      if (e.menuid==null){
        wx.redirectTo({ url: '../menu/menu' });
      }
     wx.hideLoading();
      return;
    }
   
    try {
      let res = await wxSDK.getSetting();
      if (res.authSetting['scope.userInfo']) {
        let r = await wxSDK.getUserInfo();
        app.globalData.logged = true;
        app.globalData.userInfo = r.userInfo;
        //me.setData(app.globalData);
        
        if (e.menuid == null) {
          wx.redirectTo({ url: '../menu/menu' });
        }
      } else {
        me.setData({ logged: false });
      }
      wx.hideLoading();
    } catch (err) {
      me.setData({ logged: false });
      wx.hideLoading();
    }
  },

  getUserInfo: function (e) {
    let me = this;
    let userInfo = e.detail.userInfo;
    app.globalData.logged = true;
    app.globalData.userInfo = userInfo;
    this.setData(app.globalData);
    if (e.menuid == null) {
      wx.redirectTo({ url: '../menu/menu' });
    }
  }
})