import HowToCreate from "../Resources/how_to_create.png";
import UserTabBar from "../Resources/user_tab_bar.png";
import BucketInfoBar from "../Resources/bucket_info_bar.png";
const whyBucket: JSX.Element[] = [
  <p>With the outbreak of COVID, everything has turned to online mode.</p>,
  <p>
    Doesn't matter if you are a schooling child, a teenager attending a college,
    or a job holder, all the work has switched to online, and links have become
    a part of your day-to-day life.
  </p>,
  <p>This is where Bukket comes to your rescue.</p>,
  <p>
    Make a bucket for different needs. Store and organize them in your own way.
  </p>,
  <p>
    Add members to your bucket or join the buckets that you are concerned with.
  </p>,
  <p>
    For instance, if you are a student, ask your class representative to create
    a bucket for your section and share all the important links there instead of
    other platforms whose primary use is not for work.
  </p>,
  <p>
    This way, you don't need to surf through long chats to get the link that's
    probably drowned by spams or blame yourself for deleting the chat history by
    mistake.
  </p>,
];
const howToCreateBucket: JSX.Element[] = [
  <p>
    If you are a new user, then you will land at a page like one shown in the
    screenshot.
  </p>,
  <img src={HowToCreate} alt="" />,
  <p>
    To create a new bucket, just click on the <b>Create / Join Bucket </b>
    button.
  </p>,
  <p>
    Otherwise,you can open the sidebar and go to <b>Create / Join</b>
  </p>,
  <p>
    Give your bucket a name (at least 3 characters long) and a Description that
    describes what this bucket is about and click on <b>Create Bucket.</b>
  </p>,
  <p>
    And...{" "}
    <i>
      <b>It's done!</b>{" "}
    </i>{" "}
    As simple as that.
  </p>,
  <p>
    You will be automatically taken to the page of the bucket you have created.
  </p>,
  <p>
    Since, you are the creator(i.e. the admin) of this bucket, you can perform
    operations like add new members and add several different bucket items. Also
    you can remove those.
  </p>,
];
const howToJoin: JSX.Element[] = [
  <p>Ask for the joining link of the bucket you want to be part of.</p>,
  <p>
    Click on the link, and a joining request will be sent to the admin of the
    bucket.
  </p>,
  <p>
    <b>OR </b>
    You can go to <b>Create/Join</b> from sidebar and put the link and manually
    make request.
  </p>,
  <p>
    After the admin approves your request, you can browse through the bucket.
  </p>,
];
const howToAddItem: JSX.Element[] = [
  <b>Only admin of the bucket can add any new item</b>,
  <p>
    Navigate to the admin tab from by tapping on the bottom right icon as shown
    below
  </p>,
  <img src={UserTabBar} alt="" />,
  <p>
    Go to <b>+ Add new item</b>
  </p>,
  <p>
    Give your bucket item a name and a description. You can give it a link and
    also tags to make the item more verbose.
  </p>,
  <p>
    Tab on <b>Create</b> and you got your item created.
  </p>,
];
const howToAddMembers: JSX.Element[] = [
  <p>Navigate to the bucket info tab as shown below</p>,
  <img src={BucketInfoBar} alt="" />,
  <p>
    Tap on <b>Copy</b> button to copy the joining link, and share it with the
    people you want to add and ask him/her to join according to steps mentioned
    above.
  </p>,
  <p>
    Go to <b>Requests</b> from the admin tab
  </p>,
  <p>
    Select the people you want to add to bucket and tap on{" "}
    <b>tick (or accept) </b>button.
  </p>,
];
export {
  whyBucket,
  howToCreateBucket,
  howToJoin,
  howToAddItem,
  howToAddMembers,
};
