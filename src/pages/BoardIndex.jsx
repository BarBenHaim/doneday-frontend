import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import {
  NavigationChevronDown,
  NavigationChevronRight,
} from 'monday-ui-react-core/icons'

import {
  addBoard,
  loadBoards,
  removeBoard,
} from '../store/actions/board.action'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'

import { BoardList } from '../cmps/BoardList'
import { DialogContentContainer } from 'monday-ui-react-core'


// import { GroupFilter } from '../cmps/group/GroupFilter'

export function BoardIndex() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const boards = useSelector((storeState) => storeState.boardModule.boards)
  const groupTaskFilterBy = useSelector(
    (storeState) => storeState.boardModule.groupTaskFilterBy
  )
  useEffect(() => {
    loadBoards()
  }, [])

  async function onRemoveBoard(boardId) {
    try {
      await removeBoard(boardId)
      showSuccessMsg('board removed')
    } catch (err) {
      showErrorMsg('Cannot remove board')
    }
  }

  async function handleSetFilterBy(ev) {
    const value = ev.target.value
  }

  function toggleCollapse() {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <section className="board-index">
      {/* <GroupFilter
        filterBy={groupTaskFilterBy}
        setFilterBy={handleSetFilterBy}
      /> */}
      <DialogContentContainer size="medium"  type="modal">
      <div
        className="collapsible-header flex align-center"
        onClick={toggleCollapse}
      >
        {isCollapsed ? (
          <NavigationChevronRight size="18" lable="Expand list" />
        ) : (
          <NavigationChevronDown size="18" lable="Collapse list" />
        )}
        <h1 className="collapsible-title">Recently visited</h1>
      </div>
      {!isCollapsed && (
        <BoardList boards={boards} onRemoveBoard={onRemoveBoard} />
      )}
      </DialogContentContainer>
    </section>
  )
}
