const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

morgan.token('data', function getData(req, res) {
    if (req.method === "POST") {
        return JSON.stringify(req.body)}
        else {
            return null
        }
})

const app = express()

let groceries = [
    {
        id: 1,
        name: "banana",
        price: 1,
        quantity: 5
    },
    {
        id: 2,
        name: "bread",
        price: 3,
        quantity: 1
    }
]

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
app.use(cors())
app.use(express.static('build'))

app.get('/', (req, res) => {
    res.send('<p>Hello world!</p>')
})

app.get('/api/groceries', (req, res) => {
    res.json(groceries)
})

app.get('/info', (req, res) => {
    res.send(`<div>Grocery list has ${groceries.length} items</div> <p>${Date()}</p>`)
})

app.get('/api/groceries/:id', (req, res) => {
    const id = Number(req.params.id)
    const item = groceries.find(item => item.id === id)

    if (item) {
        res.json(item)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/groceries/:id', (req, res) => {
    const id = Number(req.params.id)
    groceries = groceries.filter(item => item.id !== id)
    
    res.status(204).end()
})

app.post('/api/groceries', (req, res) => {
    const body = req.body
    console.log(body)

    if (!body.name) {
        return res.status(400).json({
            error: 'name missing'
        })
    }

    if (!body.price) {
        return res.status(400).json({
            error: 'price missing'
        })
    }

    if (groceries.find(item => item.name === body.name)) {
        return response.status(400).json({
            error: 'item already on the list'
        })
    }

    if (!body.quantity) {
        const quantity = 1
    }

    const id = Math.floor(Math.random() * 10000000)

    const item = {
        id: id,
        name: body.name,
        price: Number(body.price),
        quantity: Number(body.quantity)
    }

    groceries = groceries.concat(item)

    res.json(item)

})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
