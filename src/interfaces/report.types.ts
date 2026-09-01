// src/interfaces/report.types.ts

import {
    UserName,
    UserImage,
    UserRole,
} from './User';

/* =========================
   Report Types
========================= */

export type UserReportType =
    | 'user'
    | 'post'
    | 'message'
    | 'comment';

export type UserReportStatus =
    | 'pending'
    | 'reviewing'
    | 'resolved'
    | 'rejected';

export type UserReportReason =
    | 'spam'
    | 'harassment'
    | 'inappropriate_content'
    | 'fake_account'
    | 'scam'
    | 'violence'
    | 'hate_speech'
    | 'nudity'
    | 'copyright'
    | 'other';

/* =========================
   Base Report
========================= */

export interface UserReport {
    _id: string;

    type: UserReportType;

    targetId: string;

    reportedBy: string;

    reason: UserReportReason;

    description?: string;

    status: UserReportStatus;

    createdAt: Date | string;

    updatedAt?: Date | string;
}

/* =========================
   User Report
========================= */

export interface UserReportUser
    extends UserReport {
    type: 'user';

    targetUser?: {
        _id: string;
        name?: UserName;
        email?: string;
        slug?: string;
        image?: UserImage;
        role?: UserRole;
    } | null;
}

/* =========================
   Post Report
========================= */

export interface UserReportPost
    extends UserReport {
    type: 'post';

    targetPost?: {
        _id: string;
        product_name?: string;
        category?: string;

        seller?: {
            _id: string;
            name?: UserName;
            slug?: string;
        } | null;

        image?: UserImage;
    } | null;
}

/* =========================
   Message Report
========================= */

export interface UserReportMessage
    extends UserReport {
    type: 'message';

    targetMessage?: {
        _id: string;

        message?: string;

        from?: {
            _id: string;
            name?: UserName;
            email?: string;
        } | null;

        to?: {
            _id: string;
            name?: UserName;
            email?: string;
        } | null;

        createdAt: Date | string;
    } | null;
}

/* =========================
   Comment Report
========================= */

export interface UserReportComment
    extends UserReport {
    type: 'comment';

    targetComment?: {
        _id: string;

        content?: string;

        user?: {
            _id: string;
            name?: UserName;
            slug?: string;
            image?: UserImage;
        } | null;

        createdAt: Date | string;
    } | null;
}

/* =========================
   Report Union
========================= */

export type UserReportUnion =
    | UserReportUser
    | UserReportPost
    | UserReportMessage
    | UserReportComment;

/* =========================
   Create Report
========================= */

export interface CreateReportPayload {
    type: UserReportType;

    targetId: string;

    reason: UserReportReason;

    description?: string;
}

/* =========================
   Update Report
========================= */

export type ReportAdminAction =
    | 'warn'
    | 'block'
    | 'delete_post'
    | 'delete_message'
    | 'delete_comment'
    | 'ignore';

export interface UpdateReportPayload {
    status: UserReportStatus;

    adminNote?: string;

    action?: ReportAdminAction;
}

/* =========================
   Report Statistics
========================= */

export interface ReportStats {
    total: number;

    pending: number;

    reviewing: number;

    resolved: number;

    rejected: number;

    byType: Record<
        UserReportType,
        number
    >;

    byReason: Record<
        UserReportReason,
        number
    >;
}

/* =========================
   Blocked User
========================= */

export interface BlockedUserInfo {
    _id: string;

    name: UserName;

    slug: string;

    image?: UserImage;

    email?: string;

    role?: UserRole;

    blockedAt: Date | string;

    reason?: string;

    expiresAt?: Date | string | null;

    isPermanent: boolean;
}

/* =========================
   Block User Payload
========================= */

export interface BlockUserPayload {
    userId: string;

    reason?: string;

    expiresAt?: Date | string | null;

    isPermanent?: boolean;
}

/* =========================
   Block
========================= */

export interface Block {
    _id: string;

    blockerId: string;

    blockedId: string;

    reason?: string;

    createdAt: Date | string;

    updatedAt?: Date | string;

    expiresAt?: Date | string | null;

    isPermanent: boolean;
}

export interface UpdateReportResponse {
    success: boolean;
    message: string;
    report: UserReportUnion;
    actionResult?: unknown;
}

export interface CreateReportResponse {
    success: boolean;
    message: string;
    report: UserReportUnion;
}