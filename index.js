'use strict'

const AWS = require("aws-sdk");
const doc = require('dynamodb-doc');
const dynamo = new doc.DynamoDB();
const uuidv4 = require('uuid/v4');
const sns = new AWS.SNS();
AWS.config.update({region: "us-west-2"});

exports.handler = (event, context, callback) => {
    
    let userFilter = {};
    event.users.map((user, index) => {
        userFilter[':user'+index] = user;
    });

    let findUsers = {
        TableName : 'users',        
        FilterExpression : 'username IN (' + Object.keys(userFilter).toString() + ')',
        ExpressionAttributeValues : userFilter
    };

    dynamo.scan(findUsers, function (err, data) {
        if(err){
            console.log('Error looking for users: ' + err);
        }
        else{
            data.Items.forEach(user => {
                let sms = {
                    Message: event.from + ': YO',
                    MessageStructure: 'string',
                    PhoneNumber: '+1' + user.phonenumber
                };
                sns.publish(sms, function(err, data) {
                    if (err) {
                        console.log(err, err.stack);
                    }
                    else{
                        callback(null, 'Message Sent!')                        
                    }
                });
            });
        }
    });

    let logMessage = {
        TableName:'messages',
        Item:{
            'id': uuidv4(),
            'sender': event.from,
            'recipients': event.users
        }
    };

    dynamo.putItem(logMessage, function(err, data) {
        if (err) {
            console.error('Error logging: ', JSON.stringify(err));
        } else {
            console.log('Added: ', JSON.stringify(data));
        }
    });
}