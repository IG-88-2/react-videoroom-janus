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
    generateId: () => string;
    onConnected: (publisher: any) => void;
    onDisconnected: (error?: any) => void;
    onPublisherDisconnected: (publisher: any) => void;
    onRooms: (rooms: any) => void;
    onError: (error: any) => void;
    onParticipantJoined: (participant: any) => void;
    onParticipantLeft: (participant: any) => void;
    renderContainer: (children: any) => any;
    renderStream: (subscriber: any) => any;
    renderLocalStream: (publisher: any) => any;
    rtcConfiguration?: any;
    mediaConstraints?: any;
    customStyles?: CustomStyles;
}
interface JanusVideoRoomState {
    publisher: any;
    [id: string]: any;
}
export declare class JanusVideoRoom extends Component<JanusVideoRoomProps, JanusVideoRoomState> {
    client: any;
    styles: CustomStyles;
    connected: boolean;
    constructor(props: any);
    componentDidMount(): void;
    componentDidUpdate(prevProps: JanusVideoRoomProps): void;
    componentDidCatch(error: any, info: any): void;
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
