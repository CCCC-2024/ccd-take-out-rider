import Router from './router.js'
// 在可预见的未来会把moment.js更换为更轻量级的day.js
import Dayjs from './day.js'
import UploadImg from './upload-image.js'
import UploadFileToQINIU from './upload-file-to-qiniu.js'
import UploadFileToOSS from './upload-file-to-oss.js'
import debounce from './debounce.js'
import throttle from './throttle.js'
import { message } from './message.js'
import { validate } from './validate.js'
import updateApp from './update_app.js'

export {
  Dayjs,
  message,
  validate,
  UploadImg,
  UploadFileToQINIU,
  UploadFileToOSS,
  updateApp,
  debounce,
  throttle,
  Router
}
