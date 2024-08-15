import { storageService } from '../async-storage.service'
import { makeId } from '../util.service'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

export const userService = {
    login,
    logout,
    signup,
    getUsers,
    getById,
    remove,
    update,
    getLoggedinUser,
    saveLoggedinUser,
}

async function getUsers() {
    let users = await storageService.query('user')
    if (!users || !users.length) users = await createUsers()
    return users.map(user => {
        delete user.password
        return user
    })
}

async function getById(userId) {
    return await storageService.get('user', userId)
}

function remove(userId) {
    return storageService.remove('user', userId)
}

async function update({ _id, score }) {
    const user = await storageService.get('user', _id)
    user.score = score
    await storageService.put('user', user)

    const loggedinUser = getLoggedinUser()
    if (loggedinUser._id === user._id) saveLoggedinUser(user)

    return user
}

async function login(userCred) {
    const users = await storageService.query('user')
    const user = users.find(user => user.username === userCred.username)

    if (user) return saveLoggedinUser(user)
}

async function signup(userCred) {
    if (!userCred.imgUrl) userCred.imgUrl = 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
    userCred.score = 10000

    const user = await storageService.post('user', userCred)
    return saveLoggedinUser(user)
}

async function logout() {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

function saveLoggedinUser(user) {
    user = {
        _id: user._id,
        fullname: user.fullname,
        imgUrl: user.imgUrl,
        score: user.score,
        isAdmin: user.isAdmin,
    }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
    return user
}

async function _createAdmin() {
    const user = {
        username: 'admin',
        password: 'admin',
        fullname: 'admin adminsky',
        imgUrl: 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png',
        score: 10000,
        isAdmin: true,
    }

    const newUser = await storageService.post('user', user)
}

async function _createUser(fullname, imgUrl) {
    const user = {
        _id: makeId(),
        password: '1234',
        fullname: fullname,
        username: fullname.toLowerCase().replace(/\s+/g, ''),
        imgUrl: imgUrl,
        score: 10000,
        isAdmin: false,
    }
    return await storageService.post('user', user)
}

async function createUsers() {
    const user1 = await _createUser(
        'Ariella Melnikov',
        'https://res.cloudinary.com/dkykllpf5/image/upload/v1721649934/jzacprnumxyqpj1w0xah.jpg'
    )
    const user2 = await _createUser(
        'Bar Ben Haim',
        'https://res.cloudinary.com/dkykllpf5/image/upload/v1721651006/dcll8jx7dtrrvsj3vhxe.jpg'
    )
    const user3 = await _createUser(
        'Nir Fakiro',
        'https://res.cloudinary.com/dkykllpf5/image/upload/v1721651052/g2rk8iilfjyumxjvheid.jpg'
    )
    const users = [user1, user2, user3]
    return users
}
