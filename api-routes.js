const router = require('express').Router();
const Chatkit = require('@pusher/chatkit-server');
  
const chatKitAdminUserId = "ADMIN_USER_ID";
const chatKitInstanceLocator = "INSTANCE_LOCATOR";
const chatKitApiKey = "API_KEY";
const chatkit = new Chatkit.default({
    instanceLocator: chatKitInstanceLocator,
    key: chatKitApiKey,
});

router.get('/', function (req, res) {
    res.json({
       status: 'API Its Working',
       message: 'Welcome to RESTHub crafted with love!',
    });
});

router.post('/create_user', function (req, res) {
    console.log(req.body);
    chatkit.createUser({
        id: req.body.userid,
        name: req.body.username,
      })
        .then((response) => {
            console.log(response)
            res.json({ status: 'success', message: 'User created successfully', });
        }).catch((err) => {
            console.error(err)
            res.json({ status: 'fail', message: err, });
        });
});

router.get('/get_user', function (req, res) {
    console.log(req.body);
    chatkit.getUser({
        id: req.body.userid,
      })
        .then((user) => {
            console.log(user)
            res.json({ status: 'success', user: user, });
        }).catch((err) => {
            console.error(err)
            res.json({ status: 'fail', message: err, });
        });
});

router.post('/create_room', function (req, res) {
    console.log(req.body);
    chatkit.createRoom({
        creatorId: chatKitAdminUserId,
        name: req.body.roomname,
      })
        .then((response) => {
            console.log(response)
            res.json({ status: 'success', response: response, });
            //TODO add users to chatroom.
        }).catch((err) => {
            console.error(err)
            res.json({ status: 'fail', message: err, });
        });
});

router.post('/add_users_to_room', function (req, res) {
    console.log(req.body);
    chatkit.addUsersToRoom({
        roomId: req.body.roomid,
        userIds: req.body.userIds,
      })
        .then(() => {
            console.log("added") //this api does not give response.
            res.json({ status: 'success', response: "added", });
        }).catch((err) => {
            console.error(err)
            res.json({ status: 'fail', message: err, });
        });
});

router.get('/get_room', function (req, res) {
    console.log(req.body);
    chatkit.getRoom({
        roomId: req.body.roomid,
      })
        .then((room) => {
            console.log(room)
            res.json({ status: 'success', room: room, });
        }).catch((err) => {
            console.error(err)
            res.json({ status: 'fail', message: err, });
        });
});

router.get('/get_user_rooms', function (req, res) {
    console.log(req.body);
    chatkit.getUserRooms({
        userId: req.body.userid,
      })
        .then((response) => {
            console.log(response)
            res.json({ status: 'success', message: response, });
        }).catch((err) => {
            console.error(err)
            res.json({ status: 'fail', message: err, });
        });
});

router.post('/send_message', function (req, res) {
    console.log(req.body);
    chatkit.sendSimpleMessage({
        userId: req.body.userid,
        roomId: req.body.roomid,
        text: req.body.text,
      })
        .then((response) => {
            console.log(response)
            res.json({ status: 'success', message: response, });
        }).catch((err) => {
            console.error(err)
            res.json({ status: 'fail', message: err, });
        });
});

router.get('/fetch_messages_from_room', function (req, res) {
    console.log(req.body);
    var msgArrays = [];
    chatkit.fetchMultipartMessages({
        roomId: req.body.roomid,
        limit: 10,
      })
        .then(messages => {
          console.log('got last 10 messages')
          console.log(messages)
        //   res.json({ status: 'success', messages: messages, });
          for (let m of messages) {
            // renderMessage(m)
            msgArrays.push(m)
          }
        console.log("messages.length= " + messages.length);
        const initialId = messages[messages.length - 1].id;
        console.log('initialId: ' + initialId)
          return chatkit.fetchMultipartMessages({
            roomId: req.body.roomid,
            initialId: initialId,
          })
        })
        .then(moreMessages => {
          console.log('got the next 10 messages before them')
          console.log(moreMessages)
          if (moreMessages.length > 0) {
            for (let m of moreMessages) {
                // renderMessage(m)
                msgArrays.push(m)
              }            
          }
          res.json({ status: 'success', message: msgArrays, });         
        })
        .catch(err => console.error(err))
});

module.exports = router;