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

function createLabel(title, color) {
    return {
        id: makeId(),
        title,
        color,
    }
}

function createMember(fullname, imgUrl) {
    return {
        _id: makeId(),
        fullname,
        imgUrl,
    }
}

function createTask(title, options = {}) {
    return {
        id: makeId(),
        title,
        archivedAt: options.archivedAt || null,
        status: options.status || null,
        priority: options.priority || null,
        dueDate: options.dueDate || null,
        description: options.description || null,
        comments: options.comments || [],
        checklists: options.checklists || [],
        memberIds: options.memberIds || [],
        labelIds: options.labelIds || [],
        byMember: options.byMember || null,
        style: options.style || {},
    }
}

function createGroup(title, tasks = [], archivedAt = null) {
    return {
        id: makeId(),
        title,
        archivedAt,
        tasks,
        style: {},
    }
}

function createBoard(title, createdBy, labels = [], members = [], groups = [], activities = []) {
    return {
        title,
        isStarred: false,
        archivedAt: null,
        createdBy,
        style: {
            backgroundImage: '',
        },
        labels,
        members,
        groups,
        activities,
        cmpsOrder: ['StatusPicker', 'MemberPicker', 'DatePicker'],
    }
}

export function createBoards() {
    const member1 = createMember('Abi Abambi', 'http://some-img')
    const member2 = createMember('Tal Taltal', 'https://www.google.com')
    const member3 = createMember('Josh Ga', 'https://www.google.com')

    const label1 = createLabel('Done', '#61bd4f')
    const label2 = createLabel('Progress', '#61bd33')

    const task1 = createTask('Replace logo')
    const task2 = createTask('Add Samples')
    const task3 = createTask('Do that', { archivedAt: randomPastTime() })
    const task4 = createTask('Help me', {
        status: 'inProgress',
        priority: 'high',
        dueDate: '2024-09-24',
        description: makeLorem(20),
        comments: [
            {
                id: makeId(),
                title: 'also @yaronb please CR this',
                createdAt: randomPastTime(),
                byMember: member1,
            },
        ],
        checklists: [
            {
                id: makeId(),
                title: 'Checklist',
                todos: [
                    {
                        id: makeId(),
                        title: 'To Do 1',
                        isDone: false,
                    },
                ],
            },
        ],
        memberIds: [member1._id],
        labelIds: [label1.id, label2.id],
        byMember: member1,
        style: {
            backgroundColor: '#26de81',
        },
    })

    const group1 = createGroup('Group 1', [task1, task2], randomPastTime())
    const group2 = createGroup('Group 2', [task3, task4])

    const activity1 = {
        id: makeId(),
        title: 'Changed Color',
        createdAt: randomPastTime(),
        byMember: member1,
        group: {
            id: group1.id,
            title: 'Urgent Stuff',
        },
        task: {
            id: task1.id,
            title: 'Replace Logo',
        },
    }

    const board1 = createBoard(
        'Robot dev proj',
        member1,
        [label1, label2],
        [member2, member3],
        [group1, group2],
        [activity1]
    )

    const board2 = createBoard(
        'Marketing Campaign',
        member2,
        [label1, label2],
        [member1, member3],
        [
            createGroup('Planning', [createTask('Define goals'), createTask('Research market')]),
            createGroup('Execution', [createTask('Launch campaign'), createTask('Monitor results')]),
        ]
    )

    const board3 = createBoard(
        'Website Redesign',
        member3,
        [label1, label2],
        [member1, member2],
        [
            createGroup('Initial Setup', [createTask('Gather requirements'), createTask('Create wireframes')]),
            createGroup('Development', [createTask('Develop frontend'), createTask('Integrate backend')]),
        ]
    )

    return [board1, board2, board3]
}
