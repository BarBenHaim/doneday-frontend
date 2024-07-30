import { stubTrue } from 'lodash'

export function makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}

export function getUserById(users, userId) {
    return users.find(user => user._id === userId)
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

export function createLabel(title, color) {
    return {
        _id: makeId(),
        title,
        color,
    }
}

export function createMember(fullname, imgUrl) {
    return {
        _id: makeId(),
        fullname,
        imgUrl,
    }
}

export function createTask(title, options = {}) {
    return {
        _id: makeId(),
        title,
        archivedAt: options.archivedAt || null,
        status: options.status || null,
        priority: options.priority || null,
        dueDate: options.dueDate || null,
        description: options.description || null,
        comments: options.comments || [],
        checklists: options.checklists || [],
        memberIds: options.memberIds || [],
        byMember: options.byMember || null,
        style: options.style || {},
    }
}

export function createGroup(title, tasks = [], archivedAt = null) {
    return {
        _id: makeId(),
        title,
        archivedAt,
        tasks,
        style: { backgroundColor: getRandomColor() },
    }
}

export function createBoard(title, createdBy, label, members = [], groups = [], activities = [], isStarred = false) {
    const columns = ['status', 'memberIds', 'description', 'dueDate', 'files', 'priority', 'recording']

    const shuffleArray = array => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[array[i], array[j]] = [array[j], array[i]]
        }
        return array
    }

    const shuffledColumns = ['checkbox', 'title', ...shuffleArray(columns)]

    return {
        _id: makeId(),
        title,
        description:
            'Manage any type of project. Assign owners, set timelines and keep track of where your project stands.',
        isStarred: isStarred || true,
        archivedAt: null,
        createdBy,
        style: {
            backgroundImage: '',
        },
        label,
        members,
        groups,
        activities,
        cmpsOrder: shuffledColumns,
    }
}

export function getRandomColor() {
    const colors = [
        'rgb(3, 127, 76)',
        'rgb(0, 200, 117)',
        'rgb(156, 211, 38)',
        'rgb(202, 182, 65)',
        'rgb(255, 203, 0)',
        'rgb(120, 75, 209)',
        'rgb(157, 80, 221)',
        'rgb(0, 126, 181)',
        'rgb(87, 155, 252)',
        'rgb(102, 204, 255)',
        'rgb(187, 51, 84)',
        'rgb(223, 47, 74)',
        'rgb(255, 0, 127)',
        'rgb(255, 90, 196)',
        'rgb(255, 100, 46)',
        'rgb(127, 83, 71)',
        'rgb(196, 196, 196)',
        'rgb(117, 117, 117)',
    ]
    const randomIndex = Math.floor(Math.random() * colors.length)
    return colors[randomIndex]
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////

export function createBoardDemo(title, label) {
    const member2 = createMember(
        'Bar Ben Haim',
        'https://res.cloudinary.com/dkykllpf5/image/upload/v1721651006/dcll8jx7dtrrvsj3vhxe.jpg'
    )
    // const label1 = createLabel('Done', '#61bd4f')
    // const label2 = createLabel('Progress', '#61bd33')

    const task1 = createTask(label)
    const task2 = createTask(label)
    const task3 = createTask(label)
    const task4 = createTask(label)

    const board = createBoard(
        title,
        member2,
        label,
        [member2],
        [createGroup('Group Title', [task1, task2]), createGroup('Group Title', [task3, task4])]
    )

    return board
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////

export function createBoards() {
    const member1 = createMember(
        'Ariella Melnikov',
        'https://res.cloudinary.com/dkykllpf5/image/upload/v1721649934/jzacprnumxyqpj1w0xah.jpg'
    )
    const member2 = createMember(
        'Bar Ben Haim',
        'https://res.cloudinary.com/dkykllpf5/image/upload/v1721651006/dcll8jx7dtrrvsj3vhxe.jpg'
    )
    const member3 = createMember(
        'Nir Fakiro',
        'https://res.cloudinary.com/dkykllpf5/image/upload/v1721651052/g2rk8iilfjyumxjvheid.jpg'
    )

    const label1 = createLabel('Done', '#00C875')
    const label2 = createLabel('Working on it', '#fdab3d')
    const label3 = createLabel('Stuck', '#DF2F4A')
    const label4 = createLabel('Not Started', '#C4C4C4')
    const label5 = createLabel('Important', '#007EB5')

    const priorities = ['Critical', 'High', 'Medium', 'Low']
    const statuses = ['Done', 'Working on it', 'Stuck', 'Not Started', 'Important']

    const generateRandomCollaborators = () => {
        const members = [member1, member2, member3]
        return members
            .sort(() => 0.5 - Math.random())
            .slice(0, Math.floor(Math.random() * 3) + 1)
            .map(member => member._id)
    }

    const generateUniqueStatusAndPriority = index => {
        const status = statuses[index % statuses.length]
        const priority = priorities[index % priorities.length]
        return { status, priority }
    }

    const generateRandomDueDate = () => {
        const start = new Date(2024, 0, 1)
        const end = new Date(2024, 11, 31)
        const dueDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
        return dueDate.toISOString().split('T')[0] // Format as YYYY-MM-DD
    }

    const generateTasks = (taskTitles, descriptions, labelIds) => {
        const tasks = []
        for (let i = 0; i < taskTitles.length; i++) {
            const { status, priority } = generateUniqueStatusAndPriority(i)

            tasks.push(
                createTask(taskTitles[i], {
                    description: descriptions[i],
                    memberIds: generateRandomCollaborators(),
                    labelIds: labelIds,
                    comments: [
                        {
                            _id: makeId(),
                            title: `Comment for ${taskTitles[i]}`,
                            createdAt: randomPastTime(),
                            byMember: [member1, member2, member3][Math.floor(Math.random() * 3)],
                        },
                    ],
                    checklists: [
                        {
                            _id: makeId(),
                            title: `Checklist for ${taskTitles[i]}`,
                            todos: [
                                { _id: makeId(), title: 'Subtask 1', isDone: Math.random() > 0.5 },
                                { _id: makeId(), title: 'Subtask 2', isDone: Math.random() > 0.5 },
                            ],
                        },
                    ],
                    files: [
                        {
                            _id: makeId(),
                            filename: `file_${i + 1}.txt`,
                            url: `https://example.com/file_${i + 1}.txt`,
                        },
                    ],
                    dueDate: generateRandomDueDate(),
                    status: status,
                    priority: priority,
                    style: { backgroundColor: getRandomColor() },
                })
            )
        }
        return tasks
    }

    const generateGroups = (groupTitles, taskTitles, descriptions, labelIds) => {
        const groups = []
        for (let i = 0; i < groupTitles.length; i++) {
            groups.push(createGroup(groupTitles[i], generateTasks(taskTitles[i], descriptions[i], labelIds)))
        }
        return groups
    }

    const board1 = createBoard(
        'Project Management',
        member1,
        'Project',
        [member2, member3],
        generateGroups(
            ['Setup', 'Development', 'Testing', 'Deployment', 'Maintenance'],
            [
                ['Setup Repository', 'Configure CI/CD', 'Setup Dev Environment', 'Create Initial Models'],
                ['Develop Login Module', 'Develop Registration Module', 'Implement JWT Auth', 'Setup User Roles'],
                ['Write Unit Tests', 'Write Integration Tests', 'Write E2E Tests', 'Setup Test Data'],
                ['Prepare Deployment Scripts', 'Setup Staging Env', 'Deploy to Staging', 'Conduct Final Testing'],
                ['Setup Monitoring', 'Configure Alerts', 'Implement Logging', 'Perform Regular Backups'],
            ],
            [
                [
                    'Initialize project repository on GitHub and configure settings.',
                    'Configure CI/CD pipeline using GitHub Actions.',
                    'Set up the development environment including IDEs and tools.',
                    'Create initial database models for the project.',
                ],
                [
                    'Develop the login module with email and password authentication.',
                    'Develop the registration module with form validation.',
                    'Implement JWT-based authentication for secure API access.',
                    'Set up user roles and permissions for different functionalities.',
                ],
                [
                    'Write unit tests for individual functions and components.',
                    'Write integration tests to ensure modules work together.',
                    'Write end-to-end tests to simulate real user scenarios.',
                    'Set up test data for automated tests.',
                ],
                [
                    'Prepare deployment scripts for automated deployment.',
                    'Set up the staging environment for final testing.',
                    'Deploy the project to the staging environment.',
                    'Conduct final testing before production deployment.',
                ],
                [
                    'Set up monitoring tools to track application performance.',
                    'Configure alerts for critical issues.',
                    'Implement logging for debugging and auditing.',
                    'Perform regular backups of the database and files.',
                ],
            ],
            [label4._id, label5._id, label3._id, label1._id, label2._id]
        )
    )

    const board2 = createBoard(
        'Marketing Campaign',
        member2,
        'Campaign',
        [member1, member3],
        generateGroups(
            ['Planning', 'Execution', 'Monitoring', 'Closure'],
            [
                ['Define Objectives', 'Identify Target Audience', 'Conduct Market Research', 'Develop Strategy'],
                ['Design Marketing Materials', 'Launch Campaign', 'Execute Social Media Plan', 'Manage Email Campaign'],
                ['Track Performance', 'Analyze Metrics', 'Adjust Strategy', 'Report Progress'],
                ['Review Results', 'Document Learnings', 'Prepare Final Report', 'Plan Next Steps'],
            ],
            [
                [
                    'Define the main objectives of the marketing campaign.',
                    'Identify the target audience for the campaign.',
                    'Conduct market research to gather relevant data.',
                    'Develop a comprehensive marketing strategy.',
                ],
                [
                    'Design various marketing materials like posters, flyers, etc.',
                    'Launch the campaign across multiple platforms.',
                    'Execute a detailed social media plan.',
                    'Manage the email campaign to reach the audience.',
                ],
                [
                    'Track the performance of the campaign in real-time.',
                    'Analyze the metrics to understand the effectiveness.',
                    'Adjust the strategy based on performance data.',
                    'Report the progress to the stakeholders.',
                ],
                [
                    'Review the overall results of the campaign.',
                    'Document the learnings and insights.',
                    'Prepare a final report summarizing the campaign.',
                    'Plan the next steps for future campaigns.',
                ],
            ],
            [label1._id, label3._id, label2._id, label4._id, label5._id]
        )
    )

    const board3 = createBoard(
        'Website Redesign',
        member3,
        'Design',
        [member1, member2],
        generateGroups(
            ['Research', 'Design', 'Development', 'Testing'],
            [
                ['Conduct User Research', 'Analyze Current Site', 'Identify Pain Points', 'Define Goals'],
                ['Create Wireframes', 'Design Mockups', 'Develop Style Guide', 'Design UI Elements'],
                ['Develop Homepage', 'Develop About Page', 'Develop Services Page', 'Integrate CMS'],
                ['Conduct Usability Testing', 'Fix Bugs', 'Optimize Performance', 'Ensure Compatibility'],
            ],
            [
                [
                    'Conduct user research to gather feedback.',
                    'Analyze the current site to identify weaknesses.',
                    'Identify key pain points for users.',
                    'Define the goals for the redesign project.',
                ],
                [
                    'Create wireframes for the new site.',
                    'Design mockups based on wireframes.',
                    'Develop a style guide for consistent design.',
                    'Design UI elements like buttons, forms, etc.',
                ],
                [
                    'Develop the homepage with the new design.',
                    'Develop the About page with updated content.',
                    'Develop the Services page to highlight offerings.',
                    'Integrate the CMS for easy content management.',
                ],
                [
                    'Conduct usability testing to ensure user-friendliness.',
                    'Fix bugs identified during testing.',
                    'Optimize the site for performance.',
                    'Ensure cross-browser and device compatibility.',
                ],
            ],
            [label5._id, label4._id, label2._id, label3._id, label1._id]
        )
    )

    const board4 = createBoard(
        'New Product Launch',
        member1,
        'Product',
        [member2, member3],
        generateGroups(
            ['Concept', 'Development', 'Launch', 'Post-Launch'],
            [
                ['Brainstorm Ideas', 'Validate Concept', 'Develop MVP', 'Conduct Market Research'],
                ['Develop Product', 'Test Product', 'Gather Feedback', 'Iterate on Feedback'],
                ['Plan Launch Event', 'Execute Launch Plan', 'Monitor Feedback', 'Adjust Marketing Strategy'],
                ['Analyze Data', 'Collect Customer Feedback', 'Fix Bugs', 'Plan Updates'],
            ],
            [
                [
                    'Brainstorm ideas for the new product.',
                    'Validate the concept with potential customers.',
                    'Develop a minimum viable product (MVP).',
                    'Conduct market research to refine the product.',
                ],
                [
                    'Develop the product based on the MVP.',
                    'Test the product for any issues.',
                    'Gather feedback from early users.',
                    'Iterate on the feedback to improve the product.',
                ],
                [
                    'Plan the launch event for the product.',
                    'Execute the detailed launch plan.',
                    'Monitor feedback during and after launch.',
                    'Adjust the marketing strategy based on feedback.',
                ],
                [
                    'Analyze data collected post-launch.',
                    'Collect feedback from customers.',
                    'Fix any bugs reported by users.',
                    'Plan updates and new features.',
                ],
            ],
            [label3._id, label1._id, label3._id, label2._id, label5._id]
        )
    )

    const board5 = createBoard(
        'Team Building Activities',
        member2,
        'Team ',
        [member1, member3],
        generateGroups(
            ['Planning', 'Execution', 'Review', 'Next Steps'],
            [
                ['Define Objectives', 'Select Activities', 'Plan Schedule', 'Book Venue'],
                ['Conduct Ice Breakers', 'Facilitate Team Challenges', 'Organize Discussions', 'Conduct Workshops'],
                ['Gather Feedback', 'Analyze Outcomes', 'Document Learnings', 'Prepare Report'],
                ['Identify Improvements', 'Plan Future Activities', 'Set Goals', 'Communicate Plan'],
            ],
            [
                [
                    'Define the objectives for team building.',
                    'Select suitable activities for the team.',
                    'Plan the schedule for the activities.',
                    'Book the venue for the event.',
                ],
                [
                    'Conduct ice breaker activities to get started.',
                    'Facilitate team challenges to build teamwork.',
                    'Organize group discussions on various topics.',
                    'Conduct skill-building workshops.',
                ],
                [
                    'Gather feedback from participants.',
                    'Analyze the outcomes of the activities.',
                    'Document the learnings from the event.',
                    'Prepare a detailed report.',
                ],
                [
                    'Identify areas for improvement.',
                    'Plan future team-building activities.',
                    'Set goals for team improvement.',
                    'Communicate the plan to the team.',
                ],
            ],
            [label5._id, label4._id, label1._id, label3._id, label2._id]
        )
    )

    return [board1, board2, board3, board4, board5]
}
