import React, { useState } from 'react'
import { addBoard } from '../store/actions/board.action'
import { useNavigate } from 'react-router'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { boardService } from '../services/board'

export function AddBoard({ isOpen, onClose }) {
  const [boardTitle, setBoardTitle] = useState('')
  const [labelType, setLabelType] = useState('')
  const navigate = useNavigate()

  async function onAddBoard() {
    try {
      const board = await addBoard(boardTitle, labelType)
      showSuccessMsg(`Board added (id: ${board._id})`)
      console.log(board)
      onClose()
      navigate(`/board/${board._id}`)
    } catch (err) {
      showErrorMsg('Cannot add board')
    }
  }

  const labelOptions = [
    'Items',
    'Budget',
    'Employees',
    'Campaigns',
    'Leads',
    'Projects',
    'Creatives',
    'Clients',
    'Tasks',
    'Custom',
  ]

  if (!isOpen) return null

  return (
    <div className='modal-overlay'>
      <div className='modal-content'>
        <h2>Create Board</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            onAddBoard()
          }}>
          <div className='form-group'>
            <label htmlFor='boardTitle'>Board Name</label>
            <input
              id='boardTitle'
              type='text'
              value={boardTitle}
              onChange={(e) => setBoardTitle(e.target.value)}
              placeholder='Enter board name'
              required
            />
          </div>
          <div className='form-group'>
            <div>Select what you're managing in this board:</div>
            {labelOptions.map((option) => (
              <label key={option} style={{ display: 'block', marginBottom: '8px' }}>
                <input
                  type='radio'
                  value={option}
                  checked={labelType === option}
                  onChange={() => setLabelType(option)}
                />
                {option}
              </label>
            ))}
          </div>
          <div className='form-actions'>
            <button type='submit'>Create Board</button>
            <button type='button' onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
