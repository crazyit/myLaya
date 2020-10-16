
import InitConfig from "../../INITConfig";
import { AbsBaseView } from "./AbsBaseView";

export module topUi {

    export class BaseView  extends AbsBaseView{

        private mParentView: fgui.GComponent;
        private mResName:string;
        private mPackageName:string;
        constructor(resName:string,packageName:string) {
            super();
            this.mResName = resName;
            this.mPackageName = packageName;
            this.loadRes();
        }
        init(){
            //初始化Data
            this.initData();
            //注册事件监听
            this.registerEvent();
            //初始化UI控件引用
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
        //加载资源
        loadRes(){
            if(!this.mResName){
                throw new Error("BaseView need respath to init")
            }
            
            let resPath = InitConfig.resPrefixPath+this.mResName;
            fgui.UIPackage.loadPackage(resPath, Laya.Handler.create(this, this.onLoadedComplete));
        }
        onLoadedComplete(){
            if(!this.mPackageName){
                throw new Error("BaseView need packageName to create ui")
            }
            this.mParentView = fgui.UIPackage.createObject(this.mResName, this.mPackageName).asCom;
            fgui.GRoot.inst.addChild(this.mParentView);
            this.init();
        }
        //卸载资源
        removeRes(){

        }
        getParent(){
            return this.mParentView
        }
        getChild(childName:string){
            if(this.mParentView){
                return this.mParentView.getChild(childName)
            }
            return null;
        }
        //显示loading

        //关掉loading

    }
}