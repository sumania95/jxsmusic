import { atom } from "jotai"

export type UserRole = {
  is_admin: boolean
  is_uploader: boolean
  is_superadmin: boolean
  is_video_uploader: boolean
}

export const userRoleAtom = atom<UserRole | null>(null)

export const isAdminAtom = atom(
  (get) => Boolean(get(userRoleAtom)?.is_admin)
)

export const isUploaderAtom = atom(
  (get) => Boolean(get(userRoleAtom)?.is_uploader)
)

export const isSuperAdminAtom = atom(
  (get) => Boolean(get(userRoleAtom)?.is_superadmin)
)

export const isVideoUploaderAtom = atom(
  (get) => Boolean(get(userRoleAtom)?.is_video_uploader)
)
