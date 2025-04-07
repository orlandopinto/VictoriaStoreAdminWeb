export type Product = {
     _id: string,
     category_id: string,
     subCategories: string[],
     title: string,
     subTitle: string,
     productDescription: string,
     public_id: string,
     secure_url: string,
     isActive: boolean,
     productImages: ProductImages[] | null,
     productVideos: ProductVideos[] | null,
     variants: Variant[] | null,
     rating_id: string,
     reviews: Review[],
     createdAt?: Date | null,
     updatedAt?: Date | null
}

export type ProductImages = {
     public_id: string,
     secure_url: string
}

export type ProductVideos = {
     public_id: string,
     secure_url: string
}

export type Review = {
     product_id: string,
     user_Id: string,
     rating: string,
     count: number,
     comment: string | null
}

export type Variant = {
     product_id: string,
     price: string,
     discount_id: string,
     tax_id: string,
     sku: string | null,
     in_stock: Boolean,
     stock: Number,
     width: Number | null,
     height: Number | null,
     length: Number | null,
     weight: Number | null,
     sort_order: Number,
     attributes: Attribute[]
}

export type Attribute = {
     attributeName: string,
     attributeValue: string
}

export type Taxes = {
     _id: string,
     taxValue: any
}