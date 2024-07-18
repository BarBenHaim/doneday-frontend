import { Link, NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { MenuItem, Menu, MenuDivider, DialogContentContainer } from 'monday-ui-react-core'
import { Favorite, Home } from 'monday-ui-react-core/icons'

export function Sidebar() {
  const navigate = useNavigate();


 function handleOnClick(route) {
  navigate(route)
 }
 
  return (
    <div className="sidebar">
    <DialogContentContainer>
      <Menu>
      <MenuItem icon={Home} title='Home'  onClick={() => handleOnClick('/board')} />

        <MenuItem icon={Favorite} title='Favorite'  />
        <MenuDivider />
      </Menu>
    </DialogContentContainer>
    </div>

  )
}
