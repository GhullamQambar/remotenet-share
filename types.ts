
export enum UserRole {
  PROVIDER = 'provider',
  RECEIVER = 'receiver',
}

export enum ConnectionStatus {
  DISCONNECTED = 'Disconnected',
  CONNECTING = 'Connecting',
  CONNECTED = 'Connected',
}

export interface UsageControl {
  dataCap: number; // in GB
  duration: number; // in hours
  allowedWebsites: string;
}

export interface ConnectionState {
  status: ConnectionStatus;
  dataUsed: number; // in MB
  timeElapsed: number; // in minutes
}

export interface DataPoint {
  time: number; // minutes
  usage: number; // MB
}

export interface ConnectionCredentials {
  userId: string;
  pass: string;
}
