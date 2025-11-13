import foodModel from "../models/foodModel.js";
import fs from 'fs';

//to add food here

const addFood = async (req, res) => {

    const image_filename = req.file ? `${req.file.filename}` : '';

    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename
    });
    try {
        await food.save();
        res.json({ success: true, message: "Food is Added" });
    } catch (error) {
        console.log(error);
        // optional: clean up uploaded file on error
        if (image_filename) {
            try { fs.unlinkSync(`uploads/${image_filename}`); } catch {}
        }
        res.status(500).json({ success: false, message: "ERROR" });
    }
}

//all food list

const listFood = async (req,res) =>{
    try {
        const foods = await foodModel.find({});
        res.json({success:true,data:foods})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"error"})
    }
}

//to remove food here (safe)
const removeFood = async (req, res) => {
    try {
        const { id } = req.body;
        const food = await foodModel.findById(id);
        if (!food) {
            return res.status(404).json({ success: false, message: "Food not found" });
        }
        if (food.image) {
            const filePath = `uploads/${food.image}`;
            try {
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            } catch {}
        }
        await foodModel.findByIdAndDelete(id);
        res.json({ success: true, message: "Food Removed" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error" });
    }
}

export {addFood,listFood,removeFood};