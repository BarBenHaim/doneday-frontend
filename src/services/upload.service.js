export const uploadService = {
    uploadImg,
}

async function uploadImg(ev) {
    const CLOUD_NAME = 'dkykllpf5'
    const UPLOAD_PRESET = 'doneday'
    const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

    const formData = new FormData()

    formData.append('file', ev.target.files[0])
    formData.append('upload_preset', UPLOAD_PRESET)

    try {
        const res = await fetch(UPLOAD_URL, { method: 'POST', body: formData })
        const imgData = await res.json()
        return imgData
    } catch (err) {
        console.error(err)
        throw err
    }
}
