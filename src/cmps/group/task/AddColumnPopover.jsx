import React, { useState, useMemo } from 'react'
import { Popover, Box, Typography } from '@mui/material'
import { Combobox, IconButton } from 'monday-ui-react-core'
import { Add } from 'monday-ui-react-core/icons'
import 'monday-ui-react-core/dist/main.css'

const AddColumnPopover = ({ predefinedLabels, handleAddColumn }) => {
    const [anchorEl, setAnchorEl] = useState(null)

    const options = useMemo(
        () =>
            predefinedLabels.map((label, index) => ({
                id: String(index + 1),
                label,
            })),
        [predefinedLabels]
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
        handleAddColumn(option.label)
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
                <Box p={2}>
                    <Typography variant='h6'>Select Column Type</Typography>
                    <Combobox
                        options={options}
                        placeholder='Select a column label'
                        onClick={handleSelect}
                        size='small'
                    />
                </Box>
            </Popover>
        </div>
    )
}

export default AddColumnPopover
