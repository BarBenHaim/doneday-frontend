import { useEffect } from 'react'
import { GroupList } from './GroupList'
import { loadBoard } from '../store/actions/board.action'
import { useParams } from 'react-router'

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
        <section>
            <GroupList />
        </section>
    )
}
