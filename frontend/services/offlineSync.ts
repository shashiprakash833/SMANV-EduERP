/**
 * SMANV EduERP Offline Sync & Network Cache Service
 * Developed by SMANV Info Tech Private Limited
 */

import { setJsonItem, getJsonItem } from './storage';

export interface QueuedAction {
  id: string;
  type: 'attendance_mark' | 'fee_collection' | 'assignment_grade';
  payload: any;
  createdAt: string;
  retryCount: number;
}

const OFFLINE_QUEUE_KEY = 'smanv_offline_action_queue';

export class OfflineSyncService {
  private static queue: QueuedAction[] = [];
  private static isSyncing = false;

  public static async enqueue(type: QueuedAction['type'], payload: any): Promise<void> {
    const item: QueuedAction = {
      id: `queue_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      type,
      payload,
      createdAt: new Date().toISOString(),
      retryCount: 0,
    };

    const currentQueue = (await getJsonItem<QueuedAction[]>(OFFLINE_QUEUE_KEY)) || [];
    currentQueue.push(item);
    await setJsonItem(OFFLINE_QUEUE_KEY, currentQueue);
    this.queue = currentQueue;
  }

  public static async getQueue(): Promise<QueuedAction[]> {
    const stored = await getJsonItem<QueuedAction[]>(OFFLINE_QUEUE_KEY);
    return stored || [];
  }

  public static async syncPendingQueue(): Promise<{ synced: number; failed: number }> {
    if (this.isSyncing) return { synced: 0, failed: 0 };
    this.isSyncing = true;

    try {
      const queue = await this.getQueue();
      if (queue.length === 0) {
        this.isSyncing = false;
        return { synced: 0, failed: 0 };
      }

      let synced = 0;
      let failed = 0;
      const remaining: QueuedAction[] = [];

      for (const item of queue) {
        try {
          // In production, execute the corresponding API call based on item.type
          // Simulated instant sync:
          await new Promise((resolve) => setTimeout(resolve, 300));
          synced++;
        } catch (err) {
          item.retryCount++;
          if (item.retryCount < 3) {
            remaining.push(item);
          }
          failed++;
        }
      }

      await setJsonItem(OFFLINE_QUEUE_KEY, remaining);
      this.queue = remaining;
      this.isSyncing = false;
      return { synced, failed };
    } catch (e) {
      this.isSyncing = false;
      return { synced: 0, failed: 0 };
    }
  }

  public static async clearQueue(): Promise<void> {
    await setJsonItem(OFFLINE_QUEUE_KEY, []);
    this.queue = [];
  }
}
