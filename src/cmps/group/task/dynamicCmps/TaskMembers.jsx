import React from 'react'
import { Avatar, AvatarGroup } from 'monday-ui-react-core'

function TaskMembers({ task, members, onUpdateField }) {
    const avatars = task.memberIds.map(memberId => {
        const member = members.find(member => member._id === memberId)
        const fullName = member ? member.fullname : 'Unknown'
        const nameParts = fullName.split(' ')
        const initials =
            nameParts.length >= 2
                ? `${nameParts[0].charAt(0).toUpperCase()}${nameParts[1].charAt(0).toUpperCase()}`
                : fullName.charAt(0).toUpperCase()

        return member && member.imageUrl ? (
            <Avatar
                key={memberId}
                ariaLabel={fullName}
                src={member.imageUrl}
                type='img'
                size='small'
                onClick={() => {
                    const newMemberId = prompt('Enter new member ID', memberId)
                    if (newMemberId) {
                        const newMemberIds = task.memberIds.map(id => (id === memberId ? newMemberId : id))
                        onUpdateField(task, 'memberIds', newMemberIds)
                    }
                }}
            />
        ) : (
            <Avatar
                key={memberId}
                ariaLabel={fullName}
                text={initials}
                type='text'
                size='small'
                backgroundColor={Avatar.colors.AQUAMARINE}
                onClick={() => {
                    const newMemberId = prompt('Enter new member ID', memberId)
                    if (newMemberId) {
                        const newMemberIds = task.memberIds.map(id => (id === memberId ? newMemberId : id))
                        onUpdateField(task, 'memberIds', newMemberIds)
                    }
                }}
            />
        )
    })

    return (
        <AvatarGroup max={3} size='small'>
            {avatars}
        </AvatarGroup>
    )
}

export default TaskMembers
