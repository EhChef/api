module.exports = {
    listen: function(io){
        io.sockets.on('connection', function (socket) {
            console.log('User connected');

            socket.on('room', function (room) {
                socket.join(room.roomId);
                console.log(room)
                if (room.role === 0){
                    console.log('REMIND ME')
                    io.to(room.roomId).emit('remind');
                }
            });
            
            socket.on('order', function (order) {
                console.log(order);
                io.to(order.roomId).emit('order', order.order); 
            });

            socket.on('disconnect', function (){
                console.log('User Disconnected');
            });
        });
    }
}