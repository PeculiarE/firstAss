const express = require('express')
const app = express()

app.use(express.json())

app.get('/', function (req, res) {
    console.log(req.url)
    res.send('<h1>Hello Oghenetega!</h1>')
});

// USER DATABASE
const users = []
let id = 0

// REGISTRATION
app.post('/users', function(req, res) {
    const { firstName, lastName, password, email } = req.body
    if (!firstName || !lastName || !password || !email ) {
        return res.status(400).json({
            status: 'Failed',
            message: 'Incomplete registration details',
        })
    }
    if (users.find((el) => el.email === email)) {
        return res.status(409).json({
            status: 'Failed',
            message: 'Email already exists!'
        })
    }
    id += 1
    newBody = {
        id,
        ...req.body
    }
    users.push(newBody)
    res.status(201).json({
        status: 'Success',
        message: 'You have been registered successfully. Please login with your email and password'
    })
});

// CHECKING
app.get('/users', function(req, res) {
    res.status(200).json(users)
});

// LOGIN
app.get('/users/login', function(req, res){
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({
            status: 'Failed',
            message: 'Incomplete registration details',
        })
    }
    const currentUser = users.find((el) => el.email === email)
    if (currentUser) {
        if (currentUser.password === password) {
            return res.status(200).json({
                status: 'Success',
                message: 'You have logged in successfully',
                data: currentUser,
            })
        }
        res.status(401).json({
            status: 'Failed',
            message: 'Wrong password!',
        })
    }
    else {
        res.status(404).json({
        status: 'Failed',
        message: 'User does not exist on our database',
        })
    }
})

// UPDATING NAME AND PASSWORD
app.put('/users/:userId', function(req, res){
    const { userId } = req.params
    const { email, firstName, lastName, password} = req.body
    const currentUser = users.find((el) => `${el.id}` === userId)
    if (currentUser) {
        if (email) {
            return res.status(403).json({
                status: 'Forbidden',
                message: 'User is not allowed to edit email',
            })
        }
        const newData = { 
            ...currentUser,
            firstName: firstName,
            lastName: lastName,
            password: password,
        }
        const index = users.findIndex((el) => el.id === Number(newData.id))
        users[index] = newData;
        res.status(200).json({
            status: 'Success',
            message: `User details have been updated successfully`,
            data: newData,
        }) 
    }
    res.status(404).json({
        status: 'Failed',
        message: 'User does not exist on our database',
    })
})

app.listen(5000, () => {
    console.log(`Example app listening at http://localhost:${5000}`);
});