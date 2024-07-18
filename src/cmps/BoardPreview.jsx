import { Link } from 'react-router-dom'
import { Box } from 'monday-ui-react-core'
import {Favorite } from 'monday-ui-react-core/icons'
import { Board  } from "monday-ui-react-core/icons";
import 'monday-ui-react-core/dist/main.css'


import boardPreviewImg from '../assets/img/board-preview/board-preview-01.png'
import { useDispatch } from 'react-redux';



export function BoardPreview({ board }) {

    const dispatch = useDispatch();

    function handleToggleStarred() {
        dispatch(toggleStarredBoard(board._id));
    }

    return (
        <article className='board-preview-container'>
            <Link to={`/board/${board._id}`}>
            <div className="board-preview-img">
            <img src={boardPreviewImg} alt='boardPreviewImg' />
            </div>
                <span className="board-preview-item-wrapper flex">
                <Board iconSize={18} iconLabel="Expand list" />
                <div className="board-preview-title" >{board.title}</div>
                <button className='starred-btn' title='Starred' onClick={handleToggleStarred}>
            {/* <span>
              {board.isStarred ? (
                <span> <FontAwesomeIcon icon={faStar} style={{ color: '#FFD43B' }} title='Favorite' /></span>
              ) : (
                <span><FontAwesomeIcon icon={faStar} /></span>
              )}
            </span> */}
          </button>
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
