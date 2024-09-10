import {
  API_BASE_URL
} from '@/common/config.js';

function getUpdateCoor(lat, lng) {
  uni.request({
    url: API_BASE_URL + global.apiUrls.updateCoor, //仅为示例，并非真实接口地址。
    data: {
      lat: lat,
      lng: lng
    },
    method: 'POST',
    header: {
      'user-token':global.token,
      'group-id' : '3',
    },
    success: (resData) => {
      console.log(resData)
    }
  })
}
module.exports = {
  getUpdateCoor
}
