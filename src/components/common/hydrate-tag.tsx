import { useEffect } from "react"
import { useAtom } from "jotai"
import { api } from "@/utils/api"
import { tagItemsAtom } from "@/state/tagAtoms"

const TagHydrator = () => {
  const [, setTags] = useAtom(tagItemsAtom)

  const { data } = api.tag.getAll.useQuery(undefined, {
    staleTime: Infinity,          // tags rarely change
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (!data) return
    setTags(data)
  }, [data, setTags])

  return null
}

export default TagHydrator
