import { Component } from 'react';
import { Subscription, Subject } from 'rxjs';
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
    onPublisherDisconnected: (publisher: any) => void;
    onRooms: (rooms: any) => void;
    onError: (error: any) => void;
    onParticipantJoined: (participant: any) => void;
    onParticipantLeft: (participant: any) => void;
    renderContainer?: (children: any) => any;
    renderStream?: (subscriber: any) => any;
    renderLocalStream?: (publisher: any) => any;
    logger?: any;
    rtcConfiguration?: any;
    cameraId?: any;
    user_id?: any;
    mediaConstraints?: any;
    getCustomStyles?: (nParticipants: number) => CustomStyles;
}
interface JanusVideoRoomState {
    styles: CustomStyles;
}
export declare class JanusVideoRoom extends Component<JanusVideoRoomProps, JanusVideoRoomState> {
    client: any;
    logger: any;
    connected: boolean;
    defaultStyles: any;
    loggerEnabled: boolean;
    nParticipants: number;
    tasks: Subject<any>;
    s: Subscription;
    constructor(props: any);
    cleanup: () => any;
    componentDidMount(): void;
    componentDidUpdate(prevProps: JanusVideoRoomProps): void;
    onChangeCamera: () => Promise<void>;
    onChangeRoom: (prevRoom: string) => Promise<void>;
    componentDidCatch(error: any, info: any): void;
    componentWillUnmount(): void;
    onPublisherTerminated: (publisher: any) => () => void;
    onPublisherDisconnected: (publisher: any) => () => void;
    onPublisher: (publisher: any) => Promise<void>;
    onSubscriberTerminated: (subscriber: any) => () => void;
    onSubscriberLeaving: (subscriber: any) => () => void;
    onSubscriberDisconnected: (subscriber: any) => () => void;
    onSubscriber: (subscriber: any) => Promise<void>;
    renderVideo: (subscriber: any) => any;
    renderLocalVideo: () => any;
    getSubscribers: () => unknown[];
    renderContainer: () => any;
    onParticipantsAmountChange: () => void;
    render(): any;
}
export {};
