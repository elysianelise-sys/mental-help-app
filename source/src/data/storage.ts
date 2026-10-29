export const STORAGE_VERSION = 1;
export const STORAGE_NOTICE_EVENT = 'mh-storage-notice';

type Envelope<T> = { version: number; data: T };
const localMemory = new Map<string, unknown>();
const sessionMemory = new Map<string, unknown>();
let localMemoryOnly = false;
let sessionMemoryOnly = false;
let pendingNotice: string | null = null;
let noticeSent = false;

function announce(message: string) {
  if (noticeSent) return;
  noticeSent = true;
  pendingNotice ??= message;
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(STORAGE_NOTICE_EVENT));
  }
}

export function consumeStorageNotice() {
  const notice = pendingNotice;
  pendingNotice = null;
  return notice;
}

function invalidStorage(key: string, details: unknown) {
  console.warn(`Could not load saved data for ${key}; using a fresh default.`, details);
  announce("We couldn't load your saved data, so we've started fresh.");
}

function parse<T>(key: string, raw: string, fallback: T): { data: T; valid: boolean } {
  try {
    const parsed = JSON.parse(raw) as Envelope<T>;
    if (parsed?.version === STORAGE_VERSION && 'data' in parsed) {
      return { data: parsed.data, valid: true };
    }
    invalidStorage(key, 'Unsupported storage version or envelope.');
  } catch (error) {
    invalidStorage(key, error);
  }
  return { data: fallback, valid: false };
}

export function read<T>(key: string, fallback: T, onInvalid?: () => void): T {
  if (localMemory.has(key)) return localMemory.get(key) as T;
  if (localMemoryOnly) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    const result = parse(key, raw, fallback);
    if (result.valid) localMemory.set(key, result.data);
    else onInvalid?.();
    return result.data;
  } catch (error) {
    localMemoryOnly = true;
    announce('Your data will only be kept until you close this tab.');
    onInvalid?.();
    return fallback;
  }
}

export function write<T>(key: string, data: T): boolean {
  localMemory.set(key, data);
  if (localMemoryOnly) return true;
  try {
    const value: Envelope<T> = { version: STORAGE_VERSION, data };
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    localMemoryOnly = true;
    announce('Your data will only be kept until you close this tab.');
    return true;
  }
}

export function readSession<T>(key: string, fallback: T): T {
  if (sessionMemory.has(key)) return sessionMemory.get(key) as T;
  if (sessionMemoryOnly) return fallback;
  try {
    const raw = window.sessionStorage.getItem(key);
    if (raw === null) return fallback;
    const result = parse(key, raw, fallback);
    if (result.valid) sessionMemory.set(key, result.data);
    return result.data;
  } catch {
    sessionMemoryOnly = true;
    announce('Some temporary data is only available in this tab.');
    return fallback;
  }
}

export function writeSession<T>(key: string, data: T): boolean {
  sessionMemory.set(key, data);
  if (sessionMemoryOnly) return true;
  try {
    window.sessionStorage.setItem(
      key,
      JSON.stringify({ version: STORAGE_VERSION, data } satisfies Envelope<T>),
    );
    return true;
  } catch {
    sessionMemoryOnly = true;
    announce('Some temporary data is only available in this tab.');
    return true;
  }
}

export function removeSession(key: string): void {
  sessionMemory.delete(key);
  if (sessionMemoryOnly) return;
  try {
    window.sessionStorage.removeItem(key);
  } catch {
    sessionMemoryOnly = true;
    announce('Some temporary data is only available in this tab.');
  }
}
