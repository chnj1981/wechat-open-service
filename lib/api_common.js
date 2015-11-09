var urllib = require('urllib');
var util = require('./util');
var extend = require('util')._extend;
var wrapper = util.wrapper;
var postJSON = util.postJSON;

var ComponentAccessToken = function (data) {
  if (!(this instanceof ComponentAccessToken)) {
    return new ComponentAccessToken(data);
  }
  this.component_access_token = data.component_access_token;
  this.expires_in = data.expires_in;
};

/**
 * 根据component_appid、component_appsecret和component_verify_ticket创建API的构造函数。
 *
 * 如需跨进程跨机器进行操作Wechat API（依赖access token），access token需要进行全局维护
 * 使用策略如下：
 *
 * 1. 调用用户传入的获取token的异步方法，获得token之后使用
 * 2. 使用appid/appsecret获取token。并调用用户传入的保存token方法保存
 *
 * Examples:
 * ```
 * var API = require('wechat-open-service');
 * var api = new API('component_appid', 'component_appsecret', 'component_verify_ticket');
 * ```
 * 以上即可满足单进程使用。
 * 当多进程时，token需要全局维护，以下为保存token的接口。
 * ```
 * var api = new API('component_appid', 'component_appsecret', 'component_verify_ticket', function (callback) {
 *   // 传入一个获取全局token的方法
 *   fs.readFile('component_access_token.txt', 'utf8', function (err, txt) {
 *     if (err) {return callback(err);}
 *     callback(null, JSON.parse(txt));
 *   });
 * }, function (token, callback) {
 *   // 请将token存储到全局，跨进程、跨机器级别的全局，比如写到数据库、redis等
 *   // 这样才能在cluster模式及多机情况下使用，以下为写入到文件的示例
 *   fs.writeFile('component_access_token.txt', JSON.stringify(token), callback);
 * });
 * ```
 * 参数请参考 开发平台的 -> 管理中心 / 平台详情
 *
 * @param {String} component_appid 在开放平台上申请得到的 AppID
 * @param {String} component_appsecret 在PaaS平台上申请得到的 AppSecret
 * @param {String} component_verify_ticket 微信服务器每10分钟向回调接口推送的component_verify_ticket消息
 * @param {Function} getToken 可选的。获取全局token对象的方法，多进程模式部署时需在意
 * @param {Function} saveToken 可选的。保存全局token对象的方法，多进程模式部署时需在意
 */
var API = function (component_appid, component_appsecret, component_verify_ticket, getToken, saveToken) {
  this.component_appid = component_appid;
  this.component_appsecret = component_appsecret;
  this.component_verify_ticket = component_verify_ticket;
  this.store = null;
  this.getToken = getToken || function (callback) {
    callback(null, this.store);
  };
  this.saveToken = saveToken || function (token, callback) {
    this.store = token;
    if (process.env.NODE_ENV === 'production') {
      console.warn('Don\'t save token in memory, when cluster or multi-computer!');
    }
    callback(null);
  };
  this.prefix = 'https://api.weixin.qq.com/cgi-bin/';
  this.defaults = {};
};


/**
 * 用于设置urllib的默认options
 *
 * Examples:
 * ```
 * api.setOpts({timeout: 15000});
 * ```
 * @param {Object} opts 默认选项
 */
API.prototype.setOpts = function (opts) {
  this.defaults = opts;
};

/**
 * 设置urllib的options
 *
 */
API.prototype.request = function (url, opts, callback) {
  var options = {};
  extend(options, this.defaults);
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }
  for (var key in opts) {
    if (key !== 'headers') {
      options[key] = opts[key];
    } else {
      if (opts.headers) {
        options.headers = options.headers || {};
        extend(options.headers, opts.headers);
      }
    }
  }
  urllib.request(url, options, callback);
};

/*!
 * 根据创建API时传入的componentId,componentSecret和componentTicket获取component access token
 * 进行后续所有API调用时，需要先获取access token
 * 详细请看：<http://mp.weixin.qq.com/wiki/index.php?title=获取access_token>
 *
 * 应用开发者无需直接调用本API。
 *
 * Examples:
 * ```
 * api.getComponentToken(callback);
 * ```
 * Callback:
 *
 * - `err`, 获取access token出现异常时的异常对象
 * - `result`, 成功时得到的响应结果
 *
 * Result:
 * ```
 * {"component_access_token": "ACCESS_TOKEN",
 *  "expires_in": 7200 }
 * ```
 * @param {Function} callback 回调函数
 */
API.prototype.getComponentToken = function (callback) {

  var url = this.prefix + 'component/api_component_token';
  var data = {
    component_appid: this.component_appid,
    component_appsecret: this.component_appsecret,
    component_verify_ticket: this.component_verify_ticket
  };
  var that = this;
  this.request(url, postJSON(data), wrapper(function (err, data) {
    if (err) {
      return callback(err);
    }
    var token = ComponentAccessToken(data);
    // console.log(token);
    that.saveToken(token, function (err) {
      if (err) {
        return callback(err);
      }
      callback(err, token);
    });
  }));

  return this;
};


/*!
 * generateAuthUrl
 * 拼装出第三方授权用的URL
 * 文档地址 https://open.weixin.qq.com/cgi-bin/showdocument?action=dir_list&t=resource/res_list&verify=1&id=open1419318292&token=&lang=zh_CN
 * Examples:
 * ```
 * api.generateAuthUrl((preAuthCode, redirectUri);
 * ```
 */

API.prototype.generateAuthUrl = function (preAuthCode, redirectUri) {
  //https://mp.weixin.qq.com/cgi-bin/componentloginpage?component_appid=xxxx&pre_auth_code=xxxxx&redirect_uri=xxxx
  return 'https://mp.weixin.qq.com/cgi-bin/componentloginpage?component_appid=' + this.component_appid +
    "&pre_auth_code=" + preAuthCode + "&redirect_uri=" + redirectUri;
};

/*!
 * 需要access token的接口调用如果采用preRequest进行封装后，就可以直接调用。
 * 无需依赖getAccessToken为前置调用。
 * 应用开发者无需直接调用此API。
 *
 * Examples:
 * ```
 * api.preRequest(method, arguments);
 * ```
 * @param {Function} method 需要封装的方法
 * @param {Array} args 方法需要的参数
 */
API.prototype.componentPreRequest = function (method, args, retryed) {
  var that = this;
  var callback = args[args.length - 1];
  // 调用用户传入的获取token的异步方法，获得token之后使用（并缓存它）。
  that.getToken(function (err, token) {
    if (err) {
      return callback(err);
    }
    // console.log(token);
    // 有token并且token有效直接调用
    if (token) {
      // 暂时保存token
      that.componentToken = ComponentAccessToken(token);
      if (!retryed) {
        var retryHandle = function (err, data, res) {
          // 42001 重试
          if (data && data.errcode && data.errcode === 42001) {
            return that.preRequest(method, args, true);
          }
          callback(err, data, res);
        };
        // 替换callback
        var newargs = Array.prototype.slice.call(args, 0, -1);
        newargs.push(retryHandle);
        method.apply(that, newargs);
      } else {
        method.apply(that, args);
      }
    } else {
      // 使用appid/appsecret获取token
      that.getComponentToken(function (err, token) {
        // 如遇错误，通过回调函数传出
        if (err) {
          return callback(err);
        }
        // 暂时保存token
        that.componentToken = token;
        method.apply(that, args);
      });
    }
  });
};

/**
 * 获取最新的token。
 *
 * - 如果还没有请求过token，则发起获取Token请求。
 * - 如果请求过，则调用getToken从获取之前保存的token
 *
 * Examples:
 * ```
 * api.getLatestToken(callback);
 * ```
 * Callback:
 *
 * - `err`, 获取access token出现异常时的异常对象
 * - `token`, 获取的token
 *
 * @param {Function} callback 回调函数
 */
API.prototype.getLatestToken = function (callback) {
  var that = this;
  // 调用用户传入的获取token的异步方法，获得token之后使用（并缓存它）。
  that.getToken(function (err, token) {
    if (err) {
      return callback(err);
    }
    // 有token
    if (token) {
      callback(null, ComponentAccessToken(token));
    } else {
      // 使用appid/corpsecret获取token
      that.getComponentToken(callback);
    }
  });
};

API.prototype.setComponentToken = function (newTicket) {
  this.componentToken = newTicket;
};

/**
 * 用于支持对象合并。将对象合并到API.prototype上，使得能够支持扩展
 * Examples:
 * ```
 * // 媒体管理（上传、下载）
 * API.mixin(require('./lib/api_media'));
 * ```
 * @param {Object} obj 要合并的对象
 */
API.mixin = function (obj) {
  for (var key in obj) {
    if (API.prototype.hasOwnProperty(key)) {
      throw new Error('Don\'t allow override existed prototype method. method: '+ key);
    }
    API.prototype[key] = obj[key];
  }
};

API.componentToken = ComponentAccessToken;

module.exports = API;
