// export namespace Game
// {
    export class EventSelf{
        public mEvtName:string;
        public mTarget:any;
        public mCallBack:Function;
        
        constructor(evtName:string,target:any,callBack:any){
            this.mEvtName = evtName;
            this.mTarget = target;
            this.mCallBack = callBack;
        }
    }
// }