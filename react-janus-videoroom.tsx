import client from 'janus-gateway-client';
import ReconnectingWebSocket from 'reconnecting-websocket'; //TODO is this going to work with standart websocket ?
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useState, useRef } from 'react';
const { JanusClient } = client;
console.log(JanusClient);

let count = 0;

const uuidv1 = () => {

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
            
        }

    },
    info: (...args) => {

        if (enabled) {
            
        }

    },
    error: (error:any) => {

        if (enabled) {
            
        }

    },
    json: (...args) => {

        if (enabled) {
            
        }

    },
    tag: (tag:string, type:`success` | `info` | `error`) => (...args) => {

        if (enabled) {
            
        }
        
    }
};



const onPublisher = (publisher, onDisconnected) => {

	const video = document.createElement("video");

	video.id = publisher.id;
	video.autoplay = true;
	video.muted = true;
	video.width = 320;
	video.height = 240;
	video.style.height = "100%";
	
	const container = document.getElementById("local");
	
	container.appendChild(video);

	publisher.addEventListener("terminated", () => {
		
		const video = document.getElementById(publisher.id);

		if (video) {
			video.remove();
		}

	});

	publisher.addEventListener("disconnected", () => {
		
		//TODO where i should reinitialize in case webrtc down ???
		//TODO prevent any actions while renegotiation is happening
		//reinitialize
		/*
		publisher.initialize()
		.then(() => {

			log.info('[publisher] handling disconnected event...succesfully renegotiated');
			
			video.srcObject = publisher.stream;

		});
		*/
	});
	
	video.srcObject = publisher.stream;

};



const onSubscriber = async (subscriber) => {

	const video = document.createElement("video");

	video.id = subscriber.id;
	video.autoplay = true;
	video.width = 180;
	video.height = 120;
	video.style.background = "green";
	video.style.padding = "5px";
	
	const container = document.getElementById("container");

	container.appendChild(video);

	subscriber.addEventListener("terminated", () => {

        
		const video = document.getElementById(subscriber.id);

		if (video) {
			video.remove();
		}

	});

	subscriber.addEventListener("leaving", () => {

        
		const video = document.getElementById(subscriber.id);

		if (video) {
			video.remove();
		}

	});

	subscriber.addEventListener("disconnected", () => {
        

        
	});

	await subscriber.initialize();
	
	video.srcObject = subscriber.stream;

};



const onDisconnected = (client) => {

	const room_id = client.current.room_id;

	client.current.leave()
	.then(() => {


		return client.current.join(room_id);

	})
	.then(() => {

		
	})
	.catch((error) => {


	});

};



const connect = (client, server) => {

	if (client.current) {
		console.log('already connected...');
		return client.current.getRooms().then(({ load }) => load);
	}

	client.current = new JanusClient({
		server,
		logger,
		WebSocket: ReconnectingWebSocket,
		onPublisher: (publisher) => {

			onPublisher(publisher, onDisconnected);

		},
		onSubscriber: async (subscriber) => {
			
			onSubscriber(subscriber);

		},
		onError: (error) => {

            

		},
		getId: () => uuidv1()
	});

	return client.current.initialize()
	.then(() => (

		client.current.getRooms().then(({ load }) => load)

	));

};



const disconnect = async (client) => {

	if (client.current) {
		if (client.current.publisher) {
			const video = document.getElementById(client.current.publisher.id);
			
			if (video) {
				video.remove();
			}
		}

		try {
			await client.current.terminate();
			console.log('terminated!');
		} catch(error) {
			console.error(error);
		}

		client.current = null;
	}

};



const onCreateRoom = (client, description:string) => {
	
	return client.current.createRoom(description);

};



const onJoinRoom = (client, room) => {

	if (client.current) {
		return client.current.join(room.room_id);
	}

};



const onLeaveRoom = (client, room) => {

	if (client.current) {
		return client.current.leave();
	}
	
};



const Room = ({ room, onJoin, onLeave } : any) => {

	const {
		room_id,
		instance_id
	} = room;

	return (
		<div 
			className="room-element"
			key={room_id}
			style={{
				display:"flex",
				flexDirection:"column",
				padding:"10px",
				color:"white",
				background:"red"
			}}
		>
			<div>
				{instance_id}
			</div>
			<div className="room-id">
				{room_id}
			</div>
			<div style={{
				display:"flex"
			}}>
				<button 
					id={`join-${room_id}`}
					onClick={(e) => onJoin()}
				>
					Join
				</button>
				<button
					id={`leave-${room_id}`}
					onClick={(e) => onLeave()}
				>
					Leave
				</button>
			</div>
		</div>
	);

};



const VideoRoom = ({ server }) => {

	const client = useRef(null);

	const [rooms, setRooms] = useState([]);

	const [muted, setMuted] = useState(false);

	const [paused, setPaused] = useState(false);

	const [description, setDescription] = useState(``);



	return (
		<div style={{
			height:`100%`,
			width:`100%`,
			display:`flex`,
			justifyContent:`space-between`,
			background:`aliceblue`
		}}>

			<div style={{
				display:`flex`,
				flexDirection:`column`,
				height:`100%`,
				width:`33.3%`,
				background:`beige`
			}}>

				<div style={{
					display:`flex`
				}}>
					<button 
						id="connect"
						onClick={() => {

							connect(client, server)
							.then((rooms) => {
								
								setRooms(rooms);

							});

						}}
					>
						Connect
					</button>
					<button 
						id="disconnect"
						onClick={() => {

							disconnect(client);
							
							setRooms([]);

						}}
					>
						Disconnect
					</button>
				</div>

				<div style={{
					display:`flex`,
					flexDirection:`column`
				}}>
					<input value={description} onChange={(e) => setDescription(e.target.value)} />
					<button onClick={(e) => {

						onCreateRoom(client, description)
						.then((result) => {

							logger.info('onCreateRoom response');
							
							logger.json(result);

							return client.current.getRooms().then(({ load }) => load);

						})
						.then((rooms) => {
							
							setRooms(rooms);

						})
						.catch((error) => {

                            

						})

					}}>
						Create Room
					</button>
				</div>

				<div 
					className="rooms"
					style={{
						display:`flex`,
						flexDirection:`column`,
						overflow:`auto`
					}}
				>
					{
						rooms.map((room, index) => {

							return (
								<Room 
									key={`room-${index}`}
									room={room}
									onJoin={() => {
										
										onJoinRoom(client, room);
										
									}} 
									onLeave={() => {

										onLeaveRoom(client, room);

									}}
								/>
							);
						})
					}
				</div>

			</div>
					
			<div
				style={{
					display:`flex`,
					flexDirection:`column`,
					height:`100%`,
					width:`66.6%`,
					overflow:`hidden`
				}}
			>

				<div style={{
					display:`flex`,
					flexDirection:`column`,
					height:`33.3%`,
					width:`100%`,
					alignItems:`center`,
					background:`darkgray`
				}}>

					<button 
						onClick={() => {
							
							if (paused) {
								client.current.resume()
								.then((result) => {

									if (
										result && 
										result.load && 
										result.load.data && 
										result.load.data.configured==="ok"
									) {
										setPaused(false);
									}

								});
							} else {
								client.current.pause()
								.then((result) => {
			
									if (
										result && 
										result.load && 
										result.load.data && 
										result.load.data.configured==="ok"
									) {
										setPaused(true);
									}
										
								});
							}
						}}
						style={{
							width:`100%`,
							height:`21px`
						}}
					>
						{paused ? 'Resume' : 'Pause'}
					</button>

					<button 
						onClick={() => {

							if (muted) {
								client.current.unmute()
								.then((result) => {

									if (
										result && 
										result.load && 
										result.load.data && 
										result.load.data.configured==="ok"
									) {
										setMuted(false);
									}

								});
							} else {
								client.current.mute()
								.then((result) => {
			
									if (
										result && 
										result.load && 
										result.load.data && 
										result.load.data.configured==="ok"
									) {
										setMuted(true);
									}
										
								});
							}

						}}
						style={{
							width:`100%`,
							height:`21px`
						}}
					>
						{muted ? 'Unmute' : 'Mute'}
					</button>

					<button 
						onClick={() => {

							if (
								client.current.publisher
							) {
								client.current.publisher.renegotiate({
									audio: true,
									video: true
								});
							}

						}}
						style={{
							width:`100%`,
							height:`21px`
						}}
					>
						Renegotiate
					</button>

					<button 
						onClick={() => {

							clearInterval(client.current.keepAliveInterval);
							
						}}
						style={{
							width:`100%`,
							height:`21px`
						}}
					>
						Stop Keepalive
					</button>

					<div 
						id="local"
						style={{
							display: `flex`,
							maxHeight: `calc(100% - 84px)`,
							width: `100%`,
							alignItems: `center`,
							justifyContent: `center`
						}}
					/>

				</div>

				<div
					id="container"
					style={{
						display:`flex`,
						flexWrap:`wrap`,
						height:`66.6%`,
						width:`100%`,
						overflow:`auto`
					}} 
				/>

			</div>
			
		</div>

	);

}


export default VideoRoom