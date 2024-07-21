import { useEffect } from 'react'
import { loadBoard } from '../store/actions/board.action'
import { useParams } from 'react-router'
import { GroupList } from './group/GroupList'

export function BoardDetails() {
    const { boardId } = useParams()
    useEffect(() =>
        // loadBoardById(boardId)
        {}, [boardId])

    async function loadBoardById(id) {
        try {
        } catch {}
    }

    return (
        <section className='board-details'>
            <GroupList />
        </section>
    )
}
