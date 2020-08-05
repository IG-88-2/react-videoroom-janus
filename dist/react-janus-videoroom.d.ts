import { Component } from 'react';
interface JanusVideoRoomProps {
    server: string;
    room: any;
    onConnected: (publisher: any) => void;
    onDisconnected: (error: any) => void;
    onRooms: (rooms: any) => void;
    onParticipantJoined: (participant: any) => void;
    onParticipantLeft: (participant: any) => void;
    renderVideo: (video: any) => any;
    renderLocalVideo: (localVideo: any) => any;
    renderContainer: (children: any) => any;
    renderStream: (stream: any) => any;
    renderLocalStream: (localStream: any) => void;
    customStyles: {
        video?: any;
        container?: any;
        videoContainer?: any;
        localVideo?: any;
        localVideoContainer?: any;
    };
}
interface JanusVideoRoomState {
}
export declare class JanusVideoRoom extends Component<JanusVideoRoomProps, JanusVideoRoomState> {
    constructor(props: any);
    componentDidMount(): void;
    componentWillUnmount(): void;
    componentWillReceiveProps(): void;
    componentDidUpdate(): void;
    render(): JSX.Element;
}
export {};
