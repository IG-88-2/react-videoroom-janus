import { Component } from 'react';
interface CustomStyles {
    video?: any;
    container?: any;
    videoContainer?: any;
    localVideo?: any;
    localVideoContainer?: any;
}
interface JanusVideoRoomProps {
    server: string;
    room: string;
    onConnected: (publisher: any) => void;
    onDisconnected: (error?: any) => void;
    onRooms: (rooms: any) => void;
    onError: (error: any) => void;
    onParticipantJoined: (participant: any) => void;
    onParticipantLeft: (participant: any) => void;
    renderContainer: (children: any) => any;
    renderStream: (subscriber: any) => any;
    renderLocalStream: (publisher: any) => any;
    customStyles: CustomStyles;
}
interface JanusVideoRoomState {
}
export declare class JanusVideoRoom extends Component<JanusVideoRoomProps, JanusVideoRoomState> {
    client: any;
    connected: boolean;
    styles: CustomStyles;
    constructor(props: any);
    componentDidMount(): void;
    componentDidUpdate(prevProps: JanusVideoRoomProps): void;
    componentWillUnmount(): void;
    changeRoom: (prevProps: JanusVideoRoomProps) => void;
    onPublisherTerminated: (publisher: any) => () => void;
    onPublisherDisconnected: (publisher: any) => () => void;
    onPublisher: (publisher: any) => Promise<void>;
    onSubscriberTerminated: (subscriber: any) => () => void;
    onSubscriberLeaving: (subscriber: any) => () => void;
    onSubscriberDisconnected: (subscriber: any) => () => void;
    onSubscriber: (subscriber: any) => Promise<void>;
    renderVideo: (subscriber: any) => any;
    renderLocalVideo: () => any;
    renderContainer: () => any;
    render(): any;
}
export {};
