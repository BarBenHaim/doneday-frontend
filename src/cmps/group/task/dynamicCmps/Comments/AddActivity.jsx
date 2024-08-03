export function AddActivty(currBoard, task, field, value) {
    const newActivity = {
        _id: Date.now().toString(),
        createdAt: Date.now(),
        field,
        value,
    }

    currBoard.activities.push(newActivity)
}
