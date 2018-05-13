if (process.env.NODE_ENV === 'production') {
    module.exports = {mongoURI:'mongodb://nbagonoc:Th3r3nc3@ds051960.mlab.com:51960/ideapad'}
} else {
    module.exports = {mongoURI:'mongodb://localhost:27017/ideapad'}
}