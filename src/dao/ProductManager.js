const fs = require("fs")

class ProductManager
{
    static path = "src/data/products.json"

    static async getProducts()
    {
        if(fs.existsSync(this.path))
        {
            const data = await fs.promises.readFile(this.path,"utf-8")
            return JSON.parse(data)
        } else 
        {
            return []
        }
    }

    static async getProductById(id)
    {
        let products = await this.getProducts()

        let product = products.find(p => p.id == id)

        if(!product)
            return `No existe un producto con id ${id}`

        return product
    }

    static async addProduct({title,description,price,thumbnail,code,stock,category,status})
    {
        const products = await this.getProducts()

        if(!title || !description || !price || !thumbnail || !code || !stock || !category || !status)
        {
            console.log("Faltan campos obligatorios")
            return
        }

        const exist = products.find(p => p.code === code)

        if(exist)
        {
            console.log("Ya existe un producto con el código: ${code}")
            return 
        }

        let id = 1
        if(products.length > 0)
            id = Math.max(...products.map(p=>p.id)) + 1

        const newProduct = 
        {
            id,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            status,
            category
        }

        products.push(newProduct)

        await fs.promises.writeFile(this.path,JSON.stringify(products,null,2),"utf-8")

        return newProduct
    }

    static async updateProduct(id,data)
    {
        let products = await this.getProducts()
        let pos = products.findIndex((p) => p.id == id)

        if(pos === -1)
            return `No existe un producto con id: ${id}`
        
        if("id" in data)
            return `No es posible modificar el ID del producto`

        delete data.id
        products[pos] = {...products[pos],...data}

        await fs.promises.writeFile(this.path,JSON.stringify(products,null,2),"utf-8")

        return products[pos]
    }

    static async deleteProducts(id)
    {
        let products = await this.getProducts()
        let update = products.filter((p) => p.id != id)        

            if (products.length === update.length)
              return `No existe un producto con id ${id}`;

        await fs.promises.writeFile(this.path,JSON.stringify(update,null,2),"utf-8")

        return `Producto con ${id} eliminado`
    }
}
 
module.exports = ProductManager
