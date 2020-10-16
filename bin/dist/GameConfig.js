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
},{"./script/GameUI":"script/GameUI.ts","./script/GameControl":"script/GameControl.ts","./script/Bullet":"script/Bullet.ts","./script/DropBox":"script/DropBox.ts"}]},{},["GameConfig.ts"], null)
//# sourceMappingURL=/GameConfig.js.map