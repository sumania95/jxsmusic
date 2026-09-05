import { useEffect } from "react"
import { useAtom } from "jotai"
import { api } from "@/utils/api"
import { genreItemsAtom } from "@/state/genreAtoms"

const GenreHydrator = () => {
  const [, setGenres] = useAtom(genreItemsAtom)

  const { data } = api.genre.getAll.useQuery(undefined, {
    staleTime: Infinity,          // genres rarely change
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (!data) return
    setGenres(data)
  }, [data, setGenres])

  return null
}

export default GenreHydrator
