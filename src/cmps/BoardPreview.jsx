import { Link } from 'react-router-dom'
import { Favorite } from 'monday-ui-react-core/icons'
import { Board } from 'monday-ui-react-core/icons'
import 'monday-ui-react-core/dist/main.css'

import { toggleStarredBoard } from '../store/actions/board.action'
import { Icon } from 'monday-ui-react-core'
import boardPreviewImg from '../assets/img/board-preview/board-preview-02.png'
import logoImg from '../assets/img/logo/only-logo.png'
import StarIcon from './svgs/starIcon'

export function BoardPreview({ board }) {

    async function handleToggleStarred(event) {
        event.preventDefault()
        board.isStarred = !board.isStarred
        await toggleStarredBoard(board)
        // toggleStarredBoard(board)

    }

    return (
        <article className='board-preview-container'>
                <Link to={`/board/${board._id}`} className='board-preview-link'>
                    <div className='board-preview-img'>
                        <img src={boardPreviewImg} alt='boardPreviewImg' />
                    </div>
                    <div className='board-preview-item-wrapper flex'>
                    <div className='board-preview-title-wrapper'>
                        <Board className='board-icon' label='Expand list' />
                        <span className='board-preview-title'>{board.title}</span>
                        </div>

                        <button className='starred-btn' title='Starred' onClick={handleToggleStarred}>
                        <StarIcon isStarred={board.isStarred} />
                        </button>
                    </div>
                    <div className='board-preview-navigation'>
                        <img src={logoImg} alt='' />
                        <p>
                            work management {'>'} Main workspace {'>'} {board.title}{' '}
                        </p>
                    </div>
                </Link>
        </article>
    )
}
