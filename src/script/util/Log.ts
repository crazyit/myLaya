import InitConfig from "../../InitConfig";

class Log{
    
    static warn(params:any) {
        if(InitConfig.isDebug){
            console.warn(params);
        }
    }

    static info(params:any){
        if(InitConfig.isDebug){
            console.info(params);
        }
    }
    static table(params:any){
        if(InitConfig.isDebug){
            console.table(params);
        }
    }

}