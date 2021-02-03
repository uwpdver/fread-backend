const express = require('express')
var axios = require('axios')
var OAuth = require('oauth');

const app = express()

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2019-05-30T17:30:31.098Z",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2019-05-30T18:39:34.091Z",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2019-05-30T19:20:14.298Z",
    important: true
  }
]

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (req, res) => {
  res.json(notes)
})

app.get('/oauth/inoreader/:code', (req, res) => {

  const AUTHORIZATION_CODE = req.params.code
  const REDIRECT_URI = 'http://localhost:3000/oauth'
  const CLIENT_ID = '999999350'
  const CLIENT_SECRET = 'W3k5ED46RSJme0mOhaRQXYe1mAdZwi3w'
  const url = 'https://www.inoreader.com/oauth2/token'

  axios({
    method: 'post',
    url: url,
    params: {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code: AUTHORIZATION_CODE,
      grant_type: 'authorization_code'
    },
    headers: {
      accept: 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  }).then(
    (response) => {
      access_token = response.data.access_token
      res.redirect('/success');
    },
    (error) => {
      console.log(error.data);
    }
  )

  res.json(notes)
})

app.get('/api/notes/:id', (req, res) => {
  const id = req.params.id
  const note = notes.find(note => note.id === parseInt(id, 10))
  if (note) {
    res.json(note)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/notes/:id', (req, res) => {
  const id = req.params.id
  notes = notes.filter(note => note.id === parseInt(id, 10))
  res.status(204).end()
})

const PORT = 3888

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})