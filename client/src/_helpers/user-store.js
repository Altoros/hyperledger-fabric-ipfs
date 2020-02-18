// @flow
import type {User} from '../_types';

const userKey = 'user';
const tokenKey = 'token';

export function set(user: User): void {
  localStorage.setItem(userKey, JSON.stringify(user));
  localStorage.setItem(tokenKey, user.token);
}

export function get(): ?User {
  const data = localStorage.getItem(userKey);
  if (data) {
    return JSON.parse(data);
  }
  return null;
}

export function clear(): void {
  localStorage.removeItem(userKey);
  localStorage.removeItem(tokenKey);
}

export function getToken(): ?string {
  return localStorage.getItem(tokenKey);
}