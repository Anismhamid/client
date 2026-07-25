// في ملف googleValues.ts
export interface DecodedGooglePayload {
    iss: string; // Issuer
    azp: string; // Authorized party
    aud: string; // Audience
    sub: string; // Subject (user ID)
    email: string; // Email
    email_verified: boolean;
    name: string; // Full name
    picture: string; // Profile picture URL
    given_name: string; // First name
    family_name: string; // Last name
    locale: string; // Language
    iat: number; // Issued at
    exp: number; // Expiration time

    // نطاقات إضافية
    birthdate?: string; // تاريخ الميلاد
    gender?: string; // الجنس
    phone_number?: string; // رقم الهاتف
    phone_number_verified?: boolean;
}
