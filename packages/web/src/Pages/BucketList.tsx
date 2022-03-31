import styled from "styled-components";
import { useEffect, useState } from "react";
import { PrimaryButton } from "../MicroComponents/Buttons";
import { useHistory } from "react-router-dom";
import LoadingAnimation from "../Components/LoadingAnimation";
import { makeBucketsGetCall } from "../Http/Http.Bucket";
const MainContainer = styled.section`
  min-height: calc(100vh - 50px);
  height: fit-content;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  font-weight: 400;
  z-index: 1;
  padding-top: 70px;
  color: ${(props) => props.theme.primaryText};
`;
const TopContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  min-height: 60px;
  background: ${(props) => props.theme.primaryLayer};
  width: 100%;
  z-index: 8;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px 10px;
  color: ${(props) => props.theme.secondaryText};
  font-weight: 400;
  align-items: flex-end;
`;
const BucketNameItemContainer = styled.div`
  width: 95%;
  max-width: 450px;
  margin: 0 auto;
  height: fit-content;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
const IconContainer = styled.div`
  height: 22px;
  width: 22px;
  margin-right: 10px;
  opacity: 0.3;
`;
const BucketNameItem = styled.button`
  min-height: 70px;
  outline: none;
  border: none;
  cursor: pointer;
  font-size: 1em;
  margin: 5px 0;
  height: fit-content;
  background: ${(props) => props.theme.primaryLayer};
  width: 100%;
  text-decoration: none;
  color: ${(props) => props.theme.secondaryText};
  padding: 10px 10px;
  display: flex;
  align-items: center;
  box-shadow: inset 0 0 0 2px transparent;
  transition: all 0.3s;
  font-weight: 700;
  border-radius: 5px;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,
    rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
  &:hover {
    color: ${(props) => props.theme.secondaryBlue};
  }
`;

interface MainContainerProps {
  created: boolean;
}
interface BucketListItem {
  bucketId: string;
  bucketName: string;
}
function BucketList(props: MainContainerProps) {
  const history = useHistory();
  document.title = (props.created ? "Created" : "Joined") + " Buckets | Bukket";
  const Icon = (
    <IconContainer>
      <svg
        width="22"
        height="22"
        viewBox="0 0 154 133"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M115.181 133H38.3938L0 0H153.575L115.181 133ZM93.8979 95.9962H59.6773L42.567 36.7245H111.008L93.8979 95.9962Z"
          fill="currentColor"
        />
      </svg>
    </IconContainer>
  );

  const [bucketItems, setBucketItems] = useState<BucketListItem[]>();

  useEffect(() => {
    makeBucketsGetCall(props.created)
      .then((res) => res.json())
      .then((data) => {
        let buckets;
        const finalList: BucketListItem[] = [];
        if (props.created) {
          buckets = data.createdBuckets;
        } else {
          buckets = data.joinedBuckets;
        }
        for (let i = 0; i < buckets.length; i++) {
          const temp = {
            bucketId: buckets[i]._id,
            bucketName: buckets[i].bucketName,
          };
          finalList.push(temp);
        }
        setBucketItems(finalList);
      })
      .catch((err) => {
        history.push("/");
      });
  }, [history, props.created]);
  let BucketItemNameList;

  if (bucketItems) {
    if (bucketItems.length > 0) {
      BucketItemNameList = bucketItems.map((item) => {
        return (
          <BucketNameItem
            onClick={() => {
              history.push(`/bucket?id=${item.bucketId}`);
            }}
            key={item.bucketId}
          >
            {Icon}
            {item.bucketName}
          </BucketNameItem>
        );
      });
    } else {
      BucketItemNameList = (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <p style={{ textAlign: "center", margin: "30px" }}>
            Looks like you don't have any{" "}
            {props.created ? "created buckets" : "joined buckets"}. Creating or
            joining bucket is easy. Click the button below.
          </p>
          <PrimaryButton
            style={{ width: "fit-content" }}
            text="Create / Join Bucket"
            isLoading={false}
            onClick={() => {
              history.push("/create-join");
            }}
          />
        </div>
      );
    }
  } else {
    BucketItemNameList = <LoadingAnimation />;
  }
  return (
    <MainContainer>
      <TopContainer>
        {props.created ? "Created Buckets" : "Joined Buckets"}
      </TopContainer>
      <BucketNameItemContainer>{BucketItemNameList}</BucketNameItemContainer>
    </MainContainer>
  );
}

export default BucketList;
