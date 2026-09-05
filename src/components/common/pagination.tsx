import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';

interface PaginationProps {
  pages: number;
}

const Pagination = ({ pages }:PaginationProps) => {
  // const [stateFilter,setPageNumber] = useAtom(filterState)
  // const [pageNumber,setPageNumber] = useState(1)
  const router = useRouter()
  const searchParam = useSearchParams()
  //Set number of pages
  const pageNumber = Number(searchParam?.get('page')) || 1
  const numberOfPages: string[] = []
  for (let i = 1; i <= pages; i++) {
    numberOfPages.push(String(i))
  }
  const [,setLoading] = useState(false)
  // Current active button number

  // Array of buttons what we see on the page
  const [arrOfCurrButtons, setArrOfCurrButtons] = useState<string[]>([])
  useEffect(() => {
    setLoading(true)
    let tempNumberOfPages:string[] = [...arrOfCurrButtons]
    const dotsInitial = '...'
    const dotsLeft = '... '
    const dotsRight = ' ...'

    if (numberOfPages.length < 6) {
      tempNumberOfPages = numberOfPages
    }

    else if (Number(pageNumber) >= 1 && Number(pageNumber) <= 3) {
      tempNumberOfPages = [String(1), String(2), String(3),String(4), dotsInitial, String(numberOfPages.length)]
    }

    else if (Number(pageNumber) === 4) {
      const sliced = numberOfPages.slice(0,5)
      tempNumberOfPages = [...sliced, dotsInitial.toString(), String(numberOfPages.length)]
    }

    else if (Number(pageNumber) > 4 && (Number(pageNumber) < (numberOfPages.length - 2))) {               
      // from 5 to 8 -> (10 - 2)
      const sliced1 = numberOfPages.slice(Number(pageNumber) - 2, Number(pageNumber))                 
      // sliced1 (5-2, 5) -> [4,5] 
      const sliced2 = numberOfPages.slice(Number(pageNumber), Number(pageNumber) + 1)                 
      // sliced1 (5, 5+1) -> [6]
      tempNumberOfPages = ([String(1), dotsLeft.toString(), ...sliced1, ...sliced2, dotsRight.toString(), String(numberOfPages.length)]) 
      // [1, '...', 4, 5, 6, '...', 10]
    }
    
    else if (Number(pageNumber) > (numberOfPages.length - 3)) {                 
      // > 7
      const sliced = numberOfPages.slice(numberOfPages.length - 4)       
      // slice(10-4) 
      tempNumberOfPages = ([String(1), dotsLeft.toString(), ...sliced]) 

    }
    setArrOfCurrButtons(tempNumberOfPages)
    setLoading(false)
    setGoto(Number(pageNumber))
  }, [pages,pageNumber])
  const [,setGoto] = useState(Number(pageNumber))
  return (
    <>
      <div className="w-full flex flex-col items-center justify-center py-3 pb-10 gap-3">
        <div className='flex items-center justify-center w-full gap-1'>
          {arrOfCurrButtons.map(((item, index) => (
            <div key={index}>
            {item!=="," &&
              <button
              className={`${Number(pageNumber) === Number(item) ? 'bg-zinc-700 text-zinc-100' : ''} flex items-center justify-center py-2 px-4 text-xs border border-zinc-700`}
              onClick={async() => {
                if(item==="... "){
                  window.scroll({
                    top: 0,
                    left: 0,
                    behavior: 'smooth'
                  });
                  await router.push(`${Boolean(router.query.id) ?`${String(router.asPath).split('?')[0]}?page=${String(Number(pageNumber) - 3)}`:`?page=${String(Number(pageNumber) - 3)}`}`)
                  return
                }
                if(item===" ..."){
                  window.scroll({
                    top: 0,
                    left: 0,
                    behavior: 'smooth'
                  });
                  await router.push(`${Boolean(router.query.id) ?`${String(router.asPath).split('?')[0]}?page=${String(Number(pageNumber) + 3)}`:`?page=${String(Number(pageNumber) + 3)}`}`)

                  return
                }
                if(item==="..."){
                  window.scroll({
                    top: 0,
                    left: 0,
                    behavior: 'smooth'
                  });
                  await router.push(`${Boolean(router.query.id) ?`${String(router.asPath).split('?')[0]}?page=${String(Number(pageNumber) + 3)}`:`?page=${String(Number(pageNumber) + 3)}`}`)
                  return
                }
                window.scroll({
                  top: 0,
                  left: 0,
                  behavior: 'smooth'
                });
                await router.push(`${Boolean(router.query.id) ?`${String(router.asPath).split('?')[0]}?page=${String(Number(item))}`:`?page=${String(Number(item))}`}`)
              }}
            >
              {item}
            </button>
            }
          </div>
          )))}
        </div>
      </div>
      
    </>
  );
}


export default Pagination
