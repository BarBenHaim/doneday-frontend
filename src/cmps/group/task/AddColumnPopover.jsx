import React, { useState, useMemo } from 'react'
import { Popover, Box, Typography } from '@mui/material'
import { Combobox, IconButton } from 'monday-ui-react-core'
import {
  Add,
  CheckList,
  Description,
  //   DueDate,
  //   File,
  Person,
  Recurring,
  //   Status,
  Team,
} from 'monday-ui-react-core/icons'
import 'monday-ui-react-core/dist/main.css'
import {
  Status,
  Priority,
  Timeline,
  Files,
  Collaborators,
  Txt,
  Number,
} from '../../svgs/TaskSvg'

const AddColumnPopover = ({ predefinedLabels, handleAddColumn }) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const labelMapping = {
    dueDate: { label: 'Timeline', leftIcon: Timeline },
    checklists: { label: 'Checklist', leftIcon: Number },
    memberIds: { label: 'Collaborators', leftIcon: Collaborators },
    status: { label: 'Status', leftIcon: Status },
    description: { label: 'Description', leftIcon: Txt },
    files: { label: 'Files', leftIcon: Files },
    recording: { label: 'Recording', leftIcon: Recurring },
    priority: { label: 'Priority', leftIcon: Person },
    default: { label: 'Some Title', leftIcon: Collaborators },
  }

  const options = useMemo(
    () =>
      predefinedLabels
        .filter((label) => label !== 'title' && label !== 'checkbox')
        .map((label, index) => ({
          id: String(index + 1),
          label: labelMapping[label]?.label || labelMapping.default.label,
          leftIcon:
            labelMapping[label]?.leftIcon || labelMapping.default.leftIcon,
          color: labelMapping[label]?.color || labelMapping.default.color,
          fill: labelMapping[label]?.fill || labelMapping.default.fill,
          value: label,
        })),
    [predefinedLabels, labelMapping]
  )

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  const handleSelect = (option) => {
    handleAddColumn(option.value)
    handleClose()
  }

  return (
    <div>
      <IconButton icon={Add} size={'small'} onClick={handleClick} />

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        disableEnforceFocus
        disableRestoreFocus
        PaperProps={{
          style: { width: '250px', padding: '10px' },
        }}
      >
        <Box p={1}>
          <Combobox
            options={options}
            placeholder="Search"
            onClick={handleSelect}
            size="small"
            renderOption={(option) => (
              <Box display="flex" alignItems="center">
                <option.leftIcon
                  style={{ color: option.color, fill: option.fill }}
                />
                <Box ml={1}>{option.label}</Box>
              </Box>
            )}
          />
        </Box>
      </Popover>
    </div>
  )
}

export default AddColumnPopover
