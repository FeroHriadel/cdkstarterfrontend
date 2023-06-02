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
    category?: string | {category: string, name: string, image?: string};
    tags?: string[] | {tagId: string, name: string}[];
    mainImage?: string;
    images?: string[];
    price?: string;
    quantity?: string;
    type?: '#ITEM';
    createdAt?: string;
    updatedAt?: string;
}