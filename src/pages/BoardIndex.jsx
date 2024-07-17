import { BoardList } from '../cmps/BoardList'
import { boardService } from '../services/board/board.service.local'

export function BoardIndex() {
    return (
        <section className='board-index'>
            <h1>This is board index</h1>
            <BoardList />
        </section>
    )
}
