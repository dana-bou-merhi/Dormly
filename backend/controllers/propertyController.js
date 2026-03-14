import { Property } from "../models/property.model.js";

export const getProperties = async(req, res)=>{
    try {
        const dorms= await Property.find();// it get everythinh from the database 
        res.status(200).json({
            success: true,
            count: dorms.length,
            properties: dorms
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            messsage:"Failed To fetch the properties from the database"
        })
        
    }
}