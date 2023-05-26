export interface TagModel {
    name: string;
    tagId: string;
    type?: '#TAG';
    createdAt?: string;
    updatedAt?: string;
}

export interface CategoryModel {
    name: string;
    categoryId?: string;
    description?: string;
    image?: string;
    type?: '#CATEGORY';
    createdAt?: string;
    updatedAt?: string;
}

export interface ItemModel {
    name: string;
    itemId?: string;
    description?: string;
    category?: string;
    tags?: string[];
    mainImage?: string;
    images?: string[];
    price?: string;
    quantity?: string;
    type?: '#ITEM';
    createdAt?: string;
    updatedAt?: string;
}