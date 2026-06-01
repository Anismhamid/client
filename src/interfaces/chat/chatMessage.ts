import { BaseMessage } from './chatUser';

export interface ChatMessage extends BaseMessage {
    status: 'sent' | 'delivered' | 'seen';
}
