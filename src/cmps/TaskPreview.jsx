import React from 'react'

function TaskPreview({ task, members, labels }) {
    return (
        <div className='task-preview '>
            <h4>{task.title}</h4>
            <p>Status: {task.status || ''}</p>
            <p>Priority: {task.priority || ''}</p>
            <p>Due Date: {task.dueDate || ''}</p>
            <p>Description: {task.description || ''}</p>
            <p>
                Members:{' '}
                {task.memberIds.length > 0
                    ? task.memberIds
                          .map(id => {
                              const member = members.find(member => member._id === id)
                              return member ? member.fullname : ''
                          })
                          .join(', ')
                    : ''}
            </p>
            <p>
                Labels:{' '}
                {task.labelIds.length > 0
                    ? task.labelIds
                          .map(id => {
                              const label = labels.find(label => label._id === id)
                              return label ? label.title : ''
                          })
                          .join(', ')
                    : ''}
            </p>
            <p>Comments:</p>
            <ul>
                {task.comments.length > 0
                    ? task.comments.map(comment => (
                          <li key={comment._id}>
                              <p>{comment.title}</p>
                              <p>By: {comment.byMember ? comment.byMember.fullname : ''}</p>
                              <p>At: {new Date(comment.createdAt).toLocaleString()}</p>
                          </li>
                      ))
                    : 'No comments'}
            </ul>
            <p>Checklists:</p>
            <ul>
                {task.checklists.length > 0
                    ? task.checklists.map(checklist => (
                          <li key={checklist._id}>
                              <p>{checklist.title}</p>
                              <ul>
                                  {checklist.todos.map(todo => (
                                      <li key={todo._id}>
                                          <p>
                                              {todo.title} - {todo.isDone ? 'Done' : 'Not Done'}
                                          </p>
                                      </li>
                                  ))}
                              </ul>
                          </li>
                      ))
                    : 'No checklists'}
            </ul>
        </div>
    )
}

export default TaskPreview
