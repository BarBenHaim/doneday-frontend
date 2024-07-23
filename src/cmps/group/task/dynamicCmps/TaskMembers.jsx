import React, { useState, useEffect } from 'react'
import { Dialog, DialogContentContainer, Avatar, Search, Flex, Text, Box } from 'monday-ui-react-core'
import { cellStyle } from './styleUtils'

const TaskMembers = ({ task, members, onUpdateField, columnKey }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedMembers, setSelectedMembers] = useState(task[columnKey] || [])
    const [searchQuery, setSearchQuery] = useState('')

    const handleMemberChange = memberId => {
        const newMemberIds = selectedMembers.includes(memberId)
            ? selectedMembers.filter(id => id !== memberId)
            : [...selectedMembers, memberId]

        onUpdateField(task, columnKey, newMemberIds)
        setSelectedMembers(newMemberIds)
    }

    useEffect(() => {
        setSelectedMembers(task[columnKey] || [])
    }, [task[columnKey]])

    const filteredMembers = members.filter(member => member.fullname.toLowerCase().includes(searchQuery.toLowerCase()))

    const avatars = selectedMembers
        .map(memberId => {
            const member = members.find(member => member._id === memberId)
            if (!member) return null
            const fullName = member.fullname || 'Unknown'
            const initials = fullName
                .split(' ')
                .map(name => name.charAt(0).toUpperCase())
                .join('')

            return member.imgUrl ? (
                <Avatar key={memberId} ariaLabel={fullName} src={member.imgUrl} type='img' size='small' />
            ) : (
                <Avatar
                    key={memberId}
                    ariaLabel={fullName}
                    text={initials}
                    type='text'
                    size='small'
                    backgroundColor={Avatar.colors.AQUAMARINE}
                />
            )
        })
        .filter(Boolean)

    return (
        <div style={cellStyle}>
            <Dialog
                zIndex={2}
                isOpen={isDialogOpen}
                onDialogDidHide={() => setIsDialogOpen(false)}
                content={
                    <DialogContentContainer>
                        <Search
                            placeholder='Search names, roles, or teams'
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                        <Box padding={3}>
                            <Text type={Text.types.TEXT1}>Suggested people</Text>
                            <div className='searchResults'>
                                {filteredMembers.map((member, index) => {
                                    const isSelected = selectedMembers.includes(member._id)
                                    return (
                                        <Flex
                                            align={Flex.align.CENTER}
                                            justify={Flex.justify.START}
                                            key={`cont-${index}`}
                                            onClick={() => handleMemberChange(member._id)}
                                            style={{
                                                backgroundColor: isSelected ? '#e0f7fa' : 'transparent',
                                                cursor: 'pointer',
                                                padding: '5px',
                                                borderRadius: '5px',
                                                margin: '5px 0',
                                            }}
                                        >
                                            {member.imgUrl ? (
                                                <Avatar
                                                    size={Avatar.sizes.SMALL}
                                                    src={member.imgUrl}
                                                    ariaLabel={member.fullname}
                                                    type='img'
                                                />
                                            ) : (
                                                <Avatar
                                                    size={Avatar.sizes.SMALL}
                                                    text={member.fullname
                                                        .split(' ')
                                                        .map(n => n[0])
                                                        .join('')
                                                        .toUpperCase()}
                                                    ariaLabel={member.fullname}
                                                    type='text'
                                                    backgroundColor={Avatar.colors.AQUAMARINE}
                                                />
                                            )}
                                            <Text
                                                type={Text.types.TEXT2}
                                                className='name'
                                                style={{ marginLeft: '10px' }}
                                            >
                                                {member.fullname}{' '}
                                                <span>({member.position || member.email || 'No position'})</span>
                                            </Text>
                                        </Flex>
                                    )
                                })}
                            </div>
                        </Box>
                    </DialogContentContainer>
                }
                hideTrigger={['clickoutside']}
                position='bottom'
                showTrigger={['click']}
            >
                <div style={{ width: '100%', textAlign: 'center' }} onClick={() => setIsDialogOpen(true)}>
                    {avatars.length > 0 ? (
                        <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                            {avatars.slice(0, 1)}
                            {avatars.length > 1 && (
                                <Avatar
                                    size={Avatar.sizes.SMALL}
                                    type={Avatar.types.TEXT}
                                    text={`+${avatars.length - 1}`}
                                    backgroundColor={Avatar.colors.BLACKISH}
                                    style={{
                                        position: 'absolute',
                                        right: 0,
                                    }}
                                />
                            )}
                        </div>
                    ) : (
                        <Avatar
                            ariaLabel='No Members'
                            text='+'
                            type='text'
                            size='small'
                            backgroundColor={Avatar.colors.BLACKISH}
                        />
                    )}
                </div>
            </Dialog>
        </div>
    )
}

export default TaskMembers
