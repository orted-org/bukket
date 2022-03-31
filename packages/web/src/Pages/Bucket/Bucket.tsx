import styled from "styled-components";
import BottomBar from "./BottomBar/BottomBar";
import { useEffect, useRef, useState } from "react";
import React from "react";
import { BucketItemType, BucketType } from "./Model/Types";
import LoadingAnimation from "../../Components/LoadingAnimation";
import SearchImplement from "./Model/Search";
import { PrimaryAlert, PrimaryAlertProps } from "../../Components/Alerts";
import { AlertContext, TabContext } from "../../AuxComponents/Contexts";
import getBucketItems from "./Model/GetBucketItems";
import {
  adjustDeleteItem,
  adjustNewItem,
  adjustRemark,
} from "./Model/BucketItemAdjustments";
import { useHistory } from "react-router";

const BucketItemList = React.lazy(() => import("./BucketItem/BucketItemList"));
const BucketMore = React.lazy(() => import("./BucketMore/BucketMore"));
const BucketSettingList = React.lazy(
  () => import("./BucketSetting/BucketSettingList")
);
const BucketRequests = React.lazy(
  () => import("./BucketSetting/BucketRequests")
);
const BucketManageUsers = React.lazy(
  () => import("./BucketSetting/BucketManageUsers")
);
const BucketEdit = React.lazy(() => import("./BucketSetting/BucketEdit"));
const BucketCreateEdit = React.lazy(
  () => import("./BucketSetting/CreateEditItem")
);
const BucketItemRemark = React.lazy(
  () => import("./BucketItem/BucketItemRemark")
);

const MainContainer = styled.section`
  min-height: calc(100vh - 50px);
  height: fit-content;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  font-weight: 400;
  z-index: 1;
  padding-top: 60px;
  color: ${(props) => props.theme.primaryText};
`;
const TopContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 60px;
  background: ${(props) => props.theme.primaryLayer};
  width: 100%;
  z-index: 8;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 10px 10px;
  padding-left: 50px;
  text-align: right;
  color: ${(props) => props.theme.secondaryText};
  font-weight: 400;
`;

function BucketList() {
  document.title = "Bukket";
  const history = useHistory();
  const [activeTab, setActiveTab] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [editingItem, setEditingItem] = useState<BucketItemType>();
  const [bucketItemList, setBucketItemList] = useState<BucketItemType[]>();
  const [bucketDetails, setBucketDetails] = useState<BucketType>();
  const [showResult, setShowResult] = useState<BucketItemType[]>();
  const [alertConfig, setAlertConfig] = useState<PrimaryAlertProps>({
    isShowing: false,
    level: 1,
    closeOnClick: onAlertClose,
  });
  const isAdmin = useRef(false);
  const isNotification = useRef(true);
  const userCount = useRef(0);
  function onAlertClose() {
    setAlertConfig((prevState) => {
      return { ...prevState, isShowing: false };
    });
  }
  if (activeTab === 7) isNotification.current = false;
  useEffect(() => {
    setShowResult(bucketItemList);
  }, [bucketItemList]);
  useEffect(() => {
    const bucketId = window.location.href.split("=")[1];
    getBucketItems(bucketId)
      .then((data) => {
        isAdmin.current = data.isAdmin;
        userCount.current = data.userCount;
        isNotification.current = data.isNotification;
        setBucketDetails(data.bucketDetails);
        setBucketItemList(data.bucketItemList);
      })
      .catch((err) => {
        history.push("/join-bucket", { bucketId });
      });
  }, [history]);
  if (bucketDetails === undefined || bucketItemList === undefined)
    return <LoadingAnimation />;
  return (
    <MainContainer>
      <PrimaryAlert {...alertConfig} />
      <TopContainer>{bucketDetails?.bucketName}</TopContainer>
      <BottomBar
        isAdmin={isAdmin.current}
        isNotification={isNotification.current}
        active={activeTab}
        searchText={searchText}
        onSearchChange={(text) => {
          setSearchText(text);
          if (bucketItemList) {
            const newResult = SearchImplement(bucketItemList, text);
            setShowResult(newResult);
          }
        }}
        onClick={(id) => {
          setActiveTab(id);
        }}
      />
      <TabContext.Provider value={{ activeTab, setActiveTab }}>
        <AlertContext.Provider value={{ alertConfig, setAlertConfig }}>
          {activeTab === 1 && showResult !== undefined && (
            <BucketItemList
              isAdmin={isAdmin.current}
              onClearPressed={() => {
                setSearchText("");
                setShowResult(bucketItemList);
              }}
              onDeleteItem={(id) => {
                const updatedItemList = adjustDeleteItem(bucketItemList, id);
                setBucketItemList(updatedItemList);
                const newResult = SearchImplement(bucketItemList, searchText);
                setShowResult(newResult);
              }}
              bucketId={bucketDetails.bucketId}
              searchText={searchText}
              bucketItemList={showResult}
              onEditClicked={(item: BucketItemType) => {
                setEditingItem(item);
                setActiveTab(9);
              }}
            />
          )}
          {activeTab === 3 && bucketDetails !== undefined && (
            <BucketMore
              isAdmin={isAdmin.current}
              bucketDetails={bucketDetails}
              userCount={userCount.current}
              itemCount={bucketItemList?.length || 0}
            />
          )}
          {activeTab === 4 && (
            <BucketSettingList
              bucketDetails={bucketDetails}
              isNotification={isNotification.current}
            />
          )}
          {activeTab === 5 && showResult !== undefined && (
            <BucketCreateEdit
              itemDetails={editingItem !== undefined ? editingItem : null}
              bucketId={bucketDetails.bucketId}
              onNewItem={(item) => {
                setEditingItem(undefined);
                const updatedItemList = adjustNewItem(bucketItemList, item);
                setBucketItemList(updatedItemList);
                const newResult = SearchImplement(bucketItemList, searchText);
                setShowResult(newResult);
              }}
            />
          )}
          {activeTab === 6 && (
            <BucketEdit
              currentBucketDetails={bucketDetails}
              onClose={(updatedBucketDetails) => {
                setBucketDetails(updatedBucketDetails);
              }}
            />
          )}

          {activeTab === 7 && (
            <BucketRequests
              bucketId={bucketDetails.bucketId}
              updateCount={(num: number) => {
                userCount.current += num;
              }}
            />
          )}
          {activeTab === 8 && (
            <BucketManageUsers
              bucketId={bucketDetails.bucketId}
              updateCount={(num: number) => {
                userCount.current += num;
              }}
            />
          )}
          {activeTab === 9 && editingItem && (
            <BucketItemRemark
              bucketId={bucketDetails.bucketId}
              currentBucketItemDetails={editingItem}
              onClose={(bucketItemDetails) => {
                setEditingItem(undefined);
                const newList = adjustRemark(
                  bucketItemList,
                  bucketItemDetails.bucketItemId,
                  bucketItemDetails.remark || ""
                );
                setBucketItemList(newList);
                setActiveTab(1);
              }}
            />
          )}
        </AlertContext.Provider>
      </TabContext.Provider>
    </MainContainer>
  );
}

export default BucketList;
