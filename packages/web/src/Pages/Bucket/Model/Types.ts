interface BucketItemType {
    bucketItemId: string,
    bucketItemName: string,
    bucketItemDescription: string,
    bucketItemCreateDate: string,
    bucketItemLink: string,
    bucketItemTags: string[]
    remark?: string
}
interface BucketType {
    bucketId: string,
    bucketName: string,
    bucketDescription: string,
    bucketCreateDate: string,
    bucketAdmin: string,
}
interface UserType {
    userName: string;
    userEmail: string;
    userId: string;
}
export type { BucketItemType, BucketType, UserType }