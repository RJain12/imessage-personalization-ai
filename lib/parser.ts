'use client';

import type { SqlJsStatic } from 'sql.js';
import { ParsedMessage, ParsedData, ChatInfo, HandleInfo } from '@/types/messages';

let sqlPromise: Promise<SqlJsStatic> | null = null;

async function initSQL(): Promise<SqlJsStatic> {
    if (!sqlPromise) {
        sqlPromise = (async () => {
            const initSqlJs = (await import('sql.js')).default;
            const SQL = await initSqlJs({
                locateFile: (file: string) => `https://sql.js.org/dist/${file}`
            });
            return SQL;
        })();
    }
    return sqlPromise;
}

export async function parseMessagesDB(file: File): Promise<ParsedData> {
    const SQL = await initSQL();
    const buffer = await file.arrayBuffer();
    const db = new SQL.Database(new Uint8Array(buffer));

    try {
        const messages = parseMessages(db);
        const chats = parseChats(db);
        const handles = parseHandles(db, messages);

        const dates = messages.map(m => m.date).sort((a, b) => a.getTime() - b.getTime());

        const sentMessages = messages.filter(m => m.isFromMe);
        const groupMessages = messages.filter(m => m.isGroupChat);

        return {
            messages,
            chats,
            handles,
            dateRange: {
                start: dates[0] || new Date(),
                end: dates[dates.length - 1] || new Date(),
            },
            stats: {
                totalMessages: messages.length,
                sentMessages: sentMessages.length,
                receivedMessages: messages.length - sentMessages.length,
                groupMessages: groupMessages.length,
                directMessages: messages.length - groupMessages.length,
            }
        };
    } finally {
        db.close();
    }
}

import type { Database } from 'sql.js';

function parseMessages(db: Database): ParsedMessage[] {
    const messages: ParsedMessage[] = [];

    // iMessage stores dates as nanoseconds since 2001-01-01
    // We need to convert to JavaScript Date
    const APPLE_EPOCH = 978307200000; // 2001-01-01 in milliseconds since Unix epoch

    try {
        const result = db.exec(`
      SELECT 
        m.ROWID as id,
        m.text,
        m.date,
        m.is_from_me,
        h.id as handle_id,
        c.ROWID as chat_id,
        c.group_id,
        c.display_name as chat_name
      FROM message m
      LEFT JOIN handle h ON m.handle_id = h.ROWID
      LEFT JOIN chat_message_join cmj ON m.ROWID = cmj.message_id
      LEFT JOIN chat c ON cmj.chat_id = c.ROWID
      WHERE m.text IS NOT NULL AND m.text != ''
      ORDER BY m.date ASC
    `);

        if (result.length > 0) {
            const rows = result[0].values;
            for (const row of rows) {
                const [id, text, dateNanos, isFromMe, handleId, chatId, groupId, chatName] = row;

                // Convert Apple's date format (nanoseconds since 2001) to JavaScript Date
                let date: Date;
                if (typeof dateNanos === 'number') {
                    // If the date is in nanoseconds (newer iMessage format)
                    if (dateNanos > 1e15) {
                        date = new Date(APPLE_EPOCH + dateNanos / 1000000);
                    } else {
                        // Older format in seconds
                        date = new Date(APPLE_EPOCH + dateNanos * 1000);
                    }
                } else {
                    date = new Date();
                }

                messages.push({
                    id: id as number,
                    text: text as string,
                    date,
                    isFromMe: isFromMe === 1,
                    handleId: (handleId as string) || 'unknown',
                    chatId: (chatId as number) || 0,
                    isGroupChat: !!(groupId && groupId !== ''),
                    chatName: chatName as string | undefined,
                });
            }
        }
    } catch (error) {
        console.error('Error parsing messages:', error);
    }

    return messages;
}

function parseChats(db: Database): ChatInfo[] {
    const chats: ChatInfo[] = [];

    try {
        const result = db.exec(`
      SELECT 
        c.ROWID as id,
        c.display_name,
        c.group_id,
        COUNT(DISTINCT cmj.message_id) as message_count,
        COUNT(DISTINCT chj.handle_id) as participant_count
      FROM chat c
      LEFT JOIN chat_message_join cmj ON c.ROWID = cmj.chat_id
      LEFT JOIN chat_handle_join chj ON c.ROWID = chj.chat_id
      GROUP BY c.ROWID
      ORDER BY message_count DESC
    `);

        if (result.length > 0) {
            const rows = result[0].values;
            for (const row of rows) {
                const [id, displayName, groupId, messageCount, participantCount] = row;

                chats.push({
                    id: id as number,
                    name: (displayName as string) || 'Unknown Chat',
                    isGroupChat: !!(groupId && groupId !== ''),
                    messageCount: messageCount as number,
                    participantCount: participantCount as number,
                    handles: [],
                });
            }
        }
    } catch (error) {
        console.error('Error parsing chats:', error);
    }

    return chats;
}

function parseHandles(db: Database, messages: ParsedMessage[]): HandleInfo[] {
    const handleMap = new Map<string, HandleInfo>();

    try {
        const result = db.exec(`
      SELECT id, ROWID FROM handle
    `);

        if (result.length > 0) {
            for (const row of result[0].values) {
                const [id] = row;
                const handleId = id as string;

                handleMap.set(handleId, {
                    id: handleId,
                    displayName: formatHandle(handleId),
                    messageCount: 0,
                    isPhone: handleId.startsWith('+') || /^\d+$/.test(handleId),
                });
            }
        }
    } catch (error) {
        console.error('Error parsing handles:', error);
    }

    // Count messages per handle
    for (const message of messages) {
        if (!message.isFromMe && handleMap.has(message.handleId)) {
            const handle = handleMap.get(message.handleId)!;
            handle.messageCount++;
        }
    }

    return Array.from(handleMap.values())
        .filter(h => h.messageCount > 0)
        .sort((a, b) => b.messageCount - a.messageCount);
}

function formatHandle(handle: string): string {
    // Format phone numbers nicely, keep emails as-is
    if (handle.includes('@')) {
        return handle;
    }

    // Basic phone number formatting
    const digits = handle.replace(/\D/g, '');
    if (digits.length === 10) {
        return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    } else if (digits.length === 11 && digits[0] === '1') {
        return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    }

    return handle;
}
