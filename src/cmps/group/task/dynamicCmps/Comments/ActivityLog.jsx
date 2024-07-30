import moment from 'moment'
import { Avatar } from 'monday-ui-react-core'
import { useEffect, useState } from 'react'

export function ActivityLog({ activities }) {
    if (!activities || activities.length === 0) return null

    console.log('activities', activities)
    return (
        <section>
            <ul>
                {activities.map((activity, idx) => (
                    <li key={idx}>
                        <div>
                            {/* <Avatar
                            ariaLabel={activity.user.fullname}
                            size={Avatar.sizes.MEDIUM}
                            src={activity.user.imgUrl}
                            type={Avatar.types.IMG}
                            className='custom-avatar'
                            aria-hidden='true'
                            tabIndex={2}
                        /> */}
                        </div>
                        <span className='active-time'>{moment(activity.createdAt).fromNow()}</span>
                        <p>
                            {activity.action} {activity.entity}
                        </p>
                    </li>
                ))}
            </ul>
        </section>
    )
}
