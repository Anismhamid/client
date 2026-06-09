export interface User {
    _id?: string;
    name: { first: string; last: string };
    phone?: { phone_1: string; phone_2?: string };
    image?: { url: string; alt: string };
    address?: { city: string; street: string; houseNumber: number };
    email: string;
    role: string;
    gender?: string;
    createdAt?: string;
}

export interface UserMessage {
    slug?: string;
    updatedAt: Date | string;
    image?: { url: string; alt: string };
    _id?: string;
    status?: boolean;
    from: {
        _id?: string;
        email?: string;
        first?: string;
        last?: string;
        role?: string;
        image?: { url: string; alt: string };
        status?: boolean;
    };
    to: {
        _id?: string;
        email?: string;
        first?: string;
        last?: string;
        role?: string;
        image?: { url: string; alt: string };
        status?: boolean;
    };
    messageStatus: string;
    message: string;
    warning?: boolean;
    isImportant?: boolean;
    replyTo?: string;
    createdAt: string;
    name?: { first: string; last: string };
    email?: string;
    role?: string;
}
