import React, { useState } from 'react'
import { addBoard } from '../store/actions/board.action'
import { useNavigate } from 'react-router'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { boardService } from '../services/board'
import { Modal, ModalContent, ModalFooterButtons, RadioButton, TextField } from 'monday-ui-react-core'

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
        'Budgets',
        'Employees',
        'Campaigns',
        'Leads',
        'Projects',
        'Creatives',
        'Clients',
        'Tasks',
        'Custom'
    ]

    if (!isOpen) return null

    return (
        <div className='modal-overlay'>
            <div className='modal-content'>
                <Modal
                    contentSpacing
                    id='story-book-modal'
                    title='Create board'
                    show={isOpen}
                    onClose={onClose}
                    closeButtonAriaLabel={'close'}
                    width={Modal.width.DEFAULT}>
                    <ModalContent>
                        <TextField
                         id='boardTitle'
                            placeholder='New Board'
                            title='Board name'
                            wrapperClassName='monday-storybook-text-field_size'
                            value={boardTitle}
                            onChange={(e) => setBoardTitle(e.target.value)}
                        />
                          <div className='form-group'>
            <div>Select what you're managing in this board:</div>
            {labelOptions.map((option) => (
              <label key={option} style={{ display: 'block', marginBottom: '8px' }}>
                <input
                  type='radio'
                  value={option}
                  checked={labelType === option}
                  onChange={(e) => setLabelType(e.target.value)}
                />
                {option}
              </label>
            ))}
                        </div>
                        <ModalFooterButtons
                            onPrimaryButtonClick={onAddBoard}
                            onSecondaryButtonClick={onClose}
                            primaryButtonText='Create Board'
                            secondaryButtonText='Cancel'
                        />
                    </ModalContent>
                </Modal>
            </div>
        </div>
    )
}
