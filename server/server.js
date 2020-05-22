const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json({ limit: '10mb' }));

const port = process.env.PORT || 8080;
app.listen(port);
console.log(`Server listening to ${port}`);

app.get('/',(req,res)=>{
    console.log(req.query)
    res.status(200)
    return res.send("no data")
})

app.post('/',(req,res)=>{
    console.log(req.body.data)
    res.status(200)
    return res.send()
})

app.get('/uploadData',(req,res)=>{
    console.log(req)
    res.status(200)
    return res.send()
})

