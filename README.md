# HOPR mini chat

A minimal React chat app on top of the [HOPR protocol](https://github.com/hoprnet/hoprnet).

## HOPR node
HOPR mini chat needs access to the http and ws API of a HOPR node. The http and ws endpoints are passed to the app along with the security token via URL parameters. The following example assumes that your are running a [local HOPR cluster](https://docs.hoprnet.org/developers/starting-local-cluster), if you are running HOPR differently please adjust the three parameters accordingly.

Start the react app it via `npm start` and open the following link in your browser:

```
http://localhost:3000/?httpEndpoint=http://localhost:13304&wsEndpoint=ws://localhost:19504&securityToken=^^LOCAL-testing-123^^
```

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Standalone HTML app
Instead of the React app, you can load the minimal Hello World chat app in the [Hello.html file](https://github.com/SCBuergel/hopr-mini-chat/blob/main/public/Hello.html). E.g. you can save the file and open it in your web browser on the machine on which you have your HOPR cluster running.

The standalone app requires the same URL parameters, so you could load the file in your browser e.g. via
```
file:///home/seb/HoprMiniChat/index.html/?httpEndpoint=http://localhost:13304&wsEndpoint=ws://localhost:19504&securityToken=^^LOCAL-testing-123^^
```
