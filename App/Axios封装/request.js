import { useUserStore } from "@/store/user.js";
import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

let isLoading;
function startLoading() {
  isLoading = uni.showLoading({
    title: "加载中",
    mask: true,
  });
}

function endLoading() {
  //.延迟200ms，防止太快
  setTimeout(function () {
    if (isLoading) {
      uni.hideLoading();
      isLoading = null;
    }
  }, 200);
}

// 添加请求拦截器
instance.interceptors.request.use(
  (config) => {
    if (config.loading) {
      startLoading();
    }
    const userStore = useUserStore();
    const token = userStore.token;
    if (token) {
      config.headers["Authorization"] = token;
    }
    return config;
  },
  (error) => {
    return error;
  }
);
//. 添加响应拦截器
instance.interceptors.response.use(
  (response) => {
    const { config, data } = response;
    if (config.message) {
      const { success, message, msg } = data;
      if (success) {
        uni.showToast({
          icon: "success",
          title: "操作成功",
        });
      } else {
        message &&
          uni.showToast({
            icon: "error",
            title: message,
          });
        msg &&
          uni.showToast({
            icon: "error",
            title: msg,
          });
      }
    }
    endLoading();
    return response;
  },
  (error) => {
    const response = error?.response;
    if (response) {
      const { status } = response;
      switch (status) {
        case 401:
          const userStore = useUserStore();
          userStore.setToken();
          userStore.setUserInfo();
          window.location.reload();
          break;
        default:
          break;
      }
    }
    const config = error?.config;
    if (config?.loading) {
      endLoading();
    }
    return error;
  }
);

export default instance;