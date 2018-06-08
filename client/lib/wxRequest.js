const url = "https://gt1xvttt.qcloud.la";
class wxRequest {



  createMenu(nick, menuname, menu) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${url}/httpapi/createMenu`,
        data: { nick, menuname, menu },
        method: "POST",
        success: (e) => {
          console.log(e.data);
          resolve(e.data);
        },
        fail: (e) => {
          cosnole.log(e);
          reject(e);
        }
      });

    });
  }

}


module.exports = new wxRequest();