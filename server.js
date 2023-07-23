const express= require('express');
const cors= require('cors');
const app = express();
const {connect, client}= require('./db');
const { ObjectId } = require('mongodb');
// const { ObjectId } = require('mongodb').ObjectId;
require('dotenv').config();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());
connect();
const port= process.env.PORT || 3000;

app.get('/health', (req, res) => {
    res.sendStatus(200);
  });

app.get('/', function(req, res){
    // res.send('hi');
    const code= `Welcome to nyanpaste!
    
Use the toolbox at the top to create new file and share your code`;
    res.status(200).render('codePage', {
        code,
        lineNo: code.split('\n').length,
        language: "plaintext"
    });
});

app.get('/new', function(req, res){
    // const code= `Welcome to nyanpaste!`;
    res.render('newPage',{
        // code,
        value: ""
        // lineNo: value.split('\n').length
    });
});


app.post('/save', async function(req, res){
    // const code= `Welcome to nyanpaste!`;
    const value= req.body.value;
    const name= req.params;
    const customNameInput = req.body.customName;
    // console.log(customNameInput);
    try{
        const db= client.db('nyanpaste');
        const pastesCollection= db.collection('pastes');
        const result= await pastesCollection.insertOne({
            value,
            customNameInput
        });
        // console.log(result);
        const id= result.insertedId.toString();
        // console.log(id);
        if(customNameInput){
            res.redirect(`/${customNameInput}`);
        }
        else
            res.redirect(`/${id}`);

    } catch(e){
        console.log(e);
        res.render("newPage", {value});
    }
});

app.get(`/:id`, async function(req, res){
    // const id= req.params.id;
    try{

        const db= client.db('nyanpaste');
        const pastesCollection= db.collection('pastes');
        let id= req.params.id;

        console.log(id);
        let paste="";
        console.log(id.length);

        if(id.length===24)
            paste= await pastesCollection.findOne( {_id: new ObjectId(id)} );
        else
            paste= await pastesCollection.findOne( {'customNameInput': id} );

        console.log(paste);
        if(!paste){
            console.log("not found");
        }

        res.render("codePage", {
            code: paste.value,
            lineNo: paste.value.split('\n').length
        });

    }catch(e){
        res.redirect('/');
    }
});





app.listen(port, function(){
    console.log(`listening on port ${port}`);
});