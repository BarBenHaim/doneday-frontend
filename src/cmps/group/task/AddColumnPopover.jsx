import React, { useState, useMemo } from 'react'
import { Popover, Box, Typography } from '@mui/material'
import { Combobox, IconButton } from 'monday-ui-react-core'
import { Add, Info, Person } from 'monday-ui-react-core/icons'
import 'monday-ui-react-core/dist/main.css'

const AddColumnPopover = ({ predefinedLabels, handleAddColumn }) => {
    const [anchorEl, setAnchorEl] = useState(null)

    const labelMapping = {
        dueDate: { label: 'Timeline', leftIcon: Info, color: 'blue', fill: '#0000ff' },
        checklists: { label: 'Checklist', leftIcon: Add, color: 'green', fill: '#00ff00' },
        memberIds: { label: 'Collaborators', leftIcon: Person, color: 'red', fill: '#ff0000' },
        priority: { label: 'Priority', leftIcon: Person, color: 'purple', fill: '#800080' },
        status: { label: 'Status', leftIcon: Person, color: 'orange', fill: '#ffa500' },
        description: { label: 'Description', leftIcon: Person, color: 'brown', fill: '#a52a2a' },
        files: { label: 'Files', leftIcon: Person, color: 'pink', fill: '#ffc0cb' },
        default: { label: 'Some Title', leftIcon: Person, color: 'gray', fill: '#808080' },
    }

    const options = useMemo(
        () =>
            predefinedLabels
                .filter(label => label !== 'title')
                .map((label, index) => ({
                    id: String(index + 1),
                    label: labelMapping[label]?.label || labelMapping.default.label,
                    leftIcon: labelMapping[label]?.leftIcon || labelMapping.default.leftIcon,
                    color: labelMapping[label]?.color || labelMapping.default.color,
                    fill: labelMapping[label]?.fill || labelMapping.default.fill,
                    value: label,
                })),
        [predefinedLabels, labelMapping]
    )

    const handleClick = event => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const open = Boolean(anchorEl)
    const id = open ? 'simple-popover' : undefined

    const handleSelect = option => {
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
                    horizontal: 'left',
                }}
                disableEnforceFocus
                disableRestoreFocus
                PaperProps={{
                    style: { width: '250px', padding: '10px' },
                }}
            >
                <Box p={1}>
                    <Typography variant='h6'>Select Column Type</Typography>
                    <Combobox
                        options={options}
                        placeholder='Select a column label'
                        onClick={handleSelect}
                        size='small'
                        renderOption={option => (
                            <Box display='flex' alignItems='center'>
                                <option.leftIcon style={{ color: option.color, fill: option.fill }} />
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
