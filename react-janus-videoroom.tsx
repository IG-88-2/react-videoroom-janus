import * as React from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { Component, Fragment } from 'react';
import { JanusClient } from 'janus-gateway-client';



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
	container:any 

	constructor(props) {

		super(props);
		
	}
	


	componentDidMount() {
		
		this.video.srcObject = this.props.stream;
	
		this.video.play();

	}



	componentWillReceiveProps(nextProps) {
		
		if (nextProps.stream!==this.props.stream) {
			this.video.srcObject = nextProps.stream;
			this.video.play();
		}

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
	renderContainer?:(children:any) => any,
	renderStream?:(subscriber:any) => any,
	renderLocalStream?:(publisher:any) => any,
	logger?:any,
	rtcConfiguration?:any,
	mediaConstraints?:any,
	getCustomStyles?:(nParticipants:number) => CustomStyles
}



interface JanusVideoRoomState {
	styles:CustomStyles
}



export class JanusVideoRoom extends Component<JanusVideoRoomProps,JanusVideoRoomState> {
	client:any
	logger:any
	connected:boolean
	defaultStyles:any
	loggerEnabled:boolean
	nParticipants:number

    constructor(props) {

		super(props);
		
		this.loggerEnabled = true;

		let customStyles = {};

		if (this.props.getCustomStyles) {
			customStyles = this.props.getCustomStyles(0);
		}

		this.defaultStyles = {
			container:{
				height: `100%`,
				width: `100%`,
				position: `relative`
			},
			video:{
				width: `100%`,
			},
			videoContainer:{
				width: `100%`,
				height: `100%`
			},
			localVideo:{
				width: `200px`,
				height: `auto`
			},
			localVideoContainer:{
				position: `absolute`,
				top: `50px`,
				right: `50px`
			}
		};

		this.state = {
			styles: {
				...this.defaultStyles,
				...customStyles
			}
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



	cleanup = () => {

		return this.client.terminate()
		.then(() => {

			this.connected = false;
				
			return this.props.onDisconnected();
			
		})
		.catch((error) => {

			this.props.onError(error);
			
		});

	}



    componentDidMount() {

		window.addEventListener('beforeunload', this.cleanup);

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
			transactionTimeout: 15000,
			keepAliveInterval: 10000
		});
	
		this.client.initialize()
		.then(() => (
	
			this.client.getRooms()
	
		))
		.then(({ load }) => {

			this.props.onRooms(load);
			
			this.connected = true;

			this.forceUpdate();

		})
		.catch((error) => {

			this.props.onError(error);

		});

    }



	componentDidUpdate(prevProps:JanusVideoRoomProps) {

		if (prevProps.room!==this.props.room) {
			this.onChangeRoom(prevProps);
		}

	}



	componentDidCatch(error, info) {

		this.props.onError(error);
		
		this.logger.info(info);

	}



	componentWillUnmount() {

		this.cleanup();

		window.removeEventListener('beforeunload', this.cleanup);

	}
	


	onChangeRoom = (prevProps:JanusVideoRoomProps) => {

		const { mediaConstraints } = this.props;
		const left = prevProps.room && !this.props.room;
		const join = !prevProps.room && this.props.room;
		const change = prevProps.room && this.props.room && prevProps.room!==this.props.room;
		
		if (left) { 
			return this.client.leave()
			.then(() => {

				this.forceUpdate();

			})
			.catch((error) => {

				this.props.onError(error);

			});
		} else if (change) {
			return this.client.leave()
			.then(() => {
				return this.client.join(this.props.room, mediaConstraints);
			})
			.then(() => {

				this.forceUpdate();

			})
			.catch((error) => {

				this.props.onError(error);

			});
		} else if (join) {
			this.client.join(this.props.room, mediaConstraints)
			.then(() => {

				this.forceUpdate();

			})
			.catch((error) => {

				this.props.onError(error);
	
			});
		}

	}



	onPublisherTerminated = (publisher) => () => {
		
		this.props.onPublisherDisconnected(publisher);
		
	}



	onPublisherDisconnected = (publisher) => () => {
		
		this.props.onPublisherDisconnected(publisher);
		
	}



	onPublisher = async (publisher) => {

		publisher.addEventListener("terminated", this.onPublisherTerminated(publisher));
	
		publisher.addEventListener("disconnected", this.onPublisherDisconnected(publisher));
		
		this.props.onConnected(publisher);

		this.forceUpdate();

	}



	onSubscriberTerminated = (subscriber) => () => {
		
		this.props.onParticipantLeft(subscriber);

		const subscribers = this.getSubscribers();
			
		if (this.nParticipants!==subscribers.length) {
			this.nParticipants = subscribers.length;
			this.onParticipantsAmountChange();
		}

		this.forceUpdate();
		
	}



	onSubscriberLeaving = (subscriber) => () => {
		
		this.props.onParticipantLeft(subscriber);

		const subscribers = this.getSubscribers();
			
		if (this.nParticipants!==subscribers.length) {
			this.nParticipants = subscribers.length;
			this.onParticipantsAmountChange();
		}

		this.forceUpdate();
		
	}



	onSubscriberDisconnected = (subscriber) => () => {
		
		this.props.onParticipantLeft(subscriber);

		const subscribers = this.getSubscribers();
			
		if (this.nParticipants!==subscribers.length) {
			this.nParticipants = subscribers.length;
			this.onParticipantsAmountChange();
		}

		this.forceUpdate();
		
	}



	onSubscriber = async (subscriber) => {
		
		subscriber.addEventListener("terminated", this.onSubscriberTerminated(subscriber));
	
		subscriber.addEventListener("leaving", this.onSubscriberLeaving(subscriber));
	
		subscriber.addEventListener("disconnected", this.onSubscriberLeaving(subscriber));
		
		try {

			await subscriber.initialize();
			
			this.props.onParticipantJoined(subscriber);

			const subscribers = this.getSubscribers();
			
			if (this.nParticipants!==subscribers.length) {
				this.nParticipants = subscribers.length;
				this.onParticipantsAmountChange();
			}

			this.forceUpdate();
			
		} catch(error) {
			
			this.props.onError(error);

		}
		
	}



	renderVideo = (subscriber) => {

		if (this.props.renderStream) {
			return this.props.renderStream(subscriber);
		}

		return <div 
			key={`subscriber-${subscriber.id}`}
			style={this.state.styles.videoContainer}
		>
			<Video
				id={subscriber.id}
				muted={false}
				style={this.state.styles.video}
				stream={subscriber.stream}
			/>
		</div>
		
	}



	renderLocalVideo = () => {

		const publisher = this.client.publisher;

		if (!publisher) {
			return null;
		}

		if (this.props.renderLocalStream) {
			return this.props.renderLocalStream(publisher);
		}

		this.logger.info('render publisher', publisher);
		
		return (
			<div style={this.state.styles.localVideoContainer}>
				<Video
					id={publisher.id}
					muted={true}
					style={this.state.styles.localVideo}
					stream={publisher.stream}
				/>
			</div>
		);

	}



	getSubscribers = () => {

		if (!this.client || !this.client.subscribers) {
			return [];
		}

		return Object.values(this.client.subscribers).filter((element:any) => element && element.ptype==="subscriber");

	}
	
	

	renderContainer = () => {

		if (!this.client || !this.client.subscribers) {
			return null;
		}
		
		const subscribers = this.getSubscribers();
		
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

		return <div style={this.state.styles.container}>
			{content}
		</div>

	}



	onParticipantsAmountChange = () => {
		
		const { getCustomStyles } = this.props;

		if (getCustomStyles) {
			const styles = getCustomStyles(this.nParticipants);
			if (styles) {
				this.setState({
					styles: {
						...this.defaultStyles,
						...styles
					}
				});
			}
		}
		
	}



    render() {

		if (!this.client) {
			return null;
		}
		
		return this.renderContainer();
		
	}
	
}
