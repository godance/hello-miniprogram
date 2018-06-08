const url = "wss://gt1xvttt.qcloud.la/wsConnect";
const STATE = {
  INIT: 0,
  CONNECTING: 1,
  READY: 2
};

class wxSDK {
  constructor() {
    this.wsState = STATE.INIT;
    this.socketTask = null;
    this.waitList = new Map();
  }


  getSocketTask() {
    const me = this;
    return new Promise((resolve, reject) => {
      switch (me.wsState) {
        case STATE.READY:
          return resolve(me.socketTask);
        case STATE.CONNECTING:
          me._waitListSet("getSocketTask", { resolve, reject });
          return;
        case STATE.INIT:
          me.state = STATE.CONNECTING;
          me._waitListSet("getSocketTask", { resolve, reject });
          let _st = wx.connectSocket({ url: url });
          _st.onOpen(() => {
            me.socketTask = _st;
            me.wsState = STATE.READY;
            me._waitListDel("getSocketTask", _st);
          });
          let _onclose = (errMsg) => {
            me.socketTask = null;
            me.wsState = STATE.INIT;
            me._waitListDel("getSocketTask", null, errMsg || "close");
          };
          _st.onClose(_onclose);
          _st.onError(_onclose);
      }
    });

  }

  _waitListSet(method, promiseObj) {
    let arr = this.waitList.get(method) || [];
    arr.push(promiseObj);
    this.waitList.set(method, arr);
  }

  _waitListDel(method, result, error) {
    let arr = this.waitList.get(method) || [];
    if (error) {
      arr.forEach((obj) => { obj.reject(error) });
    } else {
      arr.forEach((obj) => { obj.resolve(result) });
    }
    this.waitList.delete(method);
  }

}


module.exports = new wxSDK();