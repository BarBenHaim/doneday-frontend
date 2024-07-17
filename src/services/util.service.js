export function makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}

export function makeLorem(size = 100) {
    var words = [
        'The sky',
        'above',
        'the port',
        'was',
        'the color of television',
        'tuned',
        'to',
        'a dead channel',
        '.',
        'All',
        'this happened',
        'more or less',
        '.',
        'I',
        'had',
        'the story',
        'bit by bit',
        'from various people',
        'and',
        'as generally',
        'happens',
        'in such cases',
        'each time',
        'it',
        'was',
        'a different story',
        '.',
        'It',
        'was',
        'a pleasure',
        'to',
        'burn',
    ]
    var txt = ''
    while (size > 0) {
        size--
        txt += words[Math.floor(Math.random() * words.length)] + ' '
    }
    return txt
}

export function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive
}

export function randomPastTime() {
    const HOUR = 1000 * 60 * 60
    const DAY = 1000 * 60 * 60 * 24
    const WEEK = 1000 * 60 * 60 * 24 * 7

    const pastTime = getRandomIntInclusive(HOUR, WEEK)
    return Date.now() - pastTime
}

export function debounce(func, timeout = 300) {
    let timer
    return (...args) => {
        clearTimeout(timer)
        timer = setTimeout(() => {
            func.apply(this, args)
        }, timeout)
    }
}

export function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

export function loadFromStorage(key) {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : undefined
}

export function createBoard() {
    return [
        {
            title: 'Robot dev proj',
            isStarred: false,
            archivedAt: 1589983468418,
            createdBy: {
                _id: 'u101',
                fullname: 'Abi Abambi',
                imgUrl: 'http://some-img',
            },
            style: {
                backgroundImage: '',
            },
            labels: [
                {
                    id: 'l101',
                    title: 'Done',
                    color: '#61bd4f',
                },
                {
                    id: 'l102',
                    title: 'Progress',
                    color: '#61bd33',
                },
            ],
            members: [
                {
                    _id: 'u101',
                    fullname: 'Tal Taltal',
                    imgUrl: 'https://www.google.com',
                },
                {
                    _id: 'u102',
                    fullname: 'Josh Ga',
                    imgUrl: 'https://www.google.com',
                },
            ],
            groups: [
                {
                    id: 'g101',
                    title: 'Group 1',
                    archivedAt: 1589983468418,
                    tasks: [
                        {
                            id: 'c101',
                            title: 'Replace logo',
                        },
                        {
                            id: 'c102',
                            title: 'Add Samples',
                        },
                    ],
                    style: {},
                },
                {
                    id: 'g102',
                    title: 'Group 2',
                    tasks: [
                        {
                            id: 'c103',
                            title: 'Do that',
                            archivedAt: 1589983468418,
                        },
                        {
                            id: 'c104',
                            title: 'Help me',
                            status: 'inProgress', // monday / both
                            priority: 'high', // monday / both
                            dueDate: '2024-09-24',
                            description: 'description',
                            comments: [
                                // in Trello this is easier implemented as an activity
                                {
                                    id: 'ZdPnm',
                                    title: 'also @yaronb please CR this',
                                    createdAt: 1590999817436,
                                    byMember: {
                                        _id: 'u101',
                                        fullname: 'Tal Tarablus',
                                        imgUrl: '',
                                    },
                                },
                            ],
                            checklists: [
                                {
                                    id: 'YEhmF',
                                    title: 'Checklist',
                                    todos: [
                                        {
                                            id: '212jX',
                                            title: 'To Do 1',
                                            isDone: false,
                                        },
                                    ],
                                },
                            ],
                            memberIds: ['u101'],
                            labelIds: ['l101', 'l102'],
                            byMember: {
                                _id: 'u101',
                                fullname: 'Tal Tarablus',
                                imgUrl: '',
                            },
                            style: {
                                backgroundColor: '#26de81',
                            },
                        },
                    ],
                    style: {},
                },
            ],
            activities: [
                {
                    id: 'a101',
                    title: 'Changed Color',
                    createdAt: 154514,
                    byMember: {
                        _id: 'u101',
                        fullname: 'Abi Abambi',
                        imgUrl: 'http://some-img',
                    },
                    group: {
                        id: 'g101',
                        title: 'Urgent Stuff',
                    },
                    task: {
                        id: 'c101',
                        title: 'Replace Logo',
                    },
                },
            ],

            cmpsOrder: ['StatusPicker', 'MemberPicker', 'DatePicker'],
        },
    ]
}
