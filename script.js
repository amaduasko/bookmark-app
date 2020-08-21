const modal = document.getElementById('modal')
const showModalBtn = document.getElementById('show-modal')
const closeModalBtn = document.getElementById('close-modal')
const bookmarkForm = document.getElementById('bookmark-form')
const websiteName = document.getElementById('website-name')
const websiteUrl = document.getElementById('website-url')
const bookmarksContainer = document.getElementById('bookmarks-container')

const [bookmarks, setBookmarks] = [
    [],
    (bookmark) => {
        if (bookmark && Array.isArray(bookmark)) {
            return bookmark.forEach((mark) =>
                bookmarks.filter(
                    (item) => item.name === mark.name && item.url === mark.url
                ).length
                    ? null
                    : bookmarks.push(mark)
            )
        }
        return bookmarks.filter(
            (item) => item.name === bookmark.name && item.url === bookmark.url
        ).length
            ? null
            : bookmarks.push(bookmark)
    },
]

const showModal = () => {
    modal.classList.add('show-modal')
    websiteName.focus()
}

//build bookmarks dom

const buildBookmarks = () => {
    //empty bookmark container
    bookmarksContainer.textContent = ''
    bookmarks.forEach((bookmark) => {
        const { name, url } = bookmark

        const item = document.createElement('div')
        item.classList.add('item')

        const delIcon = document.createElement('i')
        delIcon.classList.add('fas', 'fa-times')
        delIcon.setAttribute('title', 'Delete Bookmark')
        delIcon.setAttribute('onclick', `deleteBookmark('${url}')`)

        const linkInfo = document.createElement('div')
        linkInfo.classList.add('name')

        const favicon = document.createElement('img')
        favicon.setAttribute(
            'src',
            `http://www.google.com/s2/u/0/favicons?domain=${url}`
        )
        favicon.setAttribute('alt', 'Favicon')

        const link = document.createElement('a')
        link.setAttribute('href', `${url}`)
        link.setAttribute('target', '_blank')
        link.textContent = name

        //apnd
        linkInfo.append(favicon, link)
        item.append(delIcon, linkInfo)
        bookmarksContainer.appendChild(item)
    })
}

//fetch bookmarks from localStorage
const fetchBookmarks = () => {
    if (localStorage.getItem('bookmarks')) {
        setBookmarks(JSON.parse(localStorage.getItem('bookmarks')))
    } else {
        setBookmarks({
            name: 'Askodev',
            url: 'https://askodev.com',
        })
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
    }
    buildBookmarks()
}

// handle add bookmark

const validate = (name, url) => {
    const expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi
    const regex = new RegExp(expression)
    if (!name || !url) {
        alert('Please submit values for both fields')
        return false
    }
    if (!url.match(regex)) {
        alert('Please provide a valid web address')
        return false
    }
    return true
}

const addBookmark = (e) => {
    e.preventDefault()
    const name = websiteName.value
    const url = !websiteUrl.value.includes('http://', 'https://')
        ? `https://${websiteUrl.value}`
        : websiteUrl.value

    if (!validate(name, url)) return false
    const bookmark = { name, url }
    setBookmarks(bookmark)
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
    buildBookmarks()
    bookmarkForm.reset()
    websiteName.focus()
}

//del bookmark

const deleteBookmark = (url) => {
    bookmarks.forEach((bookmark, i) =>
        bookmark.url === url ? bookmarks.splice(i, 1) : null
    )
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
    fetchBookmarks()
}

//Event listeners
showModalBtn.addEventListener('click', showModal)
closeModalBtn.addEventListener('click', () =>
    modal.classList.remove('show-modal')
)

window.addEventListener('click', (event) =>
    event.target === modal ? modal.classList.remove('show-modal') : null
)

bookmarkForm.addEventListener('submit', addBookmark)

//onload
fetchBookmarks()
