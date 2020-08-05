import * as React from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';
import client from 'janus-gateway-client';
import { Component, Fragment } from 'react';
const { JanusClient } = client;

let count = 0;



const getId = () => {

    count++;

    return String(count);

}



let enabled = false;



const logger = {
    enable: () => {

        enabled = true;
    
    },
    disable: () => {
    
        enabled = false;
    
    },
    success: (...args) => {

        if (enabled) {
            console.log(...args);
        }

    },
    info: (...args) => {

        if (enabled) {
            console.log(...args);
        }

    },
    error: (error:any) => {

        if (enabled) {
            console.error(error);
        }

    },
    json: (...args) => {

        if (enabled) {
            console.log(...args);
        }

    },
    tag: (tag:string, type:`success` | `info` | `error`) => (...args) => {

        if (enabled) {
            console.log(tag, type, ...args);
        }
        
    }
};



interface VideoProps {
	id:string,
	muted:boolean,
	style:any,
	stream:any
}



interface VideoState {

}



class Video extends Component<VideoProps,VideoState> {
	video:any

	constructor(props) {

		super(props);
		
    }

	componentDidMount() {

		this.video.srcObject = this.props.stream;

	}

	render () {

		const {
			id,
			muted,
			style
		} = this.props;

		return <video
			id={id}
			muted={muted}
			autoPlay
			style={style}
			ref={(video) => { this.video = video; }}
		/>

	}

}



interface CustomStyles {
	video?:any,
	container?:any,
	videoContainer?:any,
	localVideo?:any,
	localVideoContainer?:any
}

interface JanusVideoRoomProps {
	server:string,
	room:string,
	onConnected:(publisher:any) => void,
	onDisconnected:(error?:any) => void,
	onRooms:(rooms:any) => void,
	onError:(error:any) => void,
	onParticipantJoined:(participant:any) => void,
	onParticipantLeft:(participant:any) => void,
	renderContainer:(children:any) => any,
	renderStream:(subscriber:any) => any,
	renderLocalStream:(publisher:any) => any,
	customStyles:CustomStyles
}



interface JanusVideoRoomState {

}



export class JanusVideoRoom extends Component<JanusVideoRoomProps,JanusVideoRoomState> {
	client:any 
	connected:boolean
	styles:CustomStyles

    constructor(props) {

        super(props);

		this.state = {};
		
		const customStyles = this.props.customStyles || {};

		this.styles = {
			video:{

			},
			container:{
				
			},
			videoContainer:{
				
			},
			localVideo:{
				
			},
			localVideoContainer:{
				
			},
			...customStyles
		};

    }



    componentDidMount() {

		const { server } = this.props;
		
		this.client = new JanusClient({
			server,
			logger,
			WebSocket: ReconnectingWebSocket,
			onPublisher: this.onPublisher,
			onSubscriber: this.onSubscriber,
			onError: (error) => {
	
				this.props.onError(error);
	
			},
			getId: () => getId()
		});
	
		this.client.initialize()
		.then(() => (
	
			this.client.getRooms()
	
		))
		.then(({ load }) => {

			this.props.onRooms(load);

			this.connected = true;

		})
		.catch((error) => {

			this.props.onError(error);

		});

    }



	componentDidUpdate(prevProps:JanusVideoRoomProps) {

		if (prevProps.room!==this.props.room && this.props.room) {
			this.changeRoom(prevProps);
		}

	}



	componentWillUnmount() {

		this.connected = false;

		this.client.terminate()
		.then(() => {
			
			this.props.onDisconnected();

		})
		.catch((error) => {

			this.props.onError(error);

		});
						
	}
	


	changeRoom = (prevProps:JanusVideoRoomProps) => {

		if (prevProps.room) {
			this.client.leave()
			.then(() => {
				this.client.join(this.props.room);
			});
		} else {
			this.client.join(this.props.room);
		}

	}



	onPublisherTerminated = (publisher) => () => {

		const video = document.getElementById(publisher.id);
	
		if (video) {
			video.remove();
		}

	}



	onPublisherDisconnected = (publisher) => () => {
		
		//TODO where i should reinitialize in case webrtc down ???
		//TODO prevent any actions while renegotiation is happening
		//reinitialize
		/*
		publisher.initialize()
		.then(() => {

			log.info('[publisher] handling disconnected event...succesfully renegotiated');
			
			video.srcObject = publisher.stream;

		});

		const room_id = client.current.room_id;

		client.current.leave()
		.then(() => {


			return client.current.join(room_id);

		})
		.then(() => {

			
		})
		.catch((error) => {


		});
		*/

	}



	onPublisher = async (publisher) => {

		publisher.addEventListener("terminated", this.onPublisherTerminated(publisher));
	
		publisher.addEventListener("disconnected", this.onPublisherDisconnected(publisher));

		this.props.onConnected(publisher);
	
		const video = document.createElement("video");

		video.id = publisher.id;
		video.autoplay = true;
		video.muted = true;
		video.width = 320;
		video.height = 240;
		video.style.height = "100%";
		
		const container = document.getElementById("local");
		
		container.appendChild(video);
	
		
		
		video.srcObject = publisher.stream;

	}



	onSubscriberTerminater = (subscriber) => () => {
		
		const video = document.getElementById(subscriber.id);

		if (video) {
			video.remove();
		}

		this.props.onParticipantLeft(subscriber);

	}



	onSubscriberLeaving = (subscriber) => () => {
		
		const video = document.getElementById(subscriber.id);

		if (video) {
			video.remove();
		}

		this.props.onParticipantLeft(subscriber);
			
	}



	onSubscriberDisconnected = (subscriber) => () => {
		
		
			
	}



	onSubscriber = async (subscriber) => {
		
		subscriber.addEventListener("terminated", this.onSubscriberTerminater(subscriber));
	
		subscriber.addEventListener("leaving", this.onSubscriberLeaving(subscriber));
	
		subscriber.addEventListener("disconnected", this.onSubscriberLeaving(subscriber));
		
		await subscriber.initialize();

		this.props.onParticipantJoined(subscriber);
		
	}



	renderVideo = (subscriber) => {

		if (this.props.renderStream) {
			return this.props.renderStream(subscriber);
		}

		return <div style={this.styles.videoContainer}>
			<Video
				id={subscriber.id}
				muted={false}
				style={this.styles.video}
				stream={subscriber.stream}
			/>
		</div>
		
	}



	renderLocalVideo = () => {

		const publisher = this.client.publisher;

		if (this.props.renderLocalStream(publisher)) {
			return this.props.renderLocalStream(publisher);
		}

		return <div style={this.styles.localVideoContainer}>
			<Video
				id={publisher.id}
				muted={true}
				style={this.styles.localVideo}
				stream={publisher.stream}
			/>
		</div>

	}

	

	renderContainer = () => {
		
		const subscribers = Object.values(this.client.subscribers);

		const content = (
			<Fragment>
				{
					this.renderLocalVideo()
				}
				{
					subscribers.map((subscriber) => {
						
						return this.renderVideo(subscriber);

					})
				}
			</Fragment>
		)

		if (this.props.renderContainer) {
			return this.props.renderContainer(content);
		}

		return <div
			style={this.styles.container}
		>
			{content}
		</div>

	}



    render() {

		if (!this.client) {
			return null;
		}
		
		return this.renderContainer();
		
	}
	
}
