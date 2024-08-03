import moment from 'moment'
import { Avatar, Icon } from 'monday-ui-react-core'
import { Time } from 'monday-ui-react-core/icons'
import { useEffect, useState } from 'react'

export function ActivityLog({ activities, users, currBoard  }) {
    if (!activities || activities.length === 0) return null
    const sortedActivities = [...activities].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));


    const getUserById = (userId) => {
        return users.find((user) => user._id === userId)
    }

    const formatDuration = (timestamp) => {
        const now = moment()
        const duration = moment.duration(now.diff(timestamp))

        const seconds = Math.floor(duration.asSeconds())
        const minutes = Math.floor(duration.asMinutes())
        const hours = Math.floor(duration.asHours())
        const days = Math.floor(duration.asDays())
        const weeks = Math.floor(duration.asWeeks())
        const months = Math.floor(duration.asMonths())

        if (seconds < 60) return `${seconds}s`
        if (minutes < 60) return `${minutes}m`
        if (hours < 24) return `${hours}h`
        if (days < 7) return `${days}d`
        if (weeks < 4) return `${weeks}w`
        return `${months}m`
    }
    
    const getEntityTitleById = (entityId) => {
        const { groups } = currBoard

        for (let group of groups) {
            for (let task of group.tasks) {
                if (task._id === entityId) return task.title
            }
            if (group._id === entityId) return group.title
        }

        if (currBoard._id === entityId) return currBoard.title

        for (let group of groups) {
            for (let task of group.tasks) {
                for (let comment of task.comments || []) {
                    if (comment._id === entityId) return comment.title
                }
            }
        }

        return 'Unknown Entity'
    }


    return (
        <section>
            <ul>
                <div className='activity-container'>
                    {sortedActivities.map((activity, idx) => {
                        const user = getUserById(activity.userId)
                        const entityTitle = getEntityTitleById(activity.entityId)
                        return (
                            <li key={idx}>
                                <div className='activity-container-active-time'>
                                    <Icon
                                        iconType={Icon.type.SVG}
                                        icon={Time}
                                        iconSize={14}
                                        clickable={false}
                                    />
                                    <span>{formatDuration(activity.timestamp)}</span>
                                </div>

                                <div className='activity-container-avatar'>
                                    {user && (
                                        <Avatar
                                            ariaLabel={user.fullname}
                                            size={Avatar.sizes.MEDIUM}
                                            src={user.imgUrl}
                                            type={Avatar.types.IMG}
                                            className='custom-avatar'
                                            aria-hidden='true'
                                            tabIndex={2}
                                        />
                                    )}
                                    <span>{entityTitle}</span>
                                </div>

                                <div className='activity-container-activity'>
                                    <p>
                                        {activity.action} {activity.entity}
                                    </p>
                                </div>
                            </li>
                        )
                    })}
                </div>
            </ul>
        </section>
    )
}
