(function () {
    'use strict';

    var Scene = Laya.Scene;
    var REG = Laya.ClassUtils.regClass;
    var ui;
    (function (ui) {
        var test;
        (function (test) {
            class TestSceneUI extends Scene {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("test/TestScene");
                }
            }
            test.TestSceneUI = TestSceneUI;
            REG("ui.test.TestSceneUI", TestSceneUI);
        })(test = ui.test || (ui.test = {}));
    })(ui || (ui = {}));

    class GameControl extends Laya.Script {
        constructor() {
            super();
            this.createBoxInterval = 1000;
            this._time = 0;
            this._started = false;
        }
        onEnable() {
            this._time = Date.now();
            this._gameBox = this.owner.getChildByName("gameBox");
        }
        onUpdate() {
            let now = Date.now();
            if (now - this._time > this.createBoxInterval && this._started) {
                this._time = now;
                this.createBox();
            }
        }
        createBox() {
            let box = Laya.Pool.getItemByCreateFun("dropBox", this.dropBox.create, this.dropBox);
            box.pos(Math.random() * (Laya.stage.width - 100), -100);
            this._gameBox.addChild(box);
        }
        onStageClick(e) {
            e.stopPropagation();
            let flyer = Laya.Pool.getItemByCreateFun("bullet", this.bullet.create, this.bullet);
            flyer.pos(Laya.stage.mouseX, Laya.stage.mouseY);
            this._gameBox.addChild(flyer);
        }
        startGame() {
            if (!this._started) {
                this._started = true;
                this.enabled = true;
            }
        }
        stopGame() {
            this._started = false;
            this.enabled = false;
            this.createBoxInterval = 1000;
            this._gameBox.removeChildren();
        }
    }

    class GameUI extends ui.test.TestSceneUI {
        constructor() {
            super();
            GameUI.instance = this;
            Laya.MouseManager.multiTouchEnabled = false;
        }
        onEnable() {
            this._control = this.getComponent(GameControl);
            this.tipLbll.on(Laya.Event.CLICK, this, this.onTipClick);
        }
        onTipClick(e) {
            this.tipLbll.visible = false;
            this._score = 0;
            this.scoreLbl.text = "";
            this._control.startGame();
        }
        addScore(value = 1) {
            this._score += value;
            this.scoreLbl.changeText("分数：" + this._score);
            if (this._control.createBoxInterval > 600 && this._score % 20 == 0)
                this._control.createBoxInterval -= 20;
        }
        stopGame() {
            this.tipLbll.visible = true;
            this.tipLbll.text = "游戏结束了，点击屏幕重新开始";
            this._control.stopGame();
        }
    }

    class Bullet extends Laya.Script {
        constructor() { super(); }
        onEnable() {
            var rig = this.owner.getComponent(Laya.RigidBody);
            rig.setVelocity({ x: 0, y: -10 });
        }
        onTriggerEnter(other, self, contact) {
            this.owner.removeSelf();
        }
        onUpdate() {
            if (this.owner.y < -10) {
                this.owner.removeSelf();
            }
        }
        onDisable() {
            Laya.Pool.recover("bullet", this.owner);
        }
    }

    class DropBox extends Laya.Script {
        constructor() {
            super();
            this.level = 1;
        }
        onEnable() {
            this._rig = this.owner.getComponent(Laya.RigidBody);
            this.level = Math.round(Math.random() * 5) + 1;
            this._text = this.owner.getChildByName("levelTxt");
            this._text.text = this.level + "";
        }
        onUpdate() {
            this.owner.rotation++;
        }
        onTriggerEnter(other, self, contact) {
            var owner = this.owner;
            if (other.label === "buttle") {
                if (this.level > 1) {
                    this.level--;
                    this._text.changeText(this.level + "");
                    owner.getComponent(Laya.RigidBody).setVelocity({ x: 0, y: -10 });
                    Laya.SoundManager.playSound("sound/hit.wav");
                }
                else {
                    if (owner.parent) {
                        let effect = Laya.Pool.getItemByCreateFun("effect", this.createEffect, this);
                        effect.pos(owner.x, owner.y);
                        owner.parent.addChild(effect);
                        effect.play(0, true);
                        owner.removeSelf();
                        Laya.SoundManager.playSound("sound/destroy.wav");
                    }
                }
                GameUI.instance.addScore(1);
            }
            else if (other.label === "ground") {
                owner.removeSelf();
                GameUI.instance.stopGame();
            }
        }
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
            Laya.Pool.recover("dropBox", this.owner);
        }
    }

    class GameConfig {
        constructor() {
        }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("script/GameUI.ts", GameUI);
            reg("script/GameControl.ts", GameControl);
            reg("script/Bullet.ts", Bullet);
            reg("script/DropBox.ts", DropBox);
        }
    }
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

    class InitConfig {
    }
    InitConfig.resPrefixPath = "res/ui/";
    InitConfig.isDebug = true;
    InitConfig.serverUrl = "ws://echo.websocket.org:80";

    class AbsBaseView {
    }

    var topUi;
    (function (topUi) {
        class BaseView extends AbsBaseView {
            constructor(resName, packageName) {
                super();
                this.mResName = resName;
                this.mPackageName = packageName;
                this.loadRes();
            }
            init() {
                this.initData();
                this.registerEvent();
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
            }
            loadRes() {
                if (!this.mResName) {
                    throw new Error("BaseView need respath to init");
                }
                let resPath = InitConfig.resPrefixPath + this.mResName;
                fgui.UIPackage.loadPackage(resPath, Laya.Handler.create(this, this.onLoadedComplete));
            }
            onLoadedComplete() {
                if (!this.mPackageName) {
                    throw new Error("BaseView need packageName to create ui");
                }
                this.mParentView = fgui.UIPackage.createObject(this.mResName, this.mPackageName).asCom;
                fgui.GRoot.inst.addChild(this.mParentView);
                this.init();
            }
            removeRes() {
            }
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
    })(topUi || (topUi = {}));

    var Game;
    (function (Game) {
        class NotificationCenter {
            constructor() {
                this.mEvtList = [];
            }
            static getInstance() {
                if (!this.instance) {
                    this.instance = new NotificationCenter();
                }
                return this.instance;
            }
            registerEvt(evt) {
                if (this.mEvtList[evt.mEvtName]) {
                    let evtArr = this.mEvtList[evt.mEvtName];
                    evtArr.forEach(element => {
                        if (element.mTarget == evt.mTarget) {
                            return;
                        }
                    });
                    this.mEvtList[evt.mEvtName].push(evt);
                }
                else {
                    this.mEvtList[evt.mEvtName] = [];
                    this.mEvtList[evt.mEvtName].push(evt);
                }
            }
            unRegisterEvt(evtName) {
                if (this.mEvtList[evtName] && this.mEvtList[evtName].length > 0) {
                    this.mEvtList[evtName] = [];
                }
            }
            unRegisterEvtByTarget(target) {
                for (const key in this.mEvtList) {
                    if (Object.prototype.hasOwnProperty.call(this.mEvtList, key)) {
                        let evtArr = this.mEvtList[key];
                        for (let index = 0; index < evtArr.length; index++) {
                            if (evtArr[index].mTarget == target) {
                                this.mEvtList[key][index].splice(index);
                                break;
                            }
                        }
                    }
                }
            }
            notification(evtName, ...args) {
                if (this.mEvtList[evtName] && this.mEvtList[evtName].length > 0) {
                    this.mEvtList[evtName].forEach(element => {
                        if (element.mEvtName == evtName) {
                            element.mCallBack.call(element.mTarget, args);
                        }
                    });
                }
            }
        }
        Game.NotificationCenter = NotificationCenter;
    })(Game || (Game = {}));

    class EventSelf {
        constructor(evtName, target, callBack) {
            this.mEvtName = evtName;
            this.mTarget = target;
            this.mCallBack = callBack;
        }
    }

    var view;
    (function (view) {
        class LoginView extends topUi.BaseView {
            initData() {
            }
            initView() {
                let bg = this.getChild("bg").asImage;
                bg.scaleX = 0.1;
                console.log("initView.......");
            }
            registerEvent() {
                console.log("loginView registerEvent");
                Game.NotificationCenter.getInstance().registerEvt(new EventSelf("loginInit", this, this.onLoginInit));
            }
            onLoginInit(arg0, arg1) {
                console.log("reveice loginInit method  arg0=" + arg0 + "arg1=" + arg1);
            }
            unRegisterEvent() {
            }
            destroy() {
                super.destroy();
            }
        }
        LoginView.resName = "Login";
        LoginView.packageName = "LoginView";
        view.LoginView = LoginView;
    })(view || (view = {}));

    var net;
    (function (net) {
        var Browser = Laya.Browser;
        var Socket = Laya.Socket;
        var Byte = Laya.Byte;
        var Event = Laya.Event;
        class NetWork {
            constructor() {
                this.mMessage = null;
                let protoBuf = Browser.window.protobuf;
                protoBuf.load("res/protobuf/awesome.proto", (err, root) => { this.onAssetsLoaded(err, root); });
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
                if (err)
                    throw err;
                console.log("this=" + this);
                console.log("root=", root);
                this.mMessage = root.lookup("awesomepackage.AwesomeMessage");
                console.log("this.mMessage--->>" + this.mMessage);
                var message = this.mMessage.create({
                    awesomeField: "AwesomeString"
                });
                var errMsg = this.mMessage.verify(message);
                if (errMsg)
                    throw Error(errMsg);
                var buffer = this.mMessage.encode(message).finish();
                var buffer = this.mMessage.encode({
                    awesomeField: "AwesomeString"
                }).finish();
                var message = this.mMessage.decode(buffer);
                console.log("message = " + message + "" + JSON.stringify(message));
            }
            connectByUrl(url) {
                this.socket = new Socket();
                this.socket.connectByUrl("ws://echo.websocket.org:80");
                this.output = this.socket.output;
                this.socket.on(Event.OPEN, this, this.onSocketOpen);
                this.socket.on(Event.CLOSE, this, this.onSocketClose);
                this.socket.on(Event.MESSAGE, this, this.onMessageReveived);
                this.socket.on(Event.ERROR, this, this.onConnectError);
            }
            onSocketOpen() {
                console.log("Connected");
                this.socket.send("demonstrate <sendString>");
                var message = "demonstrate <output.writeByte>";
                for (var i = 0; i < message.length; ++i) {
                    this.output.writeByte(message.charCodeAt(i));
                }
                this.socket.flush();
            }
            onSocketClose() {
                console.log("Socket closed");
            }
            onMessageReveived(message) {
                console.log("Message from server:");
                if (typeof message == "string") {
                    console.log(message);
                }
                else if (message instanceof ArrayBuffer) {
                    console.log(new Byte(message).readUTFBytes());
                }
                this.socket.input.clear();
            }
            onConnectError(e) {
                console.log("error");
            }
        }
        net.NetWork = NetWork;
    })(net || (net = {}));

    class Main {
        constructor() {
            if (window["Laya3D"])
                Laya3D.init(GameConfig.width, GameConfig.height);
            else
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = GameConfig.alignV;
            Laya.stage.alignH = GameConfig.alignH;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
                Laya.enableDebugPanel();
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat)
                Laya.Stat.show();
            Laya.alertGlobalError(true);
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            Laya.stage.addChild(fgui.GRoot.inst.displayObject);
            UiManager.getInstance().openPanel(view.LoginView);
            Laya.timer.once(2000, this, () => {
                console.log("1111111111");
                UiManager.getInstance().closePanel(view.LoginView);
                Game.NotificationCenter.getInstance().notification("loginInit", "111", "222");
            });
            console.log("test protocolBuffer");
            net.NetWork.getInstance();
            let foo = () => {
            };
        }
    }
    new Main();

}());
//# sourceMappingURL=bundle.js.map
