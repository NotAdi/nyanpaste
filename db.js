const { MongoClient, ServerApiVersion  }= require('mongodb');
const dotenv= require('dotenv');
dotenv.config();

const password= process.env.DB_PASSWORD;
const username= process.env.DB_USERNAME;

// const uri= "mongodb+srv://"+username+":"+password+"@cluster0.8jean.mongodb.net/?retryWrites=true&w=majority";
const uri= process.env.DB_URI;
// mongodb+srv://<username>:<password>@cluster0.8jean.mongodb.net/?retryWrites=true&w=majority

const client= new MongoClient(uri,{
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
});

async function connect() {
    try {
      await client.connect();
      console.log('------------->>>Connected to MongoDB<<<----------');
    } catch (error) {
      console.log('Error connecting to MongoDB:', error);
    }
}

module.exports= {connect, client};