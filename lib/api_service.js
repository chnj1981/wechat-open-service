var util = require('./util');
var wrapper = util.wrapper;
var postJSON = util.postJSON;

/*!
 *
 * 获取预授权码
 * 该API用于获取预授权码。预授权码用于公众号授权时的第三方平台方安全验证。
 */
exports.getPreAuthCode = function (callback) {
  this.componentPreRequest(this._getPreAuthCode, arguments);
};

exports._getPreAuthCode = function (callback) {
  //https://api.weixin.qq.com/cgi-bin/component/api_create_preauthcode?component_access_token=xxx
  var url = this.prefix + 'component/api_create_preauthcode?component_access_token=' + this.componentToken.component_access_token;
  var data = {
    component_appid: this.component_appid
  }
  this.request(url, postJSON(data), wrapper(callback));
};

/*!
 * 该API用于使用授权码换取授权公众号的授权信息，并换取authorizer_access_token和authorizer_refresh_token。
 * 授权码的获取，需要在用户在第三方平台授权页中完成授权流程后，在回调URI中通过URL参数提供给第三方平台方。
 * authorizer_access_token有过期时间，需要将authorizer_refresh_token保存起来，以备后续使用刷新authorizer_access_token
 */
exports.getAuthorizerRefreshToken = function (authCode, callback) {
  this.componentPreRequest(this._getAuthorizerRefreshToken, arguments);
};

exports._getAuthorizerRefreshToken = function (authCode, callback) {
  // https://api.weixin.qq.com/cgi-bin/component/api_query_auth?component_access_token=xxxx
  var url = this.prefix + 'component/api_query_auth?component_access_token=' + this.componentToken.component_access_token;
  var data = {
    component_appid: this.component_appid,
    authorization_code: authCode
  };

  this.request(url, postJSON(data), wrapper(callback));
};

/*!
 * 该API用于在授权方令牌（authorizer_access_token）失效时，可用刷新令牌（authorizer_refresh_token）获取新的令牌。
 * 获取（刷新）授权公众号的令牌
 */
exports.getAuthorizerAccessToken = function (authorizer_appid, authorizer_refresh_token, callback) {
  this.componentPreRequest(this._getAuthorizerAccessToken, arguments);
};

exports._getAuthorizerAccessToken = function (authorizer_appid, authorizer_refresh_token, callback) {
  // https:// api.weixin.qq.com /cgi-bin/component/api_authorizer_token?component_access_token=xxxxx
  var url = this.prefix + 'component/api_authorizer_token?component_access_token=' + this.componentToken.component_access_token;
  var data = {
    component_appid: this.component_appid,
    authorizer_appid: authorizer_appid,
    authorizer_refresh_token: authorizer_refresh_token
  };

  this.request(url, postJSON(data), wrapper(callback));
};

/*!
 * 获取授权方的账户信息
 * 该API用于获取授权方的公众号基本信息，包括头像、昵称、帐号类型、认证类型、微信号、原始ID和二维码图片URL。
 * 需要特别记录授权方的帐号类型，在消息及事件推送时，对于不具备客服接口的公众号，需要在5秒内立即响应；
 * 而若有客服接口，则可以选择暂时不响应，而选择后续通过客服接口来发送消息触达粉丝。
 */
exports.getAuthorizerInfo = function (authorizer_appid, callback) {
  this.componentPreRequest(this._getAuthorizerInfo, arguments);
};

exports._getAuthorizerInfo = function (authorizer_appid, callback) {
  //https://api.weixin.qq.com/cgi-bin/component/api_get_authorizer_info?component_access_token=xxxx
  var url = this.prefix + 'component/api_get_authorizer_info?component_access_token=' + this.componentToken.component_access_token;
  var data = {
    component_appid: this.component_appid,
    authorizer_appid: authorizer_appid,
  };
  this.request(url, postJSON(data), wrapper(callback));
};

/*!
 * 获取授权方的选项设置信息
 * 该API用于获取授权方的公众号的选项设置信息，如：地理位置上报，语音识别开关，多客服开关。
 * 注意，获取各项选项设置信息，需要有授权方的授权，详见权限集说明。
 */

exports.getAuthorizerOption = function (authorizer_appid, option_name, callback) {
  this.componentPreRequest(this._getAuthorizerOption, arguments);
};

exports._getAuthorizerOption = function (authorizer_appid, option_name, callback) {
  // https://api.weixin.qq.com/cgi-bin/component/ api_get_authorizer_option?component_access_token=xxxx
  var url = this.prefix + 'component/ api_get_authorizer_option?component_access_token=' + this.componentToken.component_access_token;
  var data = {
    component_appid: this.component_appid,
    authorizer_appid: authorizer_appid,
    option_name: option_name
  };

  this.request(url, postJSON(data), wrapper(callback));

};


/*!
 * 设置授权方的选项信息
 * 该API用于设置授权方的公众号的选项信息，如：地理位置上报，语音识别开关，多客服开关。
 * 注意，设置各项选项设置信息，需要有授权方的授权，详见权限集说明。
 */
exports.setAuthorizerOption = function (authorizer_appid, option_name, option_value, callback) {
  this.componentPreRequest(this._setAuthorizerOption, arguments);
};

exports._setAuthorizerOption = function (authorizer_appid, option_name, option_value, callback) {
  //https://api.weixin.qq.com/cgi-bin/component/ api_set_authorizer_option?component_access_token=xxxx
  var url = this.prefix + 'component/ api_set_authorizer_option?component_access_token=' + this.componentToken.component_access_token;
  var data = {
    component_appid: this.component_appid,
    authorizer_appid: authorizer_appid,
    option_name: option_name,
    option_value: option_value
  };

  this.request(url, postJSON(data), wrapper(callback));

};