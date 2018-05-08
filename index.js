'use strict'

const AWS = require("aws-sdk");
const doc = require('dynamodb-doc');
const dynamo = new doc.DynamoDB();
const sns = new AWS.SNS();
AWS.config.update({region: "us-west-2"});

exports.handler = (event, context, callback) => {
    
    let userFilter = {};
    var exp = event.users.map((user, index) => {
        userFilter[':user'+index] = user;
    });

    var params = {
        TableName : 'users',        
        FilterExpression : 'username IN (' + Object.keys(userFilter).toString() + ')',
        ExpressionAttributeValues : userFilter
    };

    dynamo.scan(params, function (err, data) {
        if(err){
            console.log(err);
        }
        else{
            data.Items.forEach(user => {
                var sms = {
                    Message: 'YO',
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
}