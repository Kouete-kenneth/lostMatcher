// src/types/push.types.ts
export interface PushSubscriptionKeys {
    p256dh: string;
    auth: string;
}

export interface PushSubscriptionJSON {
    endpoint: string;
    expirationTime: number | null;
    keys: PushSubscriptionKeys;
}
