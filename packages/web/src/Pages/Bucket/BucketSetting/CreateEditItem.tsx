import styled, { useTheme } from "styled-components";
import { useContext, useEffect, useState } from "react";
import { SVG } from "../../../AuxComponents/IconPack";
import { PrimaryInputText } from "../../../MicroComponents/InputText";
import { CheckLimit, Limits } from "../../../AuxComponents/LimitConfig";
import { BucketItemType } from "../Model/Types";
import { PrimaryButton } from "../../../MicroComponents/Buttons";
import { PrimaryTextArea } from "../../../MicroComponents/InputTextArea";
import { AlertContext, TabContext } from "../../../AuxComponents/Contexts";
import { compareTwoStringArrays, getArrayByValue } from "../Model/Utils";
import { makeItemAddEditCall } from "../../../Http/Http.Item";
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
`;

const Label = styled.label`
  width: 100%;
  height: fit-content;
  color: ${(props) => props.theme.secondaryText};
  margin-top: 15px;
`;
const TagAddButton = styled.button`
  height: 50px;
  width: 50px;
  border: none;
  outline: none;
  cursor: pointer;
  background: ${(props) => props.theme.primaryLayer};
  color: ${(props) => props.theme.secondaryText};
  display: flex;
  justify-content: center;
  align-items: center;
  & > svg {
    height: 25px;
    width: 25px;
  }
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
  color: ${(props) => props.theme.secondaryBlue};
  font-weight: 400;
  align-items: center;
  transition: all 0.5s;
  font-size: 0.95em;
  font-weight: 700;
  @media (max-width: 480px) {
    border-radius: 0;
    margin-top: 0;
  }
`;
const CreateContainer = styled.div`
  height: fit-content;
  width: 100%;
  max-width: 450px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
  padding: 20px 0;
  @media (max-width: 480px) {
    padding: 20px 10px;
  }
`;
const TagContainer = styled.div`
  width: 100%;
  height: fit-content;
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 30px;
`;
const TagItem = styled.div`
  height: 40px;
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.secondaryText};
  background: ${(props) => props.theme.primaryLayer};
  padding: 5px 0;
  padding-left: 10px;
  margin: 2px 0;
  margin-right: 8px;
  border-radius: 5px;
  overflow: hidden;
`;
const TagRemoveButton = styled.button`
  height: 40px;
  width: 40px;
  color: ${(props) => props.theme.secondaryRed};
  outline: none;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background: ${(props) => props.theme.primaryLayer};
  & > svg {
    height: 20px;
    width: 20px;
  }
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
interface CreateEditItemProps {
  itemDetails: BucketItemType | null;
  bucketId: string;
  onNewItem: (item: BucketItemType) => void;
}
function CreateEditItem(props: CreateEditItemProps) {
  const theme = useTheme() as any;
  const [tagText, setTagText] = useState("");
  const { setActiveTab } = useContext(TabContext);
  const { alertConfig, setAlertConfig } = useContext(AlertContext);
  const [isCreateButtonLoading, setIsCreatButtonLoading] = useState(false);
  const [bucketItemDetails, setBucketItemDetails] = useState<BucketItemType>({
    bucketItemId: "-1",
    bucketItemName: "",
    bucketItemDescription: "",
    bucketItemCreateDate: "",
    bucketItemTags: [],
    bucketItemLink: "",
  });
  const [currentItemDetails, setCurrentItemDetails] =
    useState<BucketItemType>();
  useEffect(() => {
    if (props.itemDetails) {
      setCurrentItemDetails(props.itemDetails);
      setBucketItemDetails({
        ...props.itemDetails,
        bucketItemTags: getArrayByValue(props.itemDetails.bucketItemTags),
      });
    }
  }, [props.itemDetails]);

  const isEdit = props.itemDetails ? true : false;

  let isCreateButtonEnabled =
    CheckLimit.bucketItemName(bucketItemDetails.bucketItemName) &&
    CheckLimit.bucketItemDescription(bucketItemDetails.bucketItemDescription) &&
    bucketItemDetails.bucketItemTags.length <= 10;

  if (currentItemDetails && isEdit) {
    let isContentDifferent = false;
    if (
      currentItemDetails.bucketItemName.trim() !==
      bucketItemDetails.bucketItemName.trim()
    )
      isContentDifferent = true;
    else if (
      currentItemDetails.bucketItemDescription.trim() !==
      bucketItemDetails.bucketItemDescription.trim()
    )
      isContentDifferent = true;
    else if (
      currentItemDetails.bucketItemLink.trim() !==
      bucketItemDetails.bucketItemLink.trim()
    )
      isContentDifferent = true;
    else if (
      !compareTwoStringArrays(
        currentItemDetails.bucketItemTags,
        bucketItemDetails.bucketItemTags
      )
    )
      isContentDifferent = true;
    isCreateButtonEnabled = isCreateButtonEnabled && isContentDifferent;
  }

  return (
    <MainContainer>
      <TopContainer>
        <IconContainer
          onClick={() => {
            if (isEdit) setActiveTab(1);
            else setActiveTab(4);
          }}
        >
          {SVG.leftArrow}
        </IconContainer>
        Create Item
      </TopContainer>
      <CreateContainer>
        <Label>
          Title <span style={{ color: theme.primaryRed }}>*</span>
          <PrimaryInputText
            limit={Limits.bucketItemName.max}
            placeholder="Enter item name"
            value={bucketItemDetails?.bucketItemName || ""}
            onChange={(e) => {
              setBucketItemDetails((prevState) => {
                return { ...prevState, bucketItemName: e.target.value };
              });
            }}
          />
        </Label>
        <Label>
          Description
          <PrimaryTextArea
            limit={Limits.bucketItemDescription.max}
            placeholder="Short description"
            value={bucketItemDetails.bucketItemDescription}
            onChange={(e) => {
              setBucketItemDetails((prevState) => {
                return { ...prevState, bucketItemDescription: e.target.value };
              });
            }}
          />
        </Label>
        <Label>
          Resource Link
          <PrimaryInputText
            value={bucketItemDetails.bucketItemLink}
            placeholder="Resource to link"
            onChange={(e) => {
              setBucketItemDetails((prevState) => {
                return { ...prevState, bucketItemLink: e.target.value };
              });
            }}
          />
        </Label>
        <Label>
          Tags
          <div style={{ display: "flex", width: "100%" }}>
            <PrimaryInputText
              isDisabled={bucketItemDetails.bucketItemTags.length >= 10}
              limit={Limits.tags.max}
              value={tagText}
              placeholder={
                bucketItemDetails.bucketItemTags.length >= 10
                  ? "Only 10 tags allowed"
                  : "Tag text"
              }
              onChange={(e) => {
                setTagText(e.target.value);
              }}
            />
            <TagAddButton
              style={{
                display:
                  bucketItemDetails.bucketItemTags.length >= 10
                    ? "none"
                    : "flex",
              }}
              onClick={() => {
                if (tagText.trim().length === 0) return;
                const tagItems = bucketItemDetails.bucketItemTags;
                tagItems.push(tagText);
                setBucketItemDetails((prevState) => {
                  return { ...prevState, bucketItemTags: tagItems };
                });
                setTagText("");
              }}
            >
              {SVG.add}
            </TagAddButton>
          </div>
        </Label>
        <TagContainer>
          {bucketItemDetails.bucketItemTags.map((item, index) => {
            return (
              <TagItem key={index}>
                {item}
                <TagRemoveButton
                  onClick={() => {
                    const tagItems = bucketItemDetails.bucketItemTags;
                    tagItems.splice(index, 1);
                    setBucketItemDetails((prevState) => {
                      return { ...prevState, bucketItemTags: tagItems };
                    });
                  }}
                >
                  {SVG.cross}
                </TagRemoveButton>
              </TagItem>
            );
          })}
        </TagContainer>
        <PrimaryButton
          isDisabled={!isCreateButtonEnabled}
          style={{ height: "50px" }}
          text={props.itemDetails ? "Save" : "Create"}
          isLoading={isCreateButtonLoading}
          onClick={() => {
            setIsCreatButtonLoading(true);
            makeItemAddEditCall(props.bucketId, bucketItemDetails, isEdit)
              .then((res) => {
                if (res.status === 200) {
                  setAlertConfig({
                    isShowing: true,
                    level: 1,
                    closeOnClick: alertConfig.closeOnClick,
                    heading: isEdit ? "Saved Changes" : "Item Created",
                    message: bucketItemDetails.bucketItemName,
                  });
                  res.json().then((data) => {
                    if (!isEdit) {
                      bucketItemDetails.bucketItemCreateDate =
                        data.bucketItemDetails.bucketItemCreateDate;
                      bucketItemDetails.bucketItemId =
                        data.bucketItemDetails._id;
                    }
                    props.onNewItem(bucketItemDetails);
                    if (isEdit) setActiveTab(1);
                    else setActiveTab(4);
                  });
                } else if (res.status === 403) {
                  if (isEdit) setActiveTab(1);
                  else setActiveTab(4);
                  setAlertConfig({
                    isShowing: true,
                    level: -1,
                    closeOnClick: alertConfig.closeOnClick,
                    heading: "Action Cannot be Performed",
                  });
                } else throw new Error();
              })
              .catch((err) => {
                if (isEdit) setActiveTab(1);
                else setActiveTab(4);
                setAlertConfig({
                  isShowing: true,
                  level: -1,
                  closeOnClick: alertConfig.closeOnClick,
                  heading: "Something Went Wrong",
                  message:
                    "Something unexpected happened, please try again later.",
                });
              });
          }}
        />
      </CreateContainer>
    </MainContainer>
  );
}

export default CreateEditItem;
