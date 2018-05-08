#go get -u github.com/aws/aws-lambda-go/cmd/build-lambda-zip
GOOS=linux go build -o main main.go
 ~/go/bin/build-lambda-zip.exe -o main.zip main
rm main