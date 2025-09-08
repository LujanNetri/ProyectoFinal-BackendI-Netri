import Product from "./models/product.model.js"

class ProductManager
{
    async getProducts({ page = 1, limit = 10, sort, category, status } = {}) {
    try {
        const query = {}

        if (category) query.category = category
        if (status === "true") query.status = true
        if (status === "false") query.status = false

        const options = { page, limit, lean: true }

        if (sort) {
        options.sort = { price: sort === "asc" ? 1 : -1 }
        }

        return await Product.paginate(query, options)
    } catch (err) {
        console.error("Error en getProducts:", err)
        return [];
    }
    }

    async getAllProducts()
    {
        return await Product.find().lean()
    }

    async getProductById(id)
    {
        return await Product.findById(id).lean()
    }

    async addProduct({title,description,price,thumbnail,code,stock,category,status})
    {
        if(!title || !description || !price || !thumbnail || !code || !stock || !category || !status)
        {
            console.log("Faltan campos obligatorios")
            return
        }

        const exist = await Product.findOne({ code })

        if(exist)
        {
            console.log("Ya existe un producto con el código: ${code}")
            return 
        }

        const newProduct = await Product.create(
        {
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            status,
            category
        })

        return newProduct
    }

    async updateProduct(id,data)
    {       
        return await Product.findByIdAndUpdate(id,data,{new: true})
    }

    async deleteProducts(id)
    {
        return await Product.findByIdAndDelete(id)
    }
}
 
export default new ProductManager()
