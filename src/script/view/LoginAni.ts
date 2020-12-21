import GameConfig from "../../GameConfig";


export default class LoginAni {

    private mFactory: Laya.Templet = null;
    private mArmature: Laya.Skeleton = null;
    private mSprite: Laya.Sprite = null;

    public constructor(sp: Laya.Sprite) {
        this.mSprite = sp;
        this.mFactory = new Laya.Templet();
        this.mFactory.on(Laya.Event.COMPLETE, this, this.parseComplete);
        this.mFactory.on(Laya.Event.ERROR, this, this.onError);
        this.mFactory.loadAni("res/ui/login_girl.sk");
    }

    private onError(): void {
        console.log("error");
    }

    private parseComplete(): void {
        this.mArmature = this.mFactory.buildArmature(0);
        this.mArmature.x = GameConfig.width / 2 + 320-300;
        this.mArmature.y = GameConfig.height / 2 + 50-200;
        this.mArmature.scaleX = 0.8;
        this.mArmature.scaleY = 0.8;
        this.mSprite.addChild(this.mArmature);
        this.mArmature.play(0, true);
    }

    public destory() {
        console.log('销毁登录动画');
        if (this.mArmature != null) {
            this.mArmature.stop();
            this.mArmature.destroy(true);//从显存销毁龙骨动画及其子对象
            this.mArmature.removeSelf();
            this.mArmature.removeChildren();
            this.mArmature = null;
        }
        if (this.mFactory != null) {
            this.mFactory.off(Laya.Event.COMPLETE, this, this.parseComplete);
            this.mFactory.off(Laya.Event.ERROR, this, this.onError);
            this.mFactory.destroy();//释放动画模板类下的纹理数据
            this.mFactory = null;
        }
    }
}