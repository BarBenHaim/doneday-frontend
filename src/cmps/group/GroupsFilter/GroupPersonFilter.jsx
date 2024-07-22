import { Avatar } from 'monday-ui-react-core'

import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'

export function GroupPersonFilter({ setFilterBy }) {
  const [avatars, setAvatars] = useState({})
  const { boardId } = useParams()
  const currBoard = useSelector((storeState) =>
    storeState.boardModule.boards.find((board) => board._id === boardId)
  )

  const groups = currBoard?.groups || []
  const tasks = groups.flatMap((group) => group.tasks || [])
  const memberIds = tasks.flatMap((task) => task.memberIds)
  console.log(currBoard.members)

  useEffect(() => {
    if (currBoard) {
      const avatarsMap = {}

      currBoard.members.forEach((member) => {
        avatarsMap[member._id] = {
          imgUrl: member.imgUrl,
          name: member.fullname,
        }
      })

      if (currBoard.createdBy && currBoard.createdBy._id) {
        avatarsMap[currBoard.createdBy._id] = {
          imgUrl: currBoard.createdBy.imgUrl,
          name: currBoard.createdBy.fullname,
        }
      }

      setAvatars(avatarsMap)
    }
  }, [currBoard])

  function getMember(memberId) {
    const filteredGroups = groups.map((group) => {
      const filteredTasks = group.tasks.filter(
        (task) =>
          (Array.isArray(task.byMember) && task.byMember.includes(memberId)) ||
          (Array.isArray(task.memberIds) && task.memberIds.includes(memberId))
      )
      return {
        ...group,
        tasks: filteredTasks,
      }
    })
    const nonEmptyGroups = filteredGroups.filter(
      (group) => group.tasks.length > 0
    )

    setFilterBy(nonEmptyGroups)

    return nonEmptyGroups
  }

  return (
    <section className="person-modal">
      <p id="modal-title">Filter this board by person</p>
      <p>And find items they're working on.</p>
      <div className="members">
        {[...new Set(memberIds)].map((memberId, index) => (
          <div
            className="member"
            key={index}
            onClick={() => getMember(memberId)}
          >
            {avatars[memberId] && (
              <Avatar
                key={memberId}
                ariaLabel={avatars[memberId].name}
                size={Avatar.sizes.MEDIUM}
                src={avatars[memberId].imgUrl}
                type={Avatar.types.IMG}
                className="custom-avatar"
                aria-hidden="true"
              />
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
