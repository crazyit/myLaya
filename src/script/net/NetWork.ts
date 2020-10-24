import { Log } from "../util/Log";

export module net
{
	import Loader = Laya.Loader;
	import Browser = Laya.Browser;
	import Handler = Laya.Handler;
	import Socket = Laya.Socket;
	import Byte = Laya.Byte;
	import Event = Laya.Event;
	
	export class NetWork 
	{
		
		private static instance:NetWork;
		private mMessage:any = null;
		private mRoot:any = null;
		private socket: Socket;
		private output: Byte;

		private constructor()
		{
			let protoBuf:any = Browser.window.protobuf;
			protoBuf.load("res/protobuf/awesome.proto", (err:any, root:any)=>{this.onAssetsLoaded(err,root)});
			console.log("NetWork  constructor()");
		}
		public static getInstance():NetWork{
			if(!NetWork.instance){
				NetWork.instance = new NetWork();
			}
			return NetWork.instance;
		}
		
		private onAssetsLoaded(err:any, root:any):void
		{
			console.log("NetWork onAssetsLoaded"+err);
			if (err)
				throw err;
			console.log("this="+this);
			console.log("root=",root);
			this.mRoot = root;
			// Obtain a message type
			this.mMessage = root.lookup("awesomepackage.AwesomeMessage");
			console.log("this.mMessage--->>"+ this.mMessage);
			// Create a new message
			var message:any = this.mMessage.create(
			{
				awesomeField: "AwesomeString"
			});

			// Verify the message if necessary (i.e. when possibly incomplete or invalid)
			var errMsg:any = this.mMessage.verify(message);
			if (errMsg)
				throw Error(errMsg);

			// Encode a message to an Uint8Array (browser) or Buffer (node)
			var buffer:any = this.mMessage.encode(message).finish();
			// ... do something with buffer


			// Or, encode a plain object
			var buffer:any = this.mMessage.encode(
			{
				awesomeField: "AwesomeString"
			}).finish();
			// ... do something with buffer

			// Decode an Uint8Array (browser) or Buffer (node) to a message
			var message:any = this.mMessage.decode(buffer);
			console.log("message = "+message+""+JSON.stringify(message));
			// ... do something with message
			// this.connectByUrl("ws://192.168.3.3:8080");
			// this.connectByUrl("ws://192.168.3.27:8080");
			// this.connectByUrl("ws://192.168.3.27:8080");
			this.connectByUrl("ws://127.0.0.1:8080");

		}

		private connectByUrl(url:string): void {
			Log.info("connectByUrl");
			this.socket = new Socket();
			//this.socket.connect("echo.websocket.org", 80);
			// this.socket.connectByUrl("ws://echo.websocket.org:80");
			this.socket.connectByUrl(url);

			this.output = this.socket.output;

			this.socket.on(Event.OPEN, this, this.onSocketOpen);
			this.socket.on(Event.CLOSE, this, this.onSocketClose);
			this.socket.on(Event.MESSAGE, this, this.onMessageReveived);
			this.socket.on(Event.ERROR, this, this.onConnectError);
		}

		private onSocketOpen(): void {
			console.log("Connected");
			this.socket.endian = Laya.Byte.LITTLE_ENDIAN;
			//test
			let msgHead = 10001;
			this.output.writeUint16(msgHead);

			this.mMessage = this.mRoot.lookup("awesomepackage.C2R_Login");
			console.log("this.mMessage--->>"+ this.mMessage);
			// Create a new message
			let message:any = this.mMessage.create(
				{rpcId:11, Account:"test", Password:"111111" });

			// Verify the message if necessary (i.e. when possibly incomplete or invalid)
			var errMsg:any = this.mMessage.verify(message);
			if (errMsg)
				throw Error(errMsg);

			// Encode a message to an Uint8Array (browser) or Buffer (node)
			var buffer:any = this.mMessage.encode(message).finish();
			this.output.writeArrayBuffer(buffer);

			let decodeMsg:any = this.mMessage.decode(buffer);
			console.log("decodeMsg = "+message+" = "+JSON.stringify(message));

			// // 使用output.writeByte发送
			// var message: string = "demonstrate <output.writeByte>";
			// for (var i: number = 0; i < message.length; ++i) {
			// 	this.output.writeByte(message.charCodeAt(i));
			// }
			this.socket.flush();
			console.log("消息发送完成");
		}

		private onSocketClose(): void {
			console.log("Socket closed");
		}

		private onMessageReveived(message: any): void {
			console.log("Message from server:");
			if (typeof message == "string") {
				console.log(message);
			}
			else if (message instanceof ArrayBuffer) {
				console.log(new Byte(message).readUTFBytes());
				var bytes = new Laya.Byte(message);
                while (bytes.length > bytes.pos) {
                    let opCode = bytes.getUint16();
                    let pbContent = bytes.getUint8Array(bytes.pos, bytes.length);
                    let l = this.mRoot.lookupType("awesomepackage.S2C_"+opCode);
					let msg = l.decode(pbContent);
					console.log("MessageReveived opCode="+opCode+"msg="+JSON.stringify(msg));
                }
			}
			this.socket.input.clear();
		}

		private onConnectError(e: Event): void {
			console.log("error="+JSON.stringify(e));
		}
	}
}
