export enum USER_ROLES {
  user = 'USER',
  admin = 'ADMIN',
}

export enum QUEUE_NAMES {
  AUTH = 'auth_queue',
}

export enum SERVICE_NAMES {
  AUTH = 'AUTH_SERVICE',
}

export enum SERVICE_PATTERNS {
  AUTH = 'authenticate_user',
}

export enum ORDER_STATUS {
  PLACED = 'placed',
  FULFILLED = 'fulfilled',
  CANCELLED = 'cancelled',
  NOTFULFILLED = 'not fulfilled',
}

export enum PAYMENT_STATUS {
  PENDING = 'pending',
  COMPLETE = 'complete',
}
