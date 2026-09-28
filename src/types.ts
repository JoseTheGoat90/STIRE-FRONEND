export type AuthMode = 'login' | 'register' | 'recovery';

export type UserRole = 'student' | 'teacher' | 'admin';

export interface UserSession {
  email: string;
  name: string;
  role: UserRole;
  roleTitle: string;
  institutionalId?: string;
  avatarPattern?: string;
  token: string;
}

export type MatrixPreset = 'smile' | 'heart' | 'code' | 'robot' | 'sparkle' | 'lock';

export interface LEDMatrixPattern {
  id: MatrixPreset;
  name: string;
  grid: number[][];
}

