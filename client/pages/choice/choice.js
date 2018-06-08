let st = null;
const localInit = async () => {
  if (st != null) return;
  try {
    st = await wxSDK.getSocketTask();
    st.onClose(() => {
      st = null;
    });
  } catch (e) {
    st = null;
  }

}