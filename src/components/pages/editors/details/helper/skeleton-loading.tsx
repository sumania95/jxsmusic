import { ProfileMeta } from '@/components/common/metadata'
import { Loader2Icon } from 'lucide-react'
import React from 'react'


const SkeletonLoadingEditorComponent = () => {
  return (
    <>
         <ProfileMeta
            title={undefined}
            description={undefined}
            image={undefined}
        />
        <div className='w-full min-h-screen flex items-center justify-center'>
            <Loader2Icon className=' animate-spin'/>
        </div>
    </>
  )
}

export default SkeletonLoadingEditorComponent