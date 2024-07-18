import { Link } from 'react-router-dom'
import { Box } from 'monday-ui-react-core'
import { Board  } from "monday-ui-react-core/icons";
import 'monday-ui-react-core/dist/main.css'


import boardPreviewImg from '../assets/img/board-preview/board-preview-01.png'

export function BoardPreview({ board }) {
    return (
        <article className='board-preview-container'>
            <Link to={`/board/${board._id}`}>
            <div className="board-preview-img">
            <img src={boardPreviewImg} alt='boardPreviewImg' />
            </div>
                <span className="board-preview-item-wrapper flex">
                <Board iconSize={18} iconLabel="Expand list" />
                <div className="board-preview-title" >{board.title}</div>
                </span>
                <div className="board-preview-navigation" >
                <p>
                    work managment {'>'} Main workspace {'>'} {board.title}{' '}
                </p>
                </div>

            </Link>
        </article>
    )
}
