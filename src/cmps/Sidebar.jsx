import { Link, NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { MenuItem, Menu, MenuDivider, DialogContentContainer } from 'monday-ui-react-core'
import { Favorite, Home } from 'monday-ui-react-core/icons'
import { useState } from 'react'


export function Sidebar() {
  const navigate = useNavigate()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const boards = useSelector((storeState) => storeState.boardModule.boards)
  const starredBoards = boards.filter((board) => board.isStarred)

  function handleOnClick(route) {
    navigate(route)
  }

  function toggleCollapse() {
    setIsCollapsed(!isCollapsed)
}

  return (
    <div className='sidebar main-container'>
      <DialogContentContainer>
        <Menu>
          <MenuItem icon={Home} title='Home' onClick={() => handleOnClick('/board')} />
          <MenuItem icon={Favorite} title='Favorite' onClick={() => toggleCollapse()} />

          {starredBoards.map((board) => (
            <MenuItem key={board._id} title={board.title} onClick={() => handleOnClick(`/board/${board._id}`)} />
          ))}
          <MenuDivider />
        </Menu>
      </DialogContentContainer>
    </div>
  )
}
