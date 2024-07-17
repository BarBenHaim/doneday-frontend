import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { addBoard, loadBoards, removeBoard } from '../store/actions/board.action'

import { showSuccessMsg, showErrorMsg } from '../services/board'

import { BoardList } from '../cmps/BoardList'
import { boardService } from '../services/board/board.service.local'
import { loadBoards } from '../store/actions/board.action'

export function BoardIndex() {

    const boards = useSelector(storeState => storeState.boardModule.boards)

    useEffect(() => {
        loadBoards()
    }, [])

    async function onRemoveBoard(boardId) {
        try {
            await removeBoard(boardId)
            showSuccessMsg('board removed')            
        } catch (err) {
            showErrorMsg('Cannot remove board')
        }
    }

    async function onAddBoard() {
        const board = boardService.getEmptyBoard()
        try {
            const savedBoard = await addBoard(board)
            showSuccessMsg(`board added (id: ${savedBoard._id})`)
        } catch (err) {
            showErrorMsg('Cannot add board')
        }        
    }

    return (
        <section className='board-index'>
            <h1>This is board index</h1>
            <BoardList boards={boards} />
        </section>
    )
}
