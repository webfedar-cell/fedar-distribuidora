interface RecoveryEntry {
  code: string;
  expiresAt: number;
}

// Mapa en memoria para almacenar códigos de recuperación temporales (duración: 15 minutos)
const recoveryStore = new Map<string, RecoveryEntry>();

export function setRecoveryCode(email: string, code: string): void {
  const normalizedEmail = email.trim().toLowerCase();
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutos
  recoveryStore.set(normalizedEmail, { code, expiresAt });
}

export function verifyRecoveryCode(email: string, code: string): boolean {
  const normalizedEmail = email.trim().toLowerCase();
  const entry = recoveryStore.get(normalizedEmail);

  if (!entry) return false;
  if (Date.now() > entry.expiresAt) {
    recoveryStore.delete(normalizedEmail);
    return false;
  }

  return entry.code === code.trim();
}

export function clearRecoveryCode(email: string): void {
  const normalizedEmail = email.trim().toLowerCase();
  recoveryStore.delete(normalizedEmail);
}
