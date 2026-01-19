
export enum ShopStatus {
  NEW = 'New',
  WARM = 'Warm',
  HOT = 'Hot',
  COLD = 'Cold',
  DEAD = 'Dead'
}

export enum TaskType {
  VISIT = 'Visit',
  WHATSAPP = 'Send WhatsApp Photos',
  FOLLOW_UP = 'Follow-up',
  CALL = 'Call'
}

export enum TaskStatus {
  PENDING = 'Pending',
  COMPLETED = 'Completed',
  OVERDUE = 'Overdue'
}

export interface Update {
  id: string;
  timestamp: string;
  note: string;
}

export interface Shop {
  id: string;
  name: string;
  ownerName?: string;
  phoneNumber: string;
  location: string;
  status: ShopStatus;
  updates: Update[];
}

export interface Task {
  id: string;
  shopId: string;
  type: TaskType;
  dueDate: string;
  status: TaskStatus;
}
