import { Link, NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { MenuItem, Menu, MenuDivider, DialogContentContainer } from 'monday-ui-react-core'
import { Favorite, Home } from 'monday-ui-react-core/icons'

export function Sidebar() {
  return (
    <DialogContentContainer>
      <Menu>
      <MenuItem icon={Home} title='Home'  />

        <MenuItem icon={Favorite} title='Favorite'  />
        <MenuDivider />
      </Menu>
    </DialogContentContainer>
  )
}
