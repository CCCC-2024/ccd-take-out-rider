export default {

  /*========================================
  =            public interface            =
  ========================================*/

  // type 1=注册(未注册手机号),2=忘记密码(已经注册的手机号),3=短信登录,4修改手机号5绑定手机号
  aliSend: '/v1/5b5bdc44796e8',                                         // 发送验证码
  publicUpdateAPP: '/v1/6038d588c2544',                                 // 版本更新

  getChatHistory: '/v1/5f601350edaa4',                                  // 获取聊天记录
  sendContent: '/v1/5f5ee8e86c27b',                                     // 发送消息
  IMAuthenticate: '/v1/5fbb84a54d991',                                  // 链接socket
  converList: '/v1/5f6010f4df24a',                                      // 会话列表
  cancellation: '/v1/618384f43eadc',                                    // 注销账号
	isShelf: '/v1/624663b397429',                                         // 是否上架展示

  loginByMobile: '/v1/5cad9f63e4f94',                                   // 注册
  attest: '/v1/6013ee1c56250',                                          // 认证
  psdLogin: '/v1/5c78dbfd977cf',                                        // 密码登录 已修复
  codeLogin: '/v1/5c78dca45ebc1',                                       // 验证码登录
  getRiderMsg: '/v1/601f3acd328dc',                                     // 获取骑手认证信息 已修复
  forgetPsd: '/v1/5caeeba9866aa',                                       // 忘记密码
  postUserSocialLogin: '/v1/5d7660a421e69',                             // 三方登录
  wxloginByMobile: '/v1/5d7757d28d076',                                 // 微信绑定手机号

  orderList: '/v1/602e001051ead',                                       // 外卖待接单列表 已修复
  runList: '/v1/61612be952277',                                         // 跑腿待接单列表
  ReceList: '/v1/6171095374a8c',                                        // 跑腿已接单列表
  foodsList: '/v1/602e0aa13baad',                                       // 外卖已接单列表
  daifoodsList: '/v1/602e001051ead',                                       // 外卖已接单列表 已修复
  operat: '/v1/616133c72a8b0',                                          // 跑腿立即接单 TODO
  foodOperat: '/v1/602e1bb7bc0d2',                                      // 美食抢单
  pickOrder: '/v1/602e22c175ea9',                                       // 外卖取货
  runPickOrder: '/v1/616135e879230',                                    // 跑腿取货
  Service: '/v1/602e2412ed9da',                                         // 外卖确认送达
  runSever: '/v1/616137bfd93fa',                                        // 跑腿确认送达
  evaluate: '/v1/611a47411f268',                                        // 评价列表
  orderDel: '/v1/61613932b91bc',                                        // 跑腿订单详情
  takeOrderDel: '/v1/602e2498bfb2d',                                    // 外卖订单详情
  automatic: '/v1/613f07b455f41',                                       // 系统自动派单
  abolishOrder: '/v1/6163fbd0c3227',                                    // 取消订单
  reassOrder1: '/v1/615d4dcf8a139',                                     // 外卖转派订单
  reassOrder2: '/v1/61613f67c643e',                                     // 跑腿转派订单
  reachStore: '/v1/615d04cd4bb3c',                                      // 到达商家
  delay: '/v1/615d6a40aa04b',                                           // 申请延时

  msgType: '/v1/5d67ac9454d53',                                         // 消息类型
  systemMessageList: '/v1/5cc56966e9287',                               // 站内消息列表
  systemMessageDetail: '/v1/600f6d1f02173',                             // 消息详情
  saveMaterial: '/v1/5cb54af125f1c',                                    // 保存资料
  aboutUs: '/v1/6004e7a691f9c',                                         // 关于我们
  custoSever: '/v1/61501de16b9ff',                                      // 联系我们
  surplus: '/v1/601f407f1acaa',                                         // 余额
  balanceDel: '/v1/6114f2aa1801c',                                      // 余额明细
  cityList: '/v1/60012b50c5340',                                        // 城市列表
  orderNum: '/v1/60338a7eceb26',                                        // 订单数量
  storeWithdrawCheck: '/v1/5d7b9bd1c7d7c',                              // 获取绑定账号信息
  bindAccount: '/v1/5d7b7d4007529',                                     // 绑定提现账号
  cashAdvance: '/v1/5ce25d5e1ffb8',                                     // 提现
  setZfPsd: '/v1/61138b688aedb',                                        // 设置支付密码

  policy: '/v1/6009538231eb9',                                          // 政策
  treaty: '/v1/6002505bbd893',                                          // 协议
  feedbackType: '/v1/5d63ba953ee01',                                    // 建议类型
  tickling: '/v1/5cc3f28296cf0',                                        // 意见反馈
  history: '/v1/5cb97ad30ea88',                                         // 历史反馈
  nextBangding: '/v1/5d5f4c28b8636',                                    // 绑定手机号
  bindEamil: '/v1/60029f89009f2',                                       // 绑定邮箱

  // changePsd: '/v1/5da9ab4c4c7af',                                       // 修改密码
  changePsd: '/v1/615016d35d4b0',                                       // 修改密码
  xieyi: '/v1/6036098f4807f',                                           // 骑手协议
  changePassward: '/v1/5f69dfd20a8c5',                                  // 修改支付密码
  proofPsd: '/v1/5f6db4db8abcf',                                        // 校验验证码
  setStatus: '/v1/6038a87308e62',                                       // 设置骑手工作状态
  updateCoor: '/v1/602e2ed3ad73e',                                      // 更新骑手位置
  essay: '/v1/5d63befcb25d9',                                           // 指定文章单页详情

  qrcode: '/v1/611b2ff19baa7',                                          // 我的邀请
  cardList: '/v1/61139a70f252b',                                        // 银行卡列表
  cashDel: '/v1/615d445dab2d9',                                         // 提现账号详情

  searchHistory: '/v1/6007d16265739',                                   // 搜索历史
  cleanHistory: '/v1/6007d328954f2',                                    // 清空搜索历史
  appraise: '/v1/6152c951c7a4e',                                        // 评价用户
  myEvaluat: '/v1/602e240d52b0b',                                       // 我的评价列表

  Statistics: '/v1/6164e656390db',                                      // 订单统计
  censusDel: '/v1/6153dce2e725a',                                       // 统计明细
  ranking: '/v1/6164fc32ee22e',                                         // 订单排行榜
  distancRank: '/v1/6173a79d0c568',                                     // 配送距离排行
  onTimeRank: '/v1/6178b77728196',                                      // 准时率排行榜
  cutAccount: '/v1/615d1e9645c96',                                      // 删除提现账号
  checkCode: '/v1/5f6db4db8abcf',                                       // 校验验证码
  overtimeLine: '/v1/6166374457e72',                                    // 超时记录

  carType: '/v1/612f46c17e5e8',                                         // 车辆类型

  postUserUpdate_pay_password: '/v1/61138b688aedb',                     // 修改支付密碼
  postUserUpdate_old_password: '/v1/5f64a4d364b44',                     // 校驗舊支付密码
  informats: '/v1/618385085fdf7',                                       // 未读消息数 已修复


  getIdentifyingCode: '/v1/65ee78c49f67c',//获取登录图形验证码
  postVerificationCode: '/v1/65ee79dd93075',//验证登录图形验证码
}
