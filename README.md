# react-videoroom-janus
The way to effortlessly embed video calls in your react application, 
package based upon [video](https://www.youtube.com/watch?v=zxRwELmyWU0&t=1s) i saw earlier about scaling [janus-gateway](https://github.com/meetecho/janus-gateway)
![alt text](https://github.com/IG-88-2/react-janus-videoroom/blob/master/example.jpg?raw=true)
## Getting Started
These diagrams summarize behavior of packages mentioned below.
![alt text](https://github.com/IG-88-2/react-janus-videoroom/blob/master/xxx.png?raw=true)
This is screenshot from [video](https://www.youtube.com/watch?v=zxRwELmyWU0&t=1s)
![alt text](https://github.com/IG-88-2/react-janus-videoroom/blob/master/plan.jpg?raw=true)
[react-janus-videoroom](https://github.com/IG-88-2/react-janus-videoroom) - contains thin wrapper around
[janus-gateway-client](https://github.com/IG-88-2/janus-gateway-client) and should provide effortless capability to
add calls to react app. You just drop this into your app, attach callbacks and it works.  

[janus-gateway-client](https://github.com/IG-88-2/janus-gateway-client) - logic related to signaling and negotiation between frontend
and nodejs backend, this is separate package which you have to install in your nodejs app.  

[janus-gateway-node](https://github.com/IG-88-2/janus-gateway-node) - janus instances manager, 
receives messages from clients and dispatches them to correct janus instances (based on location of created room), sending back responses.  

[janus-gateway-videoroom-tests](https://github.com/IG-88-2/janus-gateway-videoroom-tests) - tests.  

[janus-gateway-videoroom-demo](https://github.com/IG-88-2/janus-gateway-videoroom-demo) - demo app which is making use of
[react-janus-videoroom](https://github.com/IG-88-2/react-janus-videoroom).  

## Prerequisites

## Running the tests

## Deployment

## DEMO

## Contributing

## Authors

* **Anatoly Strashkevich**

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
