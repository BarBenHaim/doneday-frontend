import React, { useEffect, useMemo } from 'react'
import { Pie, Bar } from 'react-chartjs-2'
import 'chart.js/auto'
import { useSelector } from 'react-redux'
import { loadBoards } from '../store/actions/board.action'

const calculateStatusPercentages = boards => {
    const statusCounts = {}
    let totalTasks = 0

    boards.forEach(board => {
        board.groups.forEach(group => {
            group.tasks.forEach(task => {
                if (statusCounts[task.status]) {
                    statusCounts[task.status]++
                } else {
                    statusCounts[task.status] = 1
                }
                totalTasks++
            })
        })
    })

    return Object.keys(statusCounts).map(status => ({
        name: status,
        value: ((statusCounts[status] / totalTasks) * 100).toFixed(2),
    }))
}

const calculatePriorityCounts = boards => {
    const priorityCounts = {}

    boards.forEach(board => {
        board.groups.forEach(group => {
            group.tasks.forEach(task => {
                if (priorityCounts[task.priority]) {
                    priorityCounts[task.priority]++
                } else {
                    priorityCounts[task.priority] = 1
                }
            })
        })
    })

    return Object.keys(priorityCounts).map(priority => ({
        name: priority,
        count: priorityCounts[priority],
    }))
}

export function Dashboard() {
    useEffect(() => {
        loadBoards()
    }, [])
    const boards = useSelector(storeState => storeState.boardModule.boards)
    const statusData = useMemo(() => calculateStatusPercentages(boards), [boards])
    const priorityData = useMemo(() => calculatePriorityCounts(boards), [boards])
    const pieData = {
        labels: statusData.map(data => data.name),
        datasets: [
            {
                data: statusData.map(data => data.value),
                backgroundColor: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'],
            },
        ],
    }
    const barData = {
        labels: priorityData.map(data => data.name),
        datasets: [
            {
                label: 'Task Count by Priority',
                data: priorityData.map(data => data.count),
                backgroundColor: '#8884d8',
            },
        ],
    }

    return (
        <div className='dashboard'>
            <div className='chart-container'>
                <Pie data={pieData} />
            </div>

            <div className='chart-container'>
                <Bar data={barData} />
            </div>
        </div>
    )
}
