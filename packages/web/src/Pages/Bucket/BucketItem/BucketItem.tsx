import { useContext, useState } from "react";
import styled, { useTheme } from "styled-components";
import { AlertContext, TabContext } from "../../../AuxComponents/Contexts";
import { SVG } from "../../../AuxComponents/IconPack";
import { makeItemDeleteCall } from "../../../Http/Http.Item";
import { BucketItemType } from "../Model/Types";

const MainContainer = styled.div`
  outline: none;
  border: none;
  font-size: 0.9em;
  height: fit-content;
  margin: 8px 0;
  background: ${(props) => props.theme.primaryLayer};
  width: 100%;
  text-decoration: none;
  color: ${(props) => props.theme.secondaryText};
  padding: 10px 10px;
  text-align: left;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  transition: all 0.3s;
  border-radius: 5px;
  font-weight: 400;
  position: relative;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 5px 15px;
  border: 2px solid transparent;
`;
const BucketItemName = styled.div`
  font-size: 1.15em;
  margin-right: 5px;
  margin-bottom: 5px;
  font-weight: 700;
`;
const BucketItemLinkName = styled.a`
  text-decoration: none;
  color: inherit;
  display: flex;
  transition: all 0.3s;
  &:hover {
    color: ${(props) => props.theme.secondaryBlue};
  }
`;
const IconContainer = styled.div`
  height: fit-content;
  width: fit-content;
  margin-right: 5px;
  color: inherit;
  opacity: 0.4;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  & > svg {
    height: 22px;
    width: 22px;
  }
  &:active {
    color: ${(props) => props.theme.primaryText};
  }
`;
const BucketItemTagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
  margin-bottom: 5px;
`;
const BucketItemTagItem = styled.div`
  color: ${(props) => props.theme.primaryRed};
  margin-right: 10px;
  font-size: 1.03em;
  font-weight: 400;
`;
const PersonalRemarkHeading = styled.h4`
  display: flex;
  align-items: center;
  & > div {
    margin-left: 5px;
  }
`;
const MoreButton = styled.div`
  transition: all 0.3s;
  position: absolute;
  bottom: 5px;
  right: 10px;
  cursor: pointer;
`;
const ActionContainer = styled.div`
  display: flex;
  position: absolute;
  bottom: 5px;
  left: 10px;
  width: 70px;
  justify-content: space-between;
  & svg {
    height: 23px;
    width: 23px;
  }
`;
const AddEditButton = styled.button`
  height: fit-content;
  width: fit-content;
  border: none;
  outline: none;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.theme.secondaryText};
  cursor: pointer;
  background: ${(props) => props.theme.highlightColor};
  border-radius: 5px;
  margin-left: 10px;
  padding: 1px 5px;
  & > svg {
    margin-left: 5px;
    height: 15px;
    width: 15px;
  }
`;

interface BucketItemProps extends BucketItemType {
  isAdmin: boolean;
  isOpen: boolean;
  bucketId: string;
  onDeleteItem: (bucketItemId: string) => void;
  onMoreClicked: (id: string) => void;
  onEditClicked: (item: BucketItemType) => void;
}

function getLink(currentLink: string) {
  if (!currentLink.includes("http")) return "http://" + currentLink;
  return currentLink;
}

function BucketItem(props: BucketItemProps) {
  const { setActiveTab } = useContext(TabContext);
  const theme = useTheme() as any;
  const [onMouseOver, setOnMouseOver] = useState(false);
  const { alertConfig, setAlertConfig } = useContext(AlertContext);
  const isPhone = window.innerWidth <= 1024;
  const openStyle = {
    boxShadow: `box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px`,
    border: `2px solid ${theme.secondaryBlue}`,
    paddingBottom: props.isAdmin ? "40px" : "8px",
  };
  const actionButtons = (
    <ActionContainer
      style={{
        position: "absolute",
        bottom: "5px",
        right: "30px",
        display: "flex",
      }}
    >
      <IconContainer
        onClick={() => {
          if (window.confirm("Are you sure, you want to delete this item?"))
            makeItemDeleteCall(props.bucketId, props.bucketItemId)
              .then((res) => {
                if (res.status === 200) {
                  props.onDeleteItem(props.bucketItemId);
                  setAlertConfig({
                    isShowing: true,
                    level: 1,
                    closeOnClick: alertConfig.closeOnClick,
                    heading: "Item Deleted",
                  });
                } else if (res.status === 403) {
                  setAlertConfig({
                    isShowing: true,
                    level: -1,
                    closeOnClick: alertConfig.closeOnClick,
                    heading: "Action Cannot be Performed",
                  });
                } else throw new Error();
              })
              .catch((err) => {
                setAlertConfig({
                  isShowing: true,
                  level: -1,
                  closeOnClick: alertConfig.closeOnClick,
                  heading: "Something Went Wrong",
                  message:
                    "Something unexpected happened, please try again later.",
                });
              });
          else {
            setAlertConfig({
              isShowing: true,
              level: 0,
              closeOnClick: alertConfig.closeOnClick,
              heading: "Item Not Deleted",
            });
          }
        }}
      >
        {SVG.dustbin}
      </IconContainer>
      <IconContainer
        onClick={() => {
          props.onEditClicked(props);
          setActiveTab(5);
        }}
      >
        {SVG.pen}
      </IconContainer>
    </ActionContainer>
  );

  return (
    <MainContainer
      onMouseOver={() => {
        setOnMouseOver(true);
      }}
      onMouseLeave={() => {
        setOnMouseOver(false);
      }}
      style={props.isOpen ? openStyle : {}}
    >
      {props.isOpen && props.isAdmin && actionButtons}
      <BucketItemName>
        {props.bucketItemLink.trim().length > 0 ? (
          <BucketItemLinkName
            href={getLink(props.bucketItemLink)}
            target="_blank"
          >
            <IconContainer>{SVG.link}</IconContainer>
            {props.bucketItemName}
          </BucketItemLinkName>
        ) : (
          props.bucketItemName
        )}
      </BucketItemName>
      <BucketItemTagContainer
        style={{ height: props.isOpen ? "fit-content" : "1.4em" }}
      >
        <BucketItemTagItem style={{ color: theme.primaryGreen }}>
          {props.bucketItemCreateDate}
        </BucketItemTagItem>
        {props.bucketItemTags.map((item, index) => {
          return <BucketItemTagItem key={index}>{item}</BucketItemTagItem>;
        })}
      </BucketItemTagContainer>
      {props.isOpen && (
        <div>
          <div style={{ marginBottom: "5px" }}>
            {props.bucketItemDescription}
          </div>
          <PersonalRemarkHeading style={{ display: "flex" }}>
            Personal Remark
            <AddEditButton
              onClick={() => {
                props.onEditClicked(props);
              }}
            >
              {props.remark && props.remark.trim().length > 0 ? "Edit" : "Add"}
              {props.remark && props.remark.trim().length > 0
                ? SVG.pen
                : SVG.add}
            </AddEditButton>
          </PersonalRemarkHeading>
          <i>{props.remark}</i>
        </div>
      )}
      <MoreButton
        style={{ opacity: isPhone || onMouseOver ? "1" : "0" }}
        onClick={() => {
          props.onMoreClicked(props.bucketItemId);
        }}
      >
        {props.isOpen ? (
          <IconContainer style={{ margin: "0", transform: "rotate(180deg)" }}>
            {SVG.down}
          </IconContainer>
        ) : (
          <IconContainer style={{ margin: "0" }}>{SVG.down}</IconContainer>
        )}
      </MoreButton>
    </MainContainer>
  );
}

export default BucketItem;
