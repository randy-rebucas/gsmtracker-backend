const mongoose = require('./../db/index');

const messageSchema = mongoose.Schema({
    sender : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    messages : [
        {
            message : String,
            meta : [
                {
                    user : {
                        type : mongoose.Schema.Types.ObjectId,
                        ref : 'User'
                    },
                    delivered : Boolean,
                    read : Boolean
                }
            ]
        }
    ],
    is_group_message : { type : Boolean, default : false },
    participants : [
        {
            user :  {
                type : mongoose.Schema.Types.ObjectId,
                ref : 'User'
            },
            delivered : Boolean,
            read : Boolean,
            last_seen : Date
        }
    ]
});
// var John = people.findOne({name: "John"});
// John.friends.push({firstName: "Harry", lastName: "Potter"});
// John.save();
// Message.find(({ users: { "$in" : [#user1#,#user2#]} })
// .sort({ updatedAt: -1 })
// .limit(20)
module.exports = mongoose.model('Messages', messageSchema);
