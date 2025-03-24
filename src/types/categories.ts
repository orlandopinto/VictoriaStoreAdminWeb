export type Category = {
     _id: string,
     categoryName: string,
     slug: string,
     categoryDescription: string,
     public_id: string,
     secure_url: string,
     createdAt?: Date | null
     updatedAt?: Date | null
}

export type SubCategory = {
     _id: string,
     subCategoryName: string,
     slug: string,
     CategoryId: string,
     subCategoryDescription: string,
     createdAt?: Date | null
     updatedAt?: Date | null
}