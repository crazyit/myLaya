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

		}

		private connectByUrl(url:string): void {
			this.socket = new Socket();
			//this.socket.connect("echo.websocket.org", 80);
			this.socket.connectByUrl("ws://echo.websocket.org:80");

			this.output = this.socket.output;

			this.socket.on(Event.OPEN, this, this.onSocketOpen);
			this.socket.on(Event.CLOSE, this, this.onSocketClose);
			this.socket.on(Event.MESSAGE, this, this.onMessageReveived);
			this.socket.on(Event.ERROR, this, this.onConnectError);
		}

		private onSocketOpen(): void {
			console.log("Connected");

			// 发送字符串
			this.socket.send("demonstrate <sendString>");

			// 使用output.writeByte发送
			var message: string = "demonstrate <output.writeByte>";
			for (var i: number = 0; i < message.length; ++i) {
				this.output.writeByte(message.charCodeAt(i));
			}
			this.socket.flush();
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
			}
			this.socket.input.clear();
		}

		private onConnectError(e: Event): void {
			console.log("error");
		}
	}
}
