import { Avatar, Dialog, DialogContentContainer } from 'monday-ui-react-core'
import { Person } from 'monday-ui-react-core/icons'

import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'

export function GroupPersonFilter({ setFilterBy }) {
  const [avatars, setAvatars] = useState({})
  const { boardId } = useParams()
  const currBoard = useSelector((storeState) =>
    storeState.boardModule.boards.find((board) => board._id === boardId)
  )
  const [isPersoneActiv, setIsPersoneActiv] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
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

  function onClearPerson() {
    setIsPersoneActiv(false)
    setIsDialogOpen(false)
    setFilterBy(groups)
  }

  function getMember(memberId) {
    setIsPersoneActiv(true)
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
    <div className="monday-storybook-dialog--story-padding">
      <Dialog
        content={
          <DialogContentContainer>
            <section className="person-modal">
              <section className="header-avatar">
                <div className="title-avatar">
                  <p id="modal-title">Filter this board by person</p>
                  <p>And find items they're working on.</p>
                </div>
              </section>
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
          </DialogContentContainer>
        }
        hideTrigger={['clickoutside']}
        modifiers={[
          {
            name: 'preventOverflow',
            options: {},
          },
        ]}
        position="bottom"
        showTrigger={['click']}
      >
        <div
          style={{ padding: '4px', cursor: 'pointer' }}
          icon={function noRefCheck() {}}
          className={`filter-item person ${isPersoneActiv ? 'active' : ''}`}
          // onClick={() => setIsDialogOpen(true)}
        >
          <Person />
          Person
          {isPersoneActiv && (
            <div className="clear-person" onClick={onClearPerson}>
              <i class="fa-solid fa-xmark" style={{ padding: '2px 4px' }}></i>
            </div>
          )}
        </div>
      </Dialog>
    </div>
  )
}
