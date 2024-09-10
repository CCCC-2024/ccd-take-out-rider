import Request from './request'
import { API_BASE_URL } from '../config.js'

const http = new Request();

http.setConfig((config) => {
  config.baseUrl = API_BASE_URL;
  return config
})

http.interceptor.request((config, cancel) => {
  config.header = {
    ...config.header,
    'user-token': global.token,
    'group-id': 3,
    'version-pt-number':'1.5.6',
    'lang': 'zh-cn'
    // global.LANGUAGE
  }
  /*
  if (!token) {
    cancel('token 不存在')
  }
  */
  return config;
})

http.interceptor.response((response) => {
  return response;
})

export {
  http
};
