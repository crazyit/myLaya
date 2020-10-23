// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"ui/layaMaxUI.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ui = void 0;
var Scene = Laya.Scene;
var REG = Laya.ClassUtils.regClass;
var ui;
exports.ui = ui;

(function (ui) {
  var test;

  (function (test) {
    class TestSceneUI extends Scene {
      constructor() {
        super();
      }

      createChildren() {
        super.createChildren();
        this.loadScene("test/TestScene");
      }

    }

    test.TestSceneUI = TestSceneUI;
    REG("ui.test.TestSceneUI", TestSceneUI);
  })(test = ui.test || (ui.test = {}));
})(ui || (exports.ui = ui = {}));
},{}],"script/GameControl.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * 游戏控制脚本。定义了几个dropBox，bullet，createBoxInterval等变量，能够在IDE显示及设置该变量
 * 更多类型定义，请参考官方文档
 */
class GameControl extends Laya.Script {
  constructor() {
    super();
    /** @prop {name:createBoxInterval,tips:"间隔多少毫秒创建一个下跌的容器",type:int,default:1000}*/

    this.createBoxInterval = 1000;
    /**开始时间*/

    this._time = 0;
    /**是否已经开始游戏 */

    this._started = false;
  }

  onEnable() {
    this._time = Date.now();
    this._gameBox = this.owner.getChildByName("gameBox");
  }

  onUpdate() {
    //每间隔一段时间创建一个盒子
    let now = Date.now();

    if (now - this._time > this.createBoxInterval && this._started) {
      this._time = now;
      this.createBox();
    }
  }

  createBox() {
    //使用对象池创建盒子
    let box = Laya.Pool.getItemByCreateFun("dropBox", this.dropBox.create, this.dropBox);
    box.pos(Math.random() * (Laya.stage.width - 100), -100);

    this._gameBox.addChild(box);
  }

  onStageClick(e) {
    //停止事件冒泡，提高性能，当然也可以不要
    e.stopPropagation(); //舞台被点击后，使用对象池创建子弹

    let flyer = Laya.Pool.getItemByCreateFun("bullet", this.bullet.create, this.bullet);
    flyer.pos(Laya.stage.mouseX, Laya.stage.mouseY);

    this._gameBox.addChild(flyer);
  }
  /**开始游戏，通过激活本脚本方式开始游戏*/


  startGame() {
    if (!this._started) {
      this._started = true;
      this.enabled = true;
    }
  }
  /**结束游戏，通过非激活本脚本停止游戏 */


  stopGame() {
    this._started = false;
    this.enabled = false;
    this.createBoxInterval = 1000;

    this._gameBox.removeChildren();
  }

}

exports.default = GameControl;
},{}],"script/GameUI.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _layaMaxUI = require("./../ui/layaMaxUI");

var _GameControl = _interopRequireDefault(require("./GameControl"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 本示例采用非脚本的方式实现，而使用继承页面基类，实现页面逻辑。在IDE里面设置场景的Runtime属性即可和场景进行关联
 * 相比脚本方式，继承式页面类，可以直接使用页面定义的属性（通过IDE内var属性定义），比如this.tipLbll，this.scoreLbl，具有代码提示效果
 * 建议：如果是页面级的逻辑，需要频繁访问页面内多个元素，使用继承式写法，如果是独立小模块，功能单一，建议用脚本方式实现，比如子弹脚本。
 */
class GameUI extends _layaMaxUI.ui.test.TestSceneUI {
  constructor() {
    super();
    GameUI.instance = this; //关闭多点触控，否则就无敌了

    Laya.MouseManager.multiTouchEnabled = false;
  }

  onEnable() {
    this._control = this.getComponent(_GameControl.default); //点击提示文字，开始游戏

    this.tipLbll.on(Laya.Event.CLICK, this, this.onTipClick);
  }

  onTipClick(e) {
    this.tipLbll.visible = false;
    this._score = 0;
    this.scoreLbl.text = "";

    this._control.startGame();
  }
  /**增加分数 */


  addScore(value = 1) {
    this._score += value;
    this.scoreLbl.changeText("分数：" + this._score); //随着分数越高，难度增大

    if (this._control.createBoxInterval > 600 && this._score % 20 == 0) this._control.createBoxInterval -= 20;
  }
  /**停止游戏 */


  stopGame() {
    this.tipLbll.visible = true;
    this.tipLbll.text = "游戏结束了，点击屏幕重新开始";

    this._control.stopGame();
  }

}

exports.default = GameUI;
},{"./../ui/layaMaxUI":"ui/layaMaxUI.ts","./GameControl":"script/GameControl.ts"}],"script/Bullet.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * 子弹脚本，实现子弹飞行逻辑及对象池回收机制
 */
class Bullet extends Laya.Script {
  constructor() {
    super();
  }

  onEnable() {
    //设置初始速度
    var rig = this.owner.getComponent(Laya.RigidBody);
    rig.setVelocity({
      x: 0,
      y: -10
    });
  }

  onTriggerEnter(other, self, contact) {
    //如果被碰到，则移除子弹
    this.owner.removeSelf();
  }

  onUpdate() {
    //如果子弹超出屏幕，则移除子弹
    if (this.owner.y < -10) {
      this.owner.removeSelf();
    }
  }

  onDisable() {
    //子弹被移除时，回收子弹到对象池，方便下次复用，减少对象创建开销
    Laya.Pool.recover("bullet", this.owner);
  }

}

exports.default = Bullet;
},{}],"script/DropBox.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _GameUI = _interopRequireDefault(require("./GameUI"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 掉落盒子脚本，实现盒子碰撞及回收流程
 */
class DropBox extends Laya.Script {
  constructor() {
    super();
    /**盒子等级 */

    this.level = 1;
  }

  onEnable() {
    /**获得组件引用，避免每次获取组件带来不必要的查询开销 */
    this._rig = this.owner.getComponent(Laya.RigidBody);
    this.level = Math.round(Math.random() * 5) + 1;
    this._text = this.owner.getChildByName("levelTxt");
    this._text.text = this.level + "";
  }

  onUpdate() {
    //让持续盒子旋转
    this.owner.rotation++;
  }

  onTriggerEnter(other, self, contact) {
    var owner = this.owner;

    if (other.label === "buttle") {
      //碰撞到子弹后，增加积分，播放声音特效
      if (this.level > 1) {
        this.level--;

        this._text.changeText(this.level + "");

        owner.getComponent(Laya.RigidBody).setVelocity({
          x: 0,
          y: -10
        });
        Laya.SoundManager.playSound("sound/hit.wav");
      } else {
        if (owner.parent) {
          let effect = Laya.Pool.getItemByCreateFun("effect", this.createEffect, this);
          effect.pos(owner.x, owner.y);
          owner.parent.addChild(effect);
          effect.play(0, true);
          owner.removeSelf();
          Laya.SoundManager.playSound("sound/destroy.wav");
        }
      }

      _GameUI.default.instance.addScore(1);
    } else if (other.label === "ground") {
      //只要有一个盒子碰到地板，则停止游戏
      owner.removeSelf();

      _GameUI.default.instance.stopGame();
    }
  }
  /**使用对象池创建爆炸动画 */


  createEffect() {
    let ani = new Laya.Animation();
    ani.loadAnimation("test/TestAni.ani");
    ani.on(Laya.Event.COMPLETE, null, recover);

    function recover() {
      ani.removeSelf();
      Laya.Pool.recover("effect", ani);
    }

    return ani;
  }

  onDisable() {
    //盒子被移除时，回收盒子到对象池，方便下次复用，减少对象创建开销。
    Laya.Pool.recover("dropBox", this.owner);
  }

}

exports.default = DropBox;
},{"./GameUI":"script/GameUI.ts"}],"GameConfig.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _GameUI = _interopRequireDefault(require("./script/GameUI"));

var _GameControl = _interopRequireDefault(require("./script/GameControl"));

var _Bullet = _interopRequireDefault(require("./script/Bullet"));

var _DropBox = _interopRequireDefault(require("./script/DropBox"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */

/*
* 游戏初始化配置;
*/
class GameConfig {
  constructor() {}

  static init() {
    var reg = Laya.ClassUtils.regClass;
    reg("script/GameUI.ts", _GameUI.default);
    reg("script/GameControl.ts", _GameControl.default);
    reg("script/Bullet.ts", _Bullet.default);
    reg("script/DropBox.ts", _DropBox.default);
  }

}

exports.default = GameConfig;
GameConfig.width = 640;
GameConfig.height = 1136;
GameConfig.scaleMode = "fixedwidth";
GameConfig.screenMode = "none";
GameConfig.alignV = "top";
GameConfig.alignH = "left";
GameConfig.startScene = "test/TestScene.scene";
GameConfig.sceneRoot = "";
GameConfig.debug = false;
GameConfig.stat = false;
GameConfig.physicsDebug = false;
GameConfig.exportSceneToJson = true;
GameConfig.init();
},{"./script/GameUI":"script/GameUI.ts","./script/GameControl":"script/GameControl.ts","./script/Bullet":"script/Bullet.ts","./script/DropBox":"script/DropBox.ts"}],"script/manager/Uimanager.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UiManager = void 0;

class UiManager {
  constructor() {
    this.mPanelArr = [];
  }

  static getInstance() {
    if (!UiManager.instance) {
      UiManager.instance = new UiManager();
    }

    return UiManager.instance;
  }

  openPanel(view) {
    console.log("openPanel....resName=" + view.resName + "packageName=" + view.packageName);
    let openPanel = new view(view.resName, view.packageName);
    openPanel.packageName = view.packageName;
    this.mPanelArr.push(openPanel);
  }

  closePanel(view) {
    let findIndex = -1;

    for (let index = 0; index < this.mPanelArr.length; index++) {
      const element = this.mPanelArr[index];
      console.log("for index----=" + element.packageName);

      if (element.packageName == view.packageName) {
        element.destroy();
        findIndex = index;
        console.log("find it");
        break;
      }
    }

    if (findIndex >= 0) {
      this.mPanelArr.splice(findIndex);
    }
  }

}

exports.UiManager = UiManager;
},{}],"INITConfig.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/*
* 初始化配置;
*/
class InitConfig {}

exports.default = InitConfig;
InitConfig.resPrefixPath = "res/ui/";
InitConfig.isDebug = true;
InitConfig.serverUrl = "ws://echo.websocket.org:80";
},{}],"script/ui/AbsBaseView.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AbsBaseView = void 0;

class AbsBaseView {}

exports.AbsBaseView = AbsBaseView;
},{}],"script/ui/BaseView.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.topUi = void 0;

var _INITConfig = _interopRequireDefault(require("../../INITConfig"));

var _AbsBaseView = require("./AbsBaseView");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var topUi;
exports.topUi = topUi;

(function (topUi) {
  class BaseView extends _AbsBaseView.AbsBaseView {
    constructor(resName, packageName) {
      super();
      this.mResName = resName;
      this.mPackageName = packageName;
      this.loadRes();
    }

    init() {
      //初始化Data
      this.initData(); //注册事件监听

      this.registerEvent(); //初始化UI控件引用

      this.initView();
    }

    initData() {
      throw new Error("Method not implemented.");
    }

    initView() {
      throw new Error("Method not implemented.");
    }

    registerEvent() {
      throw new Error("Method not implemented.");
    }

    unRegisterEvent() {
      throw new Error("Method not implemented.");
    }

    destroy() {
      this.unRegisterEvent();
      fgui.GRoot.inst.removeChild(this.mParentView);
    } //加载资源


    loadRes() {
      if (!this.mResName) {
        throw new Error("BaseView need respath to init");
      }

      let resPath = _INITConfig.default.resPrefixPath + this.mResName;
      fgui.UIPackage.loadPackage(resPath, Laya.Handler.create(this, this.onLoadedComplete));
    }

    onLoadedComplete() {
      if (!this.mPackageName) {
        throw new Error("BaseView need packageName to create ui");
      }

      this.mParentView = fgui.UIPackage.createObject(this.mResName, this.mPackageName).asCom;
      fgui.GRoot.inst.addChild(this.mParentView);
      this.init();
    } //卸载资源


    removeRes() {}

    getParent() {
      return this.mParentView;
    }

    getChild(childName) {
      if (this.mParentView) {
        return this.mParentView.getChild(childName);
      }

      return null;
    }

  }

  topUi.BaseView = BaseView;
})(topUi || (exports.topUi = topUi = {}));
},{"../../INITConfig":"INITConfig.ts","./AbsBaseView":"script/ui/AbsBaseView.ts"}],"script/view/LoginView.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.view = void 0;

var _BaseView = require("../ui/BaseView");

var view;
exports.view = view;

(function (view) {
  class LoginView extends _BaseView.topUi.BaseView {
    initData() {}

    initView() {
      let bg = this.getChild("bg").asImage;
      bg.scaleX = 0.1;
      console.log("initView.......");
    }

    registerEvent() {
      console.log("loginView registerEvent"); // Game.NotificationCenter.getInstance().registerEvt(new Game.EventSelf("loginInit",this,this.onLoginInit))
    }

    onLoginInit(arg0, arg1) {
      console.log("reveice loginInit method  arg0=" + arg0 + "arg1=" + arg1);
    }

    unRegisterEvent() {}

    destroy() {
      super.destroy();
    }

  }

  LoginView.resName = "Login";
  LoginView.packageName = "LoginView";
  view.LoginView = LoginView;
})(view || (exports.view = view = {}));
},{"../ui/BaseView":"script/ui/BaseView.ts"}],"script/util/Log.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Log = void 0;

var _InitConfig = _interopRequireDefault(require("../../InitConfig"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Log {
  static warn(params) {
    if (_InitConfig.default.isDebug) {
      console.warn(params);
    }
  }

  static info(params) {
    if (_InitConfig.default.isDebug) {
      console.info(params);
    }
  }

  static table(params) {
    if (_InitConfig.default.isDebug) {
      console.table(params);
    }
  }

}

exports.Log = Log;
},{"../../InitConfig":"INITConfig.ts"}],"script/net/NetWork.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.net = void 0;

var _Log = require("../util/Log");

var net;
exports.net = net;

(function (net) {
  var Browser = Laya.Browser;
  var Socket = Laya.Socket;
  var Byte = Laya.Byte;
  var Event = Laya.Event;

  class NetWork {
    constructor() {
      this.mMessage = null;
      this.mRoot = null;
      let protoBuf = Browser.window.protobuf;
      protoBuf.load("res/protobuf/awesome.proto", (err, root) => {
        this.onAssetsLoaded(err, root);
      });
      console.log("NetWork  constructor()");
    }

    static getInstance() {
      if (!NetWork.instance) {
        NetWork.instance = new NetWork();
      }

      return NetWork.instance;
    }

    onAssetsLoaded(err, root) {
      console.log("NetWork onAssetsLoaded" + err);
      if (err) throw err;
      console.log("this=" + this);
      console.log("root=", root);
      this.mRoot = root; // Obtain a message type

      this.mMessage = root.lookup("awesomepackage.AwesomeMessage");
      console.log("this.mMessage--->>" + this.mMessage); // Create a new message

      var message = this.mMessage.create({
        awesomeField: "AwesomeString"
      }); // Verify the message if necessary (i.e. when possibly incomplete or invalid)

      var errMsg = this.mMessage.verify(message);
      if (errMsg) throw Error(errMsg); // Encode a message to an Uint8Array (browser) or Buffer (node)

      var buffer = this.mMessage.encode(message).finish(); // ... do something with buffer
      // Or, encode a plain object

      var buffer = this.mMessage.encode({
        awesomeField: "AwesomeString"
      }).finish(); // ... do something with buffer
      // Decode an Uint8Array (browser) or Buffer (node) to a message

      var message = this.mMessage.decode(buffer);
      console.log("message = " + message + "" + JSON.stringify(message)); // ... do something with message
      // this.connectByUrl("ws://192.168.3.3:8080");
      // this.connectByUrl("ws://192.168.3.27:8080");
      // this.connectByUrl("ws://192.168.3.27:8080");

      this.connectByUrl("ws://127.0.0.1:8080");
    }

    connectByUrl(url) {
      _Log.Log.info("connectByUrl");

      this.socket = new Socket(); //this.socket.connect("echo.websocket.org", 80);
      // this.socket.connectByUrl("ws://echo.websocket.org:80");

      this.socket.connectByUrl(url);
      this.output = this.socket.output;
      this.socket.on(Event.OPEN, this, this.onSocketOpen);
      this.socket.on(Event.CLOSE, this, this.onSocketClose);
      this.socket.on(Event.MESSAGE, this, this.onMessageReveived);
      this.socket.on(Event.ERROR, this, this.onConnectError);
    }

    onSocketOpen() {
      console.log("Connected");
      this.output; //test

      let msgHead = 10001;
      this.output.writeUint16(msgHead);
      this.mMessage = this.mRoot.lookup("awesomepackage.C2R_Login");
      console.log("this.mMessage--->>" + this.mMessage); // Create a new message

      let message = this.mMessage.create({
        rpcId: 1,
        account: "test",
        password: "111111"
      }); // Verify the message if necessary (i.e. when possibly incomplete or invalid)

      var errMsg = this.mMessage.verify(message);
      if (errMsg) throw Error(errMsg); // Encode a message to an Uint8Array (browser) or Buffer (node)

      var buffer = this.mMessage.encode(message).finish(); // this.output.writeArrayBuffer(buffer,2)
      // Log.info("msg length="+msgHead.length);
      // this.output.writeUTFString(msgHead);
      // 发送字符串
      // this.socket.send("demonstrate <sendString>");
      // // 使用output.writeByte发送
      // var message: string = "demonstrate <output.writeByte>";
      // for (var i: number = 0; i < message.length; ++i) {
      // 	this.output.writeByte(message.charCodeAt(i));
      // }

      this.socket.flush();
      console.log("消息发送完成");
    }

    onSocketClose() {
      console.log("Socket closed");
    }

    onMessageReveived(message) {
      console.log("Message from server:");

      if (typeof message == "string") {
        console.log(message);
      } else if (message instanceof ArrayBuffer) {
        console.log(new Byte(message).readUTFBytes());
      }

      this.socket.input.clear();
    }

    onConnectError(e) {
      console.log("error=" + JSON.stringify(e));
    }

  }

  net.NetWork = NetWork;
})(net || (exports.net = net = {}));
},{"../util/Log":"script/util/Log.ts"}],"Main.ts":[function(require,module,exports) {
"use strict";

var _GameConfig = _interopRequireDefault(require("./GameConfig"));

var _Uimanager = require("./script/manager/Uimanager");

var _LoginView = require("./script/view/LoginView");

var _NetWork = require("./script/net/NetWork");

var _Log = require("./script/util/Log");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Main {
  constructor() {
    //根据IDE设置初始化引擎		
    if (window["Laya3D"]) Laya3D.init(_GameConfig.default.width, _GameConfig.default.height);else Laya.init(_GameConfig.default.width, _GameConfig.default.height, Laya["WebGL"]);
    Laya["Physics"] && Laya["Physics"].enable();
    Laya["DebugPanel"] && Laya["DebugPanel"].enable();
    Laya.stage.scaleMode = _GameConfig.default.scaleMode;
    Laya.stage.screenMode = _GameConfig.default.screenMode;
    Laya.stage.alignV = _GameConfig.default.alignV;
    Laya.stage.alignH = _GameConfig.default.alignH; //兼容微信不支持加载scene后缀场景

    Laya.URL.exportSceneToJson = _GameConfig.default.exportSceneToJson; //打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）

    if (_GameConfig.default.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
    if (_GameConfig.default.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
    if (_GameConfig.default.stat) Laya.Stat.show();
    Laya.alertGlobalError(true); //激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程

    Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
  }

  onVersionLoaded() {
    //激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
    Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
  }

  onConfigLoaded() {
    Laya.stage.addChild(fgui.GRoot.inst.displayObject); //加载IDE指定的场景
    // GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
    // new view.LoginView("Login","LoginView");

    _Uimanager.UiManager.getInstance().openPanel(_LoginView.view.LoginView);

    Laya.timer.once(2000, this, () => {
      console.log("1111111111"); // UiManager.getInstance().closePanel(view.LoginView);
      // Game.NotificationCenter.getInstance().notification("loginInit","111","222");
    });
    console.log("test protocolBuffer");

    _NetWork.net.NetWork.getInstance();

    _Log.Log.info("Laya.Browser.clientWidth=" + Laya.Browser.clientWidth + "Laya.Browser.clientHeight=" + Laya.Browser.clientHeight);
  }

} //激活启动类


new Main();
},{"./GameConfig":"GameConfig.ts","./script/manager/Uimanager":"script/manager/Uimanager.ts","./script/view/LoginView":"script/view/LoginView.ts","./script/net/NetWork":"script/net/NetWork.ts","./script/util/Log":"script/util/Log.ts"}]},{},["Main.ts"], null)
//# sourceMappingURL=/Main.js.map