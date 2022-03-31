import { BucketItemType } from "./Types";

function includesString(str1: string, str2: string): boolean {
    if (str1.toLowerCase().includes(str2.toLowerCase())) return true;
    return false;
}
function SearchImplement(bucketItemList: BucketItemType[], searchText: string) {
    const returnList: BucketItemType[] = [];
    for (let i = 0; i < bucketItemList.length; i++) {
        const item = bucketItemList[i];
        if (includesString(item.bucketItemName, searchText)) {
            if (!returnList.includes(item)) returnList.push(item);
        }
        else if (includesString(item.bucketItemCreateDate, searchText)) {
            if (!returnList.includes(item)) returnList.push(item);
        } else {
            for (let j = 0; j < item.bucketItemTags.length; j++) {
                const tag = item.bucketItemTags[j];

                if (includesString(tag, searchText))
                    if (!returnList.includes(item)) returnList.push(item);
            }
        }
    }
    return returnList;
}
export default SearchImplement