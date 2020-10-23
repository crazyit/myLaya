
import { topUi } from "../ui/BaseView";
export module view{

    export class LoginView extends topUi.BaseView{
        public static resName:string = "Login";
        public static packageName:string = "LoginView"
        initData() {
            
        }
        initView() {
            let bg:fgui.GImage = this.getChild("bg").asImage;
            bg.scaleX = 0.1;
            console.log("initView.......");
        }
        registerEvent() {
            console.log("loginView registerEvent");
            // Game.NotificationCenter.getInstance().registerEvt(new Game.EventSelf("loginInit",this,this.onLoginInit))
        }
        onLoginInit(arg0:any,arg1:any){
            console.log("reveice loginInit method  arg0="+arg0+"arg1="+arg1);
        }
        unRegisterEvent() {
            
        }
        destroy() {
            super.destroy();
        }
    }
}