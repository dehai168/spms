import Cookies from 'js-cookie'
import defaultSettings from '@/settings'

export function getToken() {
  return Cookies.get(defaultSettings.tokenKey)
}

export function setToken(token) {
  return Cookies.set(defaultSettings.tokenKey, token)
}

export function removeToken() {
  return Cookies.remove(defaultSettings.tokenKey)
}
