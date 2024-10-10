import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 5353;
const uri = process.env.URI;

app.use(express.json());

mongoose.connect(uri)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

    const mySchema = new mongoose.Schema({
        advice: { type: String, required: true },
        category: { type: String, required: true},
    });

    const MyModel = mongoose.model("advices", mySchema);


app.get("/advices", async (req, res) => {
    try{
        const advices = await MyModel.find();
        res.json(advices);
    }
    catch(error){
        res.json(error);
    }
})

app.get("/random", async (req, res) => {
    try{
        const advices = await MyModel.find();
        const randomIndex = Math.floor(Math.random() * advices.length);
        const advice = advices[randomIndex];
        res.json(advice);
    }
    catch(error){
        res.json(error);
    }
})

app.get("/categories/", async (req, res) => {
    try{
        if(!req.query.category){
            res.json({
               Categories : ["general", "programming", "career", "burnout", "motivation", "productivity", "networking", "professional development", "confidence", "learning"]
            });
        }
        else if(req.query.category){
            const category = req.query.category.toLowerCase();
            console.log(category);
            const advice = await MyModel.find( { category: category } );
            console.log(advice);
            if(advice.length == 0){
                res.json({error: `${category} is not a category`});
            }
            else{
                res.json(advice);
            }
        }
    }
    catch(error){
        res.json(error);
    }
})

app.listen(port, "0.0.0.0", () => {
    console.log(`Yungflash API started running on port ${port}`);
})