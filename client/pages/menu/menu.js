const wxSDK = require("../../lib/wxSDK");
const wxRequest = require("../../lib/wxRequest");
const app = getApp();

Page({
  data: {
    logged: false,
    userInfo: {},
    mode: "select",
    menulist: [],
    shareInfo: null
  },
  onLoad: function () {
    this.setData(app.globalData);
    if (this.data.shareInfo != null)
      this.setData({ mode: "share" });

    let menulist = wx.getStorageSync("menulist");
    let _menulist = []
    if (typeof menulist == "object" && menulist != null) {
      for (let i in menulist) {
        _menulist.push(i);
      }
      this.setData({ menulist: _menulist })
    } else {
      wx.removeStorageSync("menulist")
    }
  },

  onShareAppMessage: function (res) {
    if (res.from === 'button' && this.data.shareInfo) {
      return this.data.shareInfo;
    }
    return {
      title: `拼少D`,
      path: `/pages/login`,
      imageUrl: '../../resource/img/share-cover.jpg'
    }

  },

  doShare: async function (e) {
    wx.showLoading({ title: "等一哈", mask: true });
    let name = e.target.dataset.name;
    let menulist = wx.getStorageSync("menulist") || {};
    try {
      let res = await wxRequest.createMenu(this.data.userInfo.nickName, name, menulist[name]);
      if (res.status == "ok") {
        let shareInfo = {
          title: `来一起叫${name}吧`,
          path: `/pages/login?menuid=${res.menuid}`,
          imageUrl: '../../resource/img/share-cover.jpg'
        }
        console.log(res.menuid);
        wx.hideLoading();
        this.setData({ mode: "share", shareInfo });

      } else {
        wx.hideLoading();
        wx.showToast({
          title: res.data || "出错了",
          icon: "none",
        });
      }
    } catch (e) {
      wx.hideLoading();
      wx.showToast({
        title: "出错了",
        icon: "none",
      });
    }
    
  },


  changeMode: function (e) {
    let mode = e.target.dataset.mode;
    switch (mode) {
      case "edit": {
        let name = e.target.dataset.name;
        let menulist = wx.getStorageSync("menulist") || {};
        if (Array.isArray(menulist[name])) {
          this.setData({ mode: "edit", menulist: menulist[name], menuname: name });
          break;
        }
        wx.showToast({
          title: 'o~oh',
          icon: "fail",
        });
      }
      case "select": {
        let menulist = wx.getStorageSync("menulist");
        let ml = []
        if (typeof menulist == "object" && menulist != null) {
          for (let i in menulist) {
            ml.push(i);
          }
        }
        this.setData({ mode: "select", menulist: ml });
        break;
      }

      case "new":
        if (this.data.menulist.length >= 5) {
          wx.showToast({
            title: '最多5个菜单',
            icon: "fail",
            mask: true
          });
        } else {
          this.setData({ mode: "new", menulist: [{ id: 0 }] });
        }
        break;
    }

  },
  addMenu: function (e) {
    let _id = this.data.menulist.length;
    this.data.menulist.push({ id: _id });
    this.setData({ menulist: this.data.menulist });
  },

  subMenu: function (e) {
    let _id = e.target.dataset.id;
    let map = new Map();
    for (let m of this.data.menulist) {
      map.set(m.id, m);
    }
    map.delete(_id);
    let newid = 0;
    let newMenulist = [];
    for (let m of map.values()) {
      m.id = newid++;
      newMenulist.push(m);
    }
    this.setData({ menulist: newMenulist });
  },
  menuInput: function (e) {
    let { id, key } = e.target.dataset;
    if (typeof this.data.menulist[id] == "object")
      this.data.menulist[id][key] = e.detail.value;
  },

  menuSubmit: function (e) {
    wx.showLoading({ title: "hold住先", mask: true });
    let menuname = e.detail.value.menuname;
    if (typeof menuname === "string" && menuname.length > 0) {
      let arr = [];
      let newid = 0;
      for (let m of this.data.menulist) {
        if (m.name && m.price) {
          m.id = newid++;
          arr.push(m);
        }
      }


      if (arr.length > 0) {
        let menulist = wx.getStorageSync("menulist") || {};
        let newmenulist = {};
        newmenulist[menuname] = arr;
        Object.assign(menulist, newmenulist);
        let count = 0;
        for (let i in menulist) { count++; }
        if (count <= 5) {
          wx.setStorageSync("menulist", menulist);
          this.changeMode({ target: { dataset: { mode: "select" } } });
          wx.hideLoading();
          return;
        }
      }
    }
    wx.hideLoading();
    wx.showToast({ title: "衰咗", icon: "none" })
  },

  menuReset: function (e) {
    this.setData({ menulist: [{ id: 0 }] });
  }

})