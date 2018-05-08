package main

import (
	"context"
	"fmt"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
)

type NewUser struct {
	Id          string `json:"id"`
	Active      string `json:"active"`
	Username    string `json:"username"`
	Phonenumber string `json:"phonenumber"`
}

func Handler(ctx context.Context, user NewUser) (string, error) {

	sess, _ := session.NewSession(&aws.Config{
		Region: aws.String("us-west-2")},
	)
	svc := dynamodb.New(sess)
	av, _ := dynamodbattribute.MarshalMap(user)

	input := &dynamodb.PutItemInput{
		Item:      av,
		TableName: aws.String("users"),
	}
	svc.PutItem(input)

	return fmt.Sprintf("Welcome %s!", user.Username), nil

}

func main() {
	lambda.Start(Handler)
}
