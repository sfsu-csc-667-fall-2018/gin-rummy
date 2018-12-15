class ChatBox {
       
    constructor (namespace, io) {
           
        this.namespace = namespace
        this.io = io
        this.init()
    }

    init() {
          
   let chatBox = this.io.of(this.namespace)

   chatBox.on('connection', function(socket) {
       
	socket.on('chat message',function(msg) {
		console.log('chat message')
		let message = msg.user + ": " + msg.val
		console.log("msg: " + message)
		chatBox.emit('chat message', message);
	})
	chatBox.on('disconnect', function() {
		console.log('a user disconnected');
    });
    
});

    }

}

module.exports = ChatBox