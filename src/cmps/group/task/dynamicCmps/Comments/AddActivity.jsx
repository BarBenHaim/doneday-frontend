export function AddActivty(currBoard, task, field, value) {
  const newActivity = {
    _id: Date.now().toString(),
    createdAt: Date.now(),
    // fullName,
    // imgUrl,
    // taskName,
    field,
    value,
  }

  currBoard.activities.push(newActivity)
  console.log('Updated activities:', currBoard.activities)
}