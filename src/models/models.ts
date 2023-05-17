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