const { DEV, VITE_LOCAL } = import.meta.env

import { commentService as local } from './comment.service.local'
import { commentService as remote } from './comment.service.remote'

export const commentService = VITE_LOCAL === 'true' ? local : remote

if (DEV) window.commentService = commentService
