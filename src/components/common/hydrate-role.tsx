import { useEffect } from "react"
import { useAtom } from "jotai"
import { api } from "@/utils/api"
import { useSession } from "next-auth/react"
import { userRoleAtom } from "@/state/userRoleAtoms"

export const UserRoleHydrator = () => {
  const { data: session } = useSession()
  const [, setUserRole] = useAtom(userRoleAtom)

  const { data } = api.user.getUserRole.useQuery(undefined, {
    enabled: !!session?.user,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    // logout → clear role
    if (!session?.user) {
      setUserRole(null)
      return
    }

    // logged in + data ready → set role
    if (data) {
      setUserRole(data)
    }
  }, [session?.user, data, setUserRole])

  return null
}
