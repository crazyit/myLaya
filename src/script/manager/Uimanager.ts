export class UiManager{
    private mPanelArr: Array<any>;
    private static instance:UiManager;

    private constructor(){
        this.mPanelArr = [];
    }
    public static getInstance():UiManager{
        if(!UiManager.instance){
            UiManager.instance = new UiManager();
        }
        return UiManager.instance;
    }
    openPanel(view:any){
        console.log("openPanel....resName="+view.resName+"packageName="+view.packageName);
        let openPanel = new view(view.resName,view.packageName);
        openPanel.packageName = view.packageName;
        this.mPanelArr.push(openPanel);
    }

    closePanel(view:any){
        let findIndex:number = -1;
        for (let index = 0; index < this.mPanelArr.length; index++) {
            const element = this.mPanelArr[index];
            console.log("for index----="+element.packageName)
            if(element.packageName == view.packageName){
                element.destroy();
                findIndex = index;
                console.log("find it");
                break;
            }  
        }
        if(findIndex >= 0){
            this.mPanelArr.splice(findIndex);
        }
    }

}