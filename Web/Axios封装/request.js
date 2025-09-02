import { useUserStore } from "@/store/user";
import axios from "axios";
import { ElLoading, ElMessage } from "element-plus";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

let requestCount = 0; ///记录请求次数
let loading = null;
/**
 * @function loading启动器
 */
function startLoading() {
  loading = ElLoading.service({
    lock: true,
  });
}
/**
 * @function 启动loading
 */
function openLoading() {
  if (requestCount === 0) {
    startLoading();
  }
  requestCount++; ///每有一个配置了loading:true的请求开启，count++
}
/**
 * @function loading结束器
 */
function endLoading() {
  //.延迟200ms，防止太快
  setTimeout(() => {
    if (loading) {
      loading.close(); //! 所有的请求共用一个loading实例，一个关则全关
    }
  }, 200);
}
/**
 * @function 关闭loading
 */
function closeLoading() {
  if (requestCount <= 0) return;
  requestCount--; ///每有一个配置了loading:true的请求结束，count--
  if (requestCount === 0) {
    endLoading(); /// 所有请求结束，关loading
  }
}
/**
 * @function 添加请求拦截器
 */
instance.interceptors.request.use(
  (config) => {
    if (config.loading) {
      openLoading(); /// 实际使用举例：getData({},{loading:true,message:true})
    }
    const userStore = useUserStore();
    const token = userStore.token;
    if (token) {
      config.headers["Authorization"] = token;
    }
    return config;
  },
  (error) => {}
);

/**
 * @function 添加响应拦截器
 */
instance.interceptors.response.use(
  (response) => {
    const { config, data } = response;
    if (config.message) {
      const { success, message, msg } = data;
      if (success) {
        /// 可以自定义统一的成功提示，也可以每种情况自定义，我是每种自定义这里就没写
      } else {
        message && ElMessage.error(message);
        msg && ElMessage.error(msg);
      }
    }
    if (config.loading) {
      closeLoading(); /// 请求完，count--
    }
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
      closeLoading(); /// 请求完，count--
    }
    return error;
  }
);

export default instance;