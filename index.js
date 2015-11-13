//第三方平台API
var API = require('./lib/api_common');
API.mixin(require('./lib/api_service'));
//代理调用API
API.Agent = require('./lib/api_agent');
// 菜单接口
API.Agent.mixin(require('../wechat-api/lib/api_menu'));
// 分组管理
API.Agent.mixin(require('../wechat-api/lib/api_group'));
// 用户信息
API.Agent.mixin(require('../wechat-api/lib/api_user'));
// 二维码
API.Agent.mixin(require('../wechat-api/lib/api_qrcode'));
// 媒体管理（上传、下载）
API.Agent.mixin(require('../wechat-api/lib/api_media'));
// 永久素材管理接口
API.Agent.mixin(require('../wechat-api/lib/api_material'));
// 客服消息
API.Agent.mixin(require('../wechat-api/lib/api_message'));
// 模板消息
API.Agent.mixin(require('../wechat-api/lib/api_template'));
// 获取客服聊天记录
API.Agent.mixin(require('../wechat-api/lib/api_custom_service'));
// 高级群发接口
API.Agent.mixin(require('../wechat-api/lib/api_mass_send'));
// 微信小店商品管理接口
API.Agent.mixin(require('../wechat-api/lib/api_shop_goods'));
// 微信小店库存管理接口
API.Agent.mixin(require('../wechat-api/lib/api_shop_stock'));
// 微信小店邮费模版管理接口
API.Agent.mixin(require('../wechat-api/lib/api_shop_express'));
// 微信小店分组管理接口
API.Agent.mixin(require('../wechat-api/lib/api_shop_group'));
// 微信小店货架管理接口
API.Agent.mixin(require('../wechat-api/lib/api_shop_shelf'));
// 微信小店订单管理接口
API.Agent.mixin(require('../wechat-api/lib/api_shop_order'));
// 微信小店功能管理接口
API.Agent.mixin(require('../wechat-api/lib/api_shop_common'));
// 支付接口
API.Agent.mixin(require('../wechat-api/lib/api_payment'));
// 用户维权系统接口
API.Agent.mixin(require('../wechat-api/lib/api_feedback'));
// 短网址接口
API.Agent.mixin(require('../wechat-api/lib/api_url'));
// 语义查询接口
API.Agent.mixin(require('../wechat-api/lib/api_semantic'));
// 获取微信服务器IP地址
API.Agent.mixin(require('../wechat-api/lib/api_ip'));
// 图文消息数据分析接口
API.Agent.mixin(require('../wechat-api/lib/api_datacube'));
// js sdk接口
API.Agent.mixin(require('../wechat-api/lib/api_js'));
// 卡券接口
API.Agent.mixin(require('../wechat-api/lib/api_card'));
// 设备接口
API.Agent.mixin(require('../wechat-api/lib/api_device'));
// 摇一摇周边接口
API.Agent.mixin(require('../wechat-api/lib/api_shakearound'));
// 门店管理接口
API.Agent.mixin(require('../wechat-api/lib/api_poi'));

module.exports = API;
