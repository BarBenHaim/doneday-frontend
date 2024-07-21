import React, { useCallback, useState } from 'react'
import { addBoard } from '../store/actions/board.action'
import { useNavigate } from 'react-router'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import {
    Divider,
    EditableText,
    Modal,
    ModalContent,
    ModalFooterButtons,
    RadioButton,
    TextField,
} from 'monday-ui-react-core'

export function AddBoard({ isOpen, onClose }) {
    const [boardTitle, setBoardTitle] = useState('')
    const [labelType, setLabelType] = useState('Task')
    const [customLabel, setCustomLabel] = useState('Custom')
    const navigate = useNavigate()

    async function onAddBoard() {
        try {
            const board = await addBoard(boardTitle, labelType)
            console.log('labelType', labelType)
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
        'Employees',
        'Leads',
        'Creatives',
        'Tasks',
        'Budgets',
        'Campaigns',
        'Projects',
        'Clients',
    ]

    if (!isOpen) return null

    const onLabelTypeSelect = useCallback((value) => {
        setLabelType(value)
    }, [])

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
                        <div
                            style={{
                                height: '40px',
                                width: '400px',
                            }}>
                            <TextField
                                id='boardTitle'
                                placeholder='New Board'
                                title='Board name'
                                wrapperClassName='monday-storybook-text-field_size'
                                value={boardTitle}
                                onChange={(e) => setBoardTitle(e)}
                            />
                        </div>

                        <div
                            style={{
                                height: '40px',
                                width: '400px',
                            }}>
                              
                            <Divider direction='horizontal' />
                        </div>

                        <div className='form-group'>
                            <div>Select what you're managing in this board:</div>
                            <div style={{ display: 'block', marginBottom: '8px' }}>
                                {labelOptions.map((option) => (
                                    <RadioButton
                                        key={option}
                                        name='radio-buttons-group-4'
                                        text={option}
                                        checked={labelType === option}
                                        onSelect={() => onLabelTypeSelect(option)}
                                    />
                                ))}
                                <RadioButton
                                    name='radio-buttons-group-4'
                                    text={
                                        <EditableText
                                            weight={EditableText.weights.NORMAL}
                                            value={customLabel}
                                            onChange={(e) => {
                                                setCustomLabel(e)
                                                setLabelType(e)
                                            }}
                                        />
                                    }
                                    checked={labelType === customLabel}
                                    onSelect={() => onLabelTypeSelect(customLabel)}
                                />
                            </div>
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
