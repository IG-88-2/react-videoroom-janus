import * as React from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';
import client from 'janus-gateway-client';
import { Component, Fragment } from 'react';
const { JanusClient } = client;



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
	generateId:() => string,
	onConnected:(publisher:any) => void,
	onDisconnected:(error?:any) => void,
	onPublisherDisconnected:(publisher:any) => void,
	onRooms:(rooms:any) => void,
	onError:(error:any) => void,
	onParticipantJoined:(participant:any) => void,
	onParticipantLeft:(participant:any) => void,
	renderContainer:(children:any) => any,
	renderStream:(subscriber:any) => any,
	renderLocalStream:(publisher:any) => any,
	logger?:any,
	rtcConfiguration?:any,
	mediaConstraints?:any,
	customStyles?:CustomStyles
}



interface JanusVideoRoomState {
	publisher:any,
	[id:string]:any
}



export class JanusVideoRoom extends Component<JanusVideoRoomProps,JanusVideoRoomState> {
	client:any
	styles:CustomStyles
	connected:boolean
	logger:any
	loggerEnabled:boolean

    constructor(props) {

        super(props);

		this.state = {
			publisher:null,

		};
		
		this.connected = false;
		
		this.loggerEnabled = true;

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

		this.logger = {
			enable: () => {
		
				this.loggerEnabled = true;
			
			},
			disable: () => {
			
				this.loggerEnabled = false;
			
			},
			success: (...args) => {
		
				if (this.loggerEnabled) {
					if (this.props.logger && this.props.logger.success) {
						this.props.logger.success(...args);
					} else {
						console.log(...args);
					}
				}
		
			},
			info: (...args) => {
		
				if (this.loggerEnabled) {
					if (this.props.logger && this.props.logger.info) {
						this.props.logger.info(...args);
					} else {
						console.log(...args);
					}
				}
		
			},
			error: (error:any) => {
		
				if (this.loggerEnabled) {
					if (this.props.logger && this.props.logger.error) {
						this.props.logger.error(error);
					} else {
						console.error(error);
					}
				}
		
			},
			json: (...args) => {
		
				if (this.loggerEnabled) {
					if (this.props.logger && this.props.logger.json) {
						this.props.logger.json(...args);
					} else {
						console.log(...args);
					}
				}
		
			},
			tag: (tag:string, type:`success` | `info` | `error`) => (...args) => {
		
				if (this.loggerEnabled) {
					console.log(tag, type, ...args);
				}
				
			}
		};

    }



    componentDidMount() {

		const { server, generateId } = this.props;

		const rtcConfiguration = this.props.rtcConfiguration || {
			"iceServers": [{
				urls: "stun:stun.voip.eutelia.it:3478"
			}],
			"sdpSemantics" : "unified-plan"
		};
		
		this.client = new JanusClient({
			onPublisher: this.onPublisher,
			onSubscriber: this.onSubscriber,
			onError: (error) => this.props.onError(error),
			generateId,
			server,
			logger:this.logger,
			WebSocket: ReconnectingWebSocket,
			subscriberRtcConfiguration: rtcConfiguration,
			publisherRtcConfiguration: rtcConfiguration,
			mediaConstraints: this.props.mediaConstraints || {},
			transactionTimeout: 5000,
			keepAliveInterval: 20000
		});
	
		this.client.initialize()
		.then(() => (
	
			this.client.getRooms()
	
		))
		.then(({ load }) => {

			this.props.onRooms(load);

			this.connected = false;

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



	componentDidCatch(error, info) {

		this.props.onError(error);
		
		this.logger.info(info);

	}



	componentWillUnmount() {
		
		this.client.terminate()
		.then(() => {
			
			return this.props.onDisconnected();

		})
		.catch((error) => {

			this.props.onError(error);

		});
						
	}
	


	changeRoom = (prevProps:JanusVideoRoomProps) => {

		if (prevProps.room) {
			this.client.leave()
			.then(() => {
				return this.client.join(this.props.room);
			})
			.catch((error) => {

				this.props.onError(error);
	
			});
		} else {
			this.client.join(this.props.room)
			.catch((error) => {

				this.props.onError(error);
	
			});
		}

	}



	onPublisherTerminated = (publisher) => () => {
		
		this.setState({
			publisher:null
		});

	}



	onPublisherDisconnected = (publisher) => () => {
		
		this.setState({
			publisher:null
		}, () => {

			this.props.onPublisherDisconnected(publisher);

		});
		
	}



	onPublisher = async (publisher) => {

		publisher.addEventListener("terminated", this.onPublisherTerminated(publisher));
	
		publisher.addEventListener("disconnected", this.onPublisherDisconnected(publisher));

		this.props.onConnected(publisher);

	}



	onSubscriberTerminated = (subscriber) => () => {
		
		this.setState({
			[subscriber.id]: undefined
		}, () => {

			this.props.onParticipantLeft(subscriber);

		});
		
	}



	onSubscriberLeaving = (subscriber) => () => {
		
		this.setState({
			[subscriber.id]: undefined
		}, () => {

			this.props.onParticipantLeft(subscriber);

		});
			
	}



	onSubscriberDisconnected = (subscriber) => () => {
		
		this.setState({
			[subscriber.id]: undefined
		}, () => {

			this.props.onParticipantLeft(subscriber);

		});
			
	}



	onSubscriber = async (subscriber) => {
		
		subscriber.addEventListener("terminated", this.onSubscriberTerminated(subscriber));
	
		subscriber.addEventListener("leaving", this.onSubscriberLeaving(subscriber));
	
		subscriber.addEventListener("disconnected", this.onSubscriberLeaving(subscriber));
		
		try {

			await subscriber.initialize();

			this.setState({
				[subscriber.id]: subscriber
			}, () => {

				this.props.onParticipantJoined(subscriber);

			});
			
		} catch(error) {
			
			this.props.onError(error);

		}
		
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

		const publisher = this.state.publisher;

		if (!publisher) {
			return null;
		}

		if (this.props.renderLocalStream(publisher)) {
			return this.props.renderLocalStream(publisher);
		}

		return (
			<div style={this.styles.localVideoContainer}>
				<Video
					id={publisher.id}
					muted={true}
					style={this.styles.localVideo}
					stream={publisher.stream}
				/>
			</div>
		);

	}

	

	renderContainer = () => {
		
		const subscribers = Object.values(this.state.subscribers).filter((element:any) => element && element.ptype==="subscriber");

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
		);

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
