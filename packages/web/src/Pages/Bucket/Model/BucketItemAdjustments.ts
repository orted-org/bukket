import { BucketItemType } from "./Types";

function adjustRemark(bucketItemList: BucketItemType[], bucketItemId: string, text: string) {
    for (let i = 0; i < bucketItemList.length; i++) {
        if (bucketItemList[i].bucketItemId === bucketItemId) {
            bucketItemList[i].remark = text;
            return bucketItemList
        }
    }
}
function adjustNewItem(bucketItemList: BucketItemType[], newBucketItem: BucketItemType) {
    for (let i = 0; i < bucketItemList.length; i++) {
        if (bucketItemList[i].bucketItemId === newBucketItem.bucketItemId) {
            bucketItemList[i] = newBucketItem
            return bucketItemList
        }
    }
    bucketItemList.push(newBucketItem)

    return bucketItemList
}
function adjustDeleteItem(bucketItemList: BucketItemType[], bucketItemId: string) {
    const returnList: BucketItemType[] = []
    for (let i = 0; i < bucketItemList.length; i++) {
        if (bucketItemList[i].bucketItemId !== bucketItemId) {
            returnList.push(bucketItemList[i])
        }
    }
    return returnList
}
export { adjustRemark, adjustNewItem, adjustDeleteItem }