import { SocketUser } from "../auth";

export interface ChatMessage {
  id: number;
  contractId: number;
  senderId: number;
  message: string;
  createdAt: Date | null;
  sender: {
    id: number;
    name: string;
  };
}

export interface SendMessagePayload {
  contractId: number;
  message: string;
}

export interface JoinContractPayload {
  contractId: number;
}

export interface ContractRoomPayload {
  room: string;
}

export interface ErrorPayload {
  message: string;
}

export interface ServerToClientEvents {
  joined_contract: (payload: ContractRoomPayload) => void;

  left_contract: (payload: ContractRoomPayload) => void;

  new_message: (message: ChatMessage) => void;

  message_error: (payload: ErrorPayload) => void;

  contract_error: (payload: ErrorPayload) => void;
}

export interface ClientToServerEvents {
  join_contract: (contractId: number) => void;

  leave_contract: (contractId: number) => void;

  send_message: (payload: SendMessagePayload) => void;
}

export interface InterServerEvents {} 

export interface SocketData {
  user: SocketUser;
}