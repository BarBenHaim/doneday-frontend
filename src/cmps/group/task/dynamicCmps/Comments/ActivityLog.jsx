import moment from 'moment'
import { Avatar } from 'monday-ui-react-core'
import { useEffect, useState } from 'react'

export function ActivityLog({ activities, users }) {
    if (!activities || activities.length === 0) return null

    console.log('users', users)
    console.log('activity time', activities.createdAt)

    const getUserById = (userId) => {
        return users.find(user => user._id === userId)
    }


    return (
        <section>
        <ul>
            <div className="activity-container">
            {activities.map((activity, idx) => {
                const user = getUserById(activity.userId);
                return (
                    <li key={idx}>
                        <div className="activity-container-avatar">
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
                        </div>
                        <span className='activity-container-user-name'>{user.fullname}</span>
                        <span className='activity-container-active-time'>{moment(activity.timestamp).fromNow()}</span>
                        <div className='activity-container-activity'>
                        <p>
                            {activity.action} {activity.entity}
                        </p>
                        </div>
                    </li>
                );
            })}
            </div>
        </ul>
    </section>
);
}