import React, { createContext, useContext, useMemo } from 'react'
import ListGroup from './ListGroup'
import { mutateListTabs, useLists } from '../../../service'
import { DragDropContext } from 'react-beautiful-dnd'
import { reorderTab, reorderTabLocally } from 'src/app/service/reorder'
import type { KeyedMutator } from 'swr/dist/types'
import __ from 'src/common/util/i18n'

const DetailListContext = createContext<{
  mutate?: KeyedMutator<any>
}>({})

export const useDetailListContext = () => useContext(DetailListContext)

const DetailList = () => {
  const { data, mutate } = useLists()

  const ctxValue = useMemo(() => {
    return { mutate }
  }, [mutate])

  return (
    <DetailListContext.Provider value={ctxValue}>
      <div>
        <DragDropContext
          onDragEnd={async result => {
            console.log('drop result', result)
            const { draggableId, source, destination } = result
            if (!destination) return
            reorderTabLocally(
              draggableId,
              source.droppableId,
              destination.droppableId,
              destination.index,
            )
            await reorderTab(
              draggableId,
              source.droppableId,
              destination.droppableId,
              destination.index,
            )
            mutateListTabs([source.droppableId])
            mutateListTabs([destination.droppableId])
          }}
        >
          {data &&
            (data.result.length ? (
              data?.result.map(list => {
                console.log(list)
                return <ListGroup key={list.id} list={list} />
              })
            ) : (
              <div className="flex flex-col items-center text-gray-500">
                <h3 className="text-4xl my-4">{__('ui_no_list')}</h3>
                <p className="text-lg" dangerouslySetInnerHTML={{ __html: __('ui_no_list_tip') }} />
              </div>
            ))}
        </DragDropContext>
      </div>
    </DetailListContext.Provider>
  )
}

export default DetailList
