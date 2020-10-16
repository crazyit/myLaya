
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
            
        }
        unRegisterEvent() {
            
        }
        destroy() {
            super.destroy();
        }
    }
}