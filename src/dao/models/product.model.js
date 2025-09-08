import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"

const producSchema = new mongoose.Schema(
    {
        title: String,
        description: String,
        price: Number,
        thumbnail: String,
        code: String,
        stock: Number,
        status: { type: Boolean, default: true },
        category: String
    }
)

producSchema.plugin(mongoosePaginate)

const Product = mongoose.model("Product", producSchema)
export default Product