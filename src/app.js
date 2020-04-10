const express = require('express')
const fs = require('fs')
const bparser = require('body-parser')
const app = express()
const port = 12800
app.use(bparser.urlencoded({ extended: false}))
app.use(bparser.json())
// app.use(express.json())

app.get('/todo', (req, res) => fs.readFile('./data.json', 'utf-8', (err, data) => {
  if (err) {
    res.status(500).send()
  }
  else {
    const date = new Date()
    res.send(
      {
        success: 'true',
        messege: 'todos retrieved successfully',
        date: date.toJSON(),
        todos: JSON.parse(data)
      })
  }
}))

const asyncReadFile = function(path) {
  return new Promise(
    function(resolve, reject) {
      fs.readFile(path, 'utf-8', function(err, data) {
        if (err) {
          reject(err)
        }
        resolve(data)
      })
    }
  ).catch(err => {
    return err
  })
}
const asyncWriteFile = function(string, path) {
  return new Promise(function (resolve, reject) {
    fs.writeFile(path, string, function(err) {
      reject(err)
    })
  }).catch(err => {
    return err
  })
}

const createItem = async (req, res) => {
  const newItem = req.body
  const file = await asyncReadFile('./data.json')
  const items = JSON.parse(file)
  if (!newItem.hasOwnProperty("content") || !newItem.content) {
    return res.status(400).send({
      messege: 'content is required!',
      post: newItem,
    })
  } else {
    const date = new Date()
    const todo = {
      id: items.length + 1,
      content: newItem.content,
      createdTime: date.toJSON()
    }
    items.push(todo)
    await asyncWriteFile(JSON.stringify(items), './data.json')
    return res.status(201).send(items)
  }
}

app.post('/todo', createItem)

app.get('/todo/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const file = await asyncReadFile('./data.json')
  const items = JSON.parse(file)
  items.map((item) => {
    if (item.id === id) {
      return res.status(200).send({
        messege: 'item retrieved successfully',
        item
      })
    }
  })
  return res.status(404).send({
    messege: 'item does not exist'
  })
})

app.delete('/todo/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const file = await asyncReadFile('./data.json')
  const items = JSON.parse(file)
  items.map(async (item, index) => {
    if (item.id === id) {
      items.splice(index, 1)
      await asyncWriteFile(JSON.stringify(items), './data.json')
      return res.status(200).send({
        messege: 'item deleted successfully',
      })
    }
  })
  return res.status(404).send({
    messege: 'item not found'
  })
})

app.put('/todo/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const file = await asyncReadFile('./data.json')
  const items = JSON.parse(file)
  let todoFound, itemIndex;
  items.map((item, index) => {
    if (item.id === id) {
      todoFound = item
      itemIndex = index
    }
  })
  if (!todoFound) {
    return res.status(404).send({
      messege: 'item not found'
    })
  }
  if (!req.body.content) {
    return res.status(400).send({
      message: 'content is required'
    })
  }

  const updatedItem = {
    id: todoFound.id,
    content: req.body.content || todoFound.content,
    createdTime: todoFound.createdTime
  }
  items.splice(itemIndex, 1, updatedItem)
  await asyncWriteFile(JSON.stringify(items), './data.json')

  return res.status(201).send({
    message: 'item updated successfully',
    updatedItem
  })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

exports.app = app
