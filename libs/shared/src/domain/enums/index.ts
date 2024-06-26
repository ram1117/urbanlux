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
  CANCELLED = 'cancelled',
  FULFILLED = 'fulfilled',
  NOTFULFILLED = 'not fulfilled',
}

export enum PAYMENT_STATUS {
  PENDING = 'pending',
  CONFIRMATION = 'waiting confirmation',
  COMPLETE = 'complete',
  REFUNDINITIATED = 'refund initiated',
  REFUNDCOMPLETE = 'refund completed',
}

export enum SORT_VALUES {
  ALPHASC = 'alphasc',
  ALPHDSC = 'alphdsc',
  PRICEASC = 'priceasc',
  PRICEDSC = 'pricedsc',
  DATEDSC = 'datadsc',
}

export enum CHARGES {
  SHIPPING = 10,
  TAX = 0.08,
}

export enum ADDRESS_TYPE {
  DELIVERY = 'delivery',
  BILLING = 'billing',
}
