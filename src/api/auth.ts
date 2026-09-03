import { request } from './http'

export interface CaptchaResponse {
  code: number
  msg: string
  captchaEnabled: boolean
  registerEnabled: boolean
  uuid?: string
  img?: string
}

export interface LoginPayload {
  username: string
  password: string
  code?: string
  uuid?: string
}

export interface LoginResponse {
  code: number
  msg: string
  token: string
}

export interface CurrentUser {
  userId: number
  userName: string
  nickName: string
  avatar?: string
  deptId?: number
  dept?: { deptName?: string }
}

export interface UserInfoResponse {
  code: number
  msg: string
  user: CurrentUser
  roles: string[]
  permissions: string[]
}

export const getCaptcha = () => request<CaptchaResponse>('/captchaImage', { anonymous: true })
export const login = (payload: LoginPayload) => request<LoginResponse>('/login', { method: 'POST', body: payload, anonymous: true })
export const getUserInfo = () => request<UserInfoResponse>('/getInfo')
export const logout = () => request('/logout', { method: 'POST' })
