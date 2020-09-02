# react-videoroom-janus
The way to effortlessly embed video calls in your react application, 
package based upon [video](https://www.youtube.com/watch?v=zxRwELmyWU0&t=1s) about scaling [janus-gateway](https://github.com/meetecho/janus-gateway)
![alt text](https://github.com/IG-88-2/react-janus-videoroom/blob/master/example.jpg?raw=true)
## Getting Started  
```
yarn add react-videoroom-janus  
```  
These diagrams summarize behavior of packages mentioned below.
![alt text](https://github.com/IG-88-2/react-janus-videoroom/blob/master/xxx.png?raw=true)
This is screenshot from [video](https://www.youtube.com/watch?v=zxRwELmyWU0&t=1s)
![alt text](https://github.com/IG-88-2/react-janus-videoroom/blob/master/plan.jpg?raw=true)
[react-videoroom-janus](https://github.com/IG-88-2/react-videoroom-janus) - contains thin wrapper around
[janus-gateway-client](https://github.com/IG-88-2/janus-gateway-client) and should provide capability to
add janus client functionality in form of react component. You just drop this into your app, attach callbacks and it works.  

[janus-gateway-client](https://github.com/IG-88-2/janus-gateway-client) - logic related to signaling and negotiation between frontend
and nodejs backend, this is separate package which you can install in your app.  

[janus-gateway-node](https://github.com/IG-88-2/janus-gateway-node) - janus instances manager, 
receives messages from clients and dispatches them to correct janus instances (based on location of created room), sending back responses.  

[janus-gateway-videoroom-tests](https://github.com/IG-88-2/janus-gateway-videoroom-tests) - tests.  

[janus-gateway-videoroom-demo](https://github.com/IG-88-2/janus-gateway-videoroom-demo) - demo app which is making use of
[react-janus-videoroom](https://github.com/IG-88-2/react-janus-videoroom).  

Docker image herbert1947/janus-gateway-videoroom
```
docker pull herbert1947/janus-gateway-videoroom:latest 
```
## Usage

Follow this [link](https://github.com/IG-88-2/janus-gateway-node) to find information on how to deploy backend part.  

```
import { JanusVideoRoom } from 'react-videoroom-janus';

const Room = () => (
    <JanusVideoRoom
        server={this.props.server}
        user_id={this.props.user_id}
        room={this.state.selectedRoom}
        onPublisherDisconnected={(publisher) => {			
            console.log('publisher disconnected', publisher);        
	      }}
        onConnected={(publisher) => {
            console.log('publisher connected', publisher);
        }}
        onDisconnected={(error) => {
            console.log('disconnected', error);
        }}
        onRooms={(rooms) => {
            this.setState({ rooms });
        }}
        onError={(error) => {
            console.error(error);
        }}
        onParticipantJoined={(participant) => {
            console.log(participant);
        }}
        onParticipantLeft={(participant) => {
            console.log(participant);
        }}
    />
)
```
## Props  

### server

> `string` | _required_

websocket address of janus-gateway-node instance, should contain user id.  
example:
```
const server = `ws://127.0.0.1:8080`;
```

### room

> `string` | _required_

id of the room to join, when this prop changes component will automatically perform cleanup
and join different room.  

### user_id

> `string` | _required_

id of the user.  

### onRooms

> `(rooms:JanusRoom[]) => void` | _required_

called when connection established and response arrived for get available rooms request.  

### onError

> `(error:any) => void` | _required_

in case error occurred this. function will be invoked to notify user about error.  

### onConnected

> `(publisher:JanusPublisher) => void` | optional

called after publisher succesfully joined room.  

### onDisconnected

> `(error?:any) => void` | optional

this function will be invoked in case connection was interrupted for some reason,
first argument may contain information about possible reason for connection loss.  

### onPublisherDisconnected

> `(publisher:JanusPublisher) => void` | optional

called when real time data transmission was interrupted or ice connection establishment has failed.  

### onParticipantJoined

> `(participant:JanusSubscriber) => void` | optional

this function will notify user when new participant joined room in which user currently publishing media.  

### onParticipantLeft

> `(participant:JanusSubscriber) => void` | optional

this function will notify user when new participant left room in which user currently publishing media.  

### renderContainer

> `(children:JSX.Element) => JSX.Element` | optional

allows to modify appearance of room ui top level container by wrapping contents in custom react component.  

### renderStream

> `(subscriber:JanusSubscriber) => JSX.Element` | optional

render stream directly (to improve customizability), stream property can be accessed through subscriber object (subscriber.stream).

### renderLocalStream

> `(publisher:JanusPublisher) => JSX.Element` | optional

customize rendering for publisher own video.  

### getCustomStyles

> `(nParticipants:number) => CustomStyles` | optional

function which is going to return custom styles for each ui level depending on amount of participants in the room.

### cameraId

> `string` | optional

deviceId of selected video camera

### logger

> `any` | optional

customize logging

### rtcConfiguration

> `any` | optional

### mediaConstraints

> `any` | optional

## DEMO

[link](https://kreiadesign.com/)

## Contributing
Please consider to help by providing feedback on how this project can be 
improved or what is missing to make it useful for community. Thank you!
## Authors

* **Anatoly Strashkevich**

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
