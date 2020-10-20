import {EventSelf} from "./Event"
export namespace Game{
    
    export class NotificationCenter{

        private static instance:NotificationCenter;
        private mEvtList:Array<any>;
        private constructor(){
            this.mEvtList = [];
        }
        public static getInstance():NotificationCenter{
            if(!this.instance){
                this.instance = new NotificationCenter();
            }
            return this.instance;
        }
        public registerEvt(evt:EventSelf){
            if(this.mEvtList[evt.mEvtName]){
                let evtArr:Array<EventSelf> = this.mEvtList[evt.mEvtName];
                evtArr.forEach(element => {
                    if(element.mTarget == evt.mTarget){

                        return;
                    }
                });
                this.mEvtList[evt.mEvtName].push(evt);
            }else{
                this.mEvtList[evt.mEvtName] = [];
                this.mEvtList[evt.mEvtName].push(evt);
            }
        }
        public unRegisterEvt(evtName:string){
            if(this.mEvtList[evtName] && this.mEvtList[evtName].length > 0){
                this.mEvtList[evtName] = [];
            }
        }
        public unRegisterEvtByTarget(target:any){
            for (const key in this.mEvtList) {
                if (Object.prototype.hasOwnProperty.call(this.mEvtList, key)) {
                    let evtArr:Array<EventSelf> = this.mEvtList[key];
                    for (let index = 0; index < evtArr.length; index++) {
                        if(evtArr[index].mTarget == target){
                            this.mEvtList[key][index].splice(index);
                            break;
                        }  
                    }
                    
                }
            }
        }
        public notification(evtName:string,...args:any){
            if(this.mEvtList[evtName] && this.mEvtList[evtName].length > 0){
                this.mEvtList[evtName].forEach(element => {
                    if(element.mEvtName == evtName){
                        element.mCallBack.call(element.mTarget,args);
                    }
                });
            }
        }
    }
}