const express = require('express');
const bcrypt = require('bcrypt');

const app = express();

app.use(express.json());

app.get('/', function(req, res) {
    res.send('</h1>Hello World</h1>');
})

const users = [];

app.get('/users', (req, res) =>{
    res.json(users);
})

app.post('/users', async (req,res) => {
    try {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        console.log(salt);
        console.log(hashedPassword);
        const user = { name: req.body.name, password: hashedPassword}
        users.push(user);
        res.status(201).send();
    }
    catch {
        res.status(401).send();
    }
})

app.post('/users/login', async (req, res) => {
    const user = users.find(u => u.name === req.body.name)
    if(user == null) {
        return res.status(400).send('User not availabale');
    }
    try {
        if(await bcrypt.compare(req.body.password, user.password)){
            return res.status(200).send('Success');
        } else {
            return res.status(200).send('Not Allowed');
        }
    } catch {
        res.status(500).send();
    }
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));