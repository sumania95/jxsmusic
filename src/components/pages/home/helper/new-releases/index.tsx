import TrackItemComponent from '@/components/pages/common/data-item';
import EmptyComponent from '@/components/pages/common/empty';
import LoadingSkeletonComponents from '@/components/pages/common/loading-skeleton';
import { buildPlaylist } from '@/constant/helperPlaylist';
import { defaultPageLimit, filterState } from '@/state/globalState';
import { api } from '@/utils/api';
import { useAtom } from 'jotai';
import { parseAsArrayOf, parseAsInteger, parseAsString, useQueryState } from 'nuqs';
import React, { useState } from 'react'

const HomeNewReleasesComponent = () => {
    const [defaultLimit] = useState(5)
    const itemSkeleton: number[] = Array.from({ length: defaultLimit }, (_, index) => index + 1);
    const [state] = useAtom(filterState)
    const [bpm] = useQueryState("bpm", parseAsArrayOf(parseAsInteger).withDefault([0, 200]))
    const [pager] = useQueryState("page", parseAsInteger.withDefault(1))
    const [limit] = useQueryState("limit", parseAsInteger.withDefault(defaultLimit))

    const { data: track, isLoading } = api.track.getAllMainReleases.useQuery({
        search:"",
        genre: [],
        tag: [],
        key: [],
        bpm_start: bpm[0],
        bpm_end: bpm[1],
        skip: Number(Number(pager) * limit - limit),
        take: limit,
        is_editor: false,
        is_editor_id: null,
        selectionFilter: state.selectionFilter
    })
  return (
    <div className="flex-1 flex flex-col gap-5 w-full">
        <div className="flex flex-col gap-0.5 w-full">
            {isLoading && itemSkeleton.map((_, index) => (
                <LoadingSkeletonComponents key={index} className="w-full h-16 rounded-md" />
            ))}

            {track?.count._count.id === 0 && <EmptyComponent />}

            {track?.tracks.map((trackItem, index) => (
                <TrackItemComponent
                    {...trackItem}
                    key={index}
                    index_key={index}
                    id={trackItem.id}
                    price={Number(trackItem.price)}
                    playlist={buildPlaylist(track.tracks)}
                    credits={0}
                />
            ))}
        </div>
    </div>
  )
}

export default HomeNewReleasesComponent