import moment from 'moment'
import { Avatar } from 'monday-ui-react-core'
import { useEffect, useState } from 'react'

export function ActivityLog({ activities, users }) {
    if (!activities || activities.length === 0) return null

    console.log('users', users)

    const getUserById = (userId) => {
        return users.find(user => user._id === userId);
    };
    console.log('activities', activities)

    return (
        <section>
        <ul>
            {activities.map((activity, idx) => {
                const user = getUserById(activity.userId);
                return (
                    <li key={idx}>
                        <div>
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
                        <span className='active-time'>{moment(activity.createdAt).fromNow()}</span>
                        <p>
                            {activity.action} {activity.entity}
                        </p>
                    </li>
                );
            })}
        </ul>
    </section>
);
}