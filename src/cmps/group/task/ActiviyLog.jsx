import moment from 'moment'
import { Avatar } from 'monday-ui-react-core'
import { Time } from 'monday-ui-react-core/icons'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'

export function ActivityLog({ task }) {
  const { boardId } = useParams()
  const currBoard = useSelector((storeState) =>
    storeState.boardModule.boards.find((board) => board._id === boardId)
  )
  const groups = currBoard.groups || []
  const tasks = groups.flatMap((group) => group.tasks || [])
  console.log(tasks)

  return (
    <section className="activity-list">
      {tasks.map((task, taskIndex) =>
        task.comments.map((comment, commentIndex) => (
          <div
            key={`${taskIndex}-${commentIndex}`}
            className="comment-activity"
          >
            <span className="comment-time-activity">
              <Time />
              {moment(comment.createdAt).fromNow()}
            </span>
            <Avatar
              ariaLabel={comment.byMember.fullname}
              size={Avatar.sizes.LARGE}
              src={comment.byMember.imgUrl}
              type={Avatar.types.IMG}
              className="custom-avatar-activity"
              aria-hidden="true"
            />
            <p className="comment-text-activity">{comment.title}</p>
          </div>
        ))
      )}
    </section>
  )
}
