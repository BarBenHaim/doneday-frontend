import { useSelector } from 'react-redux'
import { useParams } from 'react-router'

export function ActivityLog() {
  const { boardId } = useParams()
  const currBoard = useSelector((storeState) =>
    storeState.boardModule.boards.find((board) => board._id === boardId)
  )
  const groups = currBoard.groups || []
  const tasks = groups.flatMap((group) => group.tasks || [])
  const activities = currBoard.activities
  return (
    <sectio>
      <ul>
        {activities.map((active) => (
          <li>
            <span className="active-time">
              {moment(active.createdAt).fromNow()}
            </span>
            <p>{ta}</p>
          </li>
        ))}
      </ul>
    </sectio>
  )
}
