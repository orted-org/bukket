import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { TabContext } from "../../../AuxComponents/Contexts";
import { SVG } from "../../../AuxComponents/IconPack";
import { PrimaryButton } from "../../../MicroComponents/Buttons";
import { BucketItemType } from "../Model/Types";
import BucketItem from "./BucketItem";
const MainContainer = styled.section`
  height: fit-content;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  font-weight: 400;
  max-width: 450px;
  z-index: 1;
  padding-bottom: 30px;
  color: ${(props) => props.theme.primaryText};
  align-items: flex-end;
  padding-bottom: 30px;
`;

const TopContainer = styled.div`
  height: 45px;
  background: ${(props) => props.theme.primaryLayer};
  width: 100%;
  z-index: 8;
  display: flex;
  margin-top: 10px;
  max-width: 450px;
  border-radius: 5px;
  justify-content: space-between;
  padding-left: 100px;
  padding: 10px 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  color: ${(props) => props.theme.secondaryText};
  font-weight: 400;
  align-items: center;
  transition: all 0.5s;
  font-size: 0.95em;
  font-weight: 400;
  @media (max-width: 480px) {
    border-radius: 0;
    margin-top: 0;
  }
`;

const ItemContainer = styled.div`
  margin-top: 20px;
  @media (max-width: 480px) {
    padding: 0 10px;
  }
  width: 100%;
`;
const IconContainer = styled.div`
  height: fit-content;
  width: fit-content;
  margin-right: 10px;
  color: ${(props) => props.theme.secondaryText};
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s;
  & > svg {
    height: 22px;
    width: 22px;
  }
  &:active {
    opacity: 0.5;
  }
`;
const SearchText = styled.p`
  color: ${(props) => props.theme.secondaryBlue};
  font-weight: 700;
  margin-left: 5px;
`;
const Notice = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.theme.secondaryText};
  text-align: center;
`;
interface BucketItemListType extends BucketItemType {
  isOpen: boolean;
}

function onMoreClicked(
  bucketItemList: BucketItemListType[],
  id: string
): BucketItemListType[] {
  const returnList: BucketItemListType[] = [];
  for (let i = 0; i < bucketItemList.length; i++) {
    const temp = bucketItemList[i];
    if (bucketItemList[i].bucketItemId === id) {
      temp.isOpen = !temp.isOpen;
    } else {
      temp.isOpen = false;
    }
    returnList.push(temp);
  }
  return returnList;
}
interface BucketItemListProps {
  bucketId: string;
  bucketItemList: BucketItemType[];
  onEditClicked: (item: BucketItemType) => void;
  isAdmin: boolean;
  searchText: string;
  onClearPressed: () => void;
  onDeleteItem: (bucketItemId: string) => void;
}
function BucketItemList(props: BucketItemListProps) {
  const [bucketItemList, setBucketItemList] = useState<BucketItemListType[]>();
  const { setActiveTab } = useContext(TabContext);
  useEffect(() => {
    const finalList: BucketItemListType[] = [];
    if (props.bucketItemList !== undefined) {
      for (let i = 0; i < props.bucketItemList.length; i++) {
        const temp = { ...props.bucketItemList[i], isOpen: false };
        finalList.push(temp);
      }
    }
    setBucketItemList(finalList);
  }, [props.bucketItemList]);

  return (
    <MainContainer>
      <TopContainer
        style={{
          display: props.searchText.trim().length > 0 ? "flex" : "none",
        }}
      >
        <IconContainer onClick={props.onClearPressed}>
          {SVG.cross}
        </IconContainer>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Search result for<SearchText>{props.searchText}</SearchText>
        </div>
      </TopContainer>
      <ItemContainer>
        {bucketItemList !== undefined &&
          (bucketItemList.length > 0 ? (
            bucketItemList.map((item, index) => {
              return (
                <BucketItem
                  isAdmin={props.isAdmin}
                  key={index}
                  {...item}
                  bucketId={props.bucketId}
                  onDeleteItem={props.onDeleteItem}
                  onEditClicked={props.onEditClicked}
                  onMoreClicked={(id: string) => {
                    const updatedList = onMoreClicked(bucketItemList, id);
                    setBucketItemList(updatedList);
                  }}
                />
              );
            })
          ) : (
            <Notice>
              This bucket contains no bucket item.
              {props.isAdmin && (
                <PrimaryButton
                  style={{ marginTop: "20px" }}
                  text="Add New Item"
                  isLoading={false}
                  onClick={() => {
                    setActiveTab(5);
                  }}
                />
              )}
            </Notice>
          ))}
      </ItemContainer>
    </MainContainer>
  );
}

export default BucketItemList;
