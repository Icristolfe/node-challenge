const { request, response } = require('express')
const express = require('express')
const cors = require('cors')
const app = express()
const uuid = require('uuid')
const port = 8080
app.use(express.json())
app.use(cors())

const clients = []

const checkRouteAndMethod = ((request,response,next) => {
    console.log(request.path)
    console.log(request.method)
    

    next()
})


const checkUserId = ((request, response, next) => {
    const { id } = request.params

    const index = clients.findIndex(client => client.id === id)
    if (index < 0) { return response.status(404).json({ error: "Client not found" }) }
    console.log(request)
    request.clientIndex = index
    request.clientId = id

    next()
})


app.post('/order',checkRouteAndMethod, (request, response) => {
    const { order, clientName, price } = request.body
    const clientOrder = { id: uuid.v4(), order, clientName, price, status: "Em preparação" }
    clients.push(clientOrder)

    response.status(200).json(clientOrder)
})


app.get('/order',checkRouteAndMethod, (request, response) => {
    response.status(200).json(clients)
})


app.put('/order/:id', checkUserId,checkRouteAndMethod, (request, response) => {
    const { order, clientName, price } = request.body

    const index = request.clientIndex
    const id = request.clientId

    const updateUser = { id, order, clientName, price, status: "Em preparação" }

    clients[index] = updateUser


    return response.status(200).json(updateUser)


})

app.delete('/order/:id', checkUserId,checkRouteAndMethod, (request, response) => {
    const index = request.clientIndex

    clients.splice(index, 1)
    return response.status(200).json()
})

app.get('/order/:id', checkUserId,checkRouteAndMethod, (request, response) => {
    const index = request.clientIndex

    response.status(200).json(clients[index])
})

app.patch('/order/:id', checkUserId,checkRouteAndMethod, (request, response) => {
    const index = request.clientIndex
    clients[index].status = "Pronto"
    response.status(200).json(clients[index])

})





/* Error: listen EADDRINUSE: address already in use :::8080 
Resolve: killall -9 node
*/




app.listen(port, () => {
    console.log(`🚀 we are online on port:${port}`)
})
