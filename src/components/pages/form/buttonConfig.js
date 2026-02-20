import {
  faPrint,
  faSms,
  faEnvelope,
  faList,
  faClone,
  faClipboard,
  faRedo,
  faUndo,
  faEdit,
  faPlus,
  faTrash,
  faChevronRight,
  faChevronLeft,
  faRefresh,
} from "@fortawesome/free-solid-svg-icons";
import { handleSendSMS } from "./actions/handleSendSMS";
import { handlePrint } from "./actions/handlePrint";
import { handleEmail } from "./actions/handleEmail";
import { handleJumpToField } from "./actions/handleJumpToField";
import { handleDuplicate } from "./actions/handleDuplicate";
import { handleCopyToClipboard } from "./actions/handleCopyToClipboard";
import { handleReload } from "./actions/handleReload";
import { handleRemindMe } from "./actions/handleRemindMe";
import { handleUndo } from "./actions/handleUndo";
import { handleRedo } from "./actions/handleRedo";
import { handleEditDocType } from "./actions/handleEditDocType";
import { handleNew } from "./actions/handleNew";
import { handleDeleteAction } from "./actions/handleDeleteAction";
import { handleNext } from "./actions/handleNext";
import { handlePrevious } from "./actions/handlePrevious";

export const defaultButtons = [
  {
    type: "primary",
    text: "Send SMS",
    action: (props) => handleSendSMS(props),
    icon: faSms,
    group: "Common",
  },
  {
    type: "primary",
    text: "Send Email",
    action: (props) => handleEmail(props),
    icon: faSms,
    group: "Common",
  },
  // {
  //   type: "primary",
  //   text: "Undo",
  //   action: (props) => handleUndo(props),
  //   icon: faUndo,
  //   group: "Common",
  // },
  // {
  //   type: "primary",
  //   text: "Redo",
  //   action: (props) => handleRedo(props),
  //   icon: faRedo,
  //   group: "Common",
  // },
  // {
  //   type: "primary",
  //   text: "Edit DocType",
  //   action: (props) => handleEditDocType(props),
  //   icon: faEdit,
  //   group: "Common",
  // },
  // {
  //   type: "primary",
  //   text: "Email",
  //   action: (props) => handleEmail(props),
  //   icon: faEnvelope,
  //   group: "Common",
  // },
  {
    type: "primary",
    text: "Duplicate",
    action: (props) => handleDuplicate(props), // Pass props here
    icon: faClone,
    group: "Common",
  },
  {
    type: "primary",
    text: "New Entry",
    action: (props) => handleNew(props),
    icon: faPlus,
    group: "Common",
  },
  // {
  //   type: "primary",
  //   text: "Copy to Clipboard",
  //   action: (props) => handleCopyToClipboard(props),
  //   icon: faClipboard,
  //   group: "Common",
  // },
  {
    type: "primary",
    text: "Delete",
    action: (props) => handleDeleteAction(props),
    icon: faTrash,
    group: "Common",
  },
  {
    type: "custom",
    action: (props) => handleReload(props),
    icon: faRefresh,
    toooltip: "Reload Document",
  },
  {
    type: "custom",
    action: (props) => handlePrevious(props),
    disabled: (props) => !props.data?._prev,
    icon: faChevronLeft,
    toooltip: "Previous Document",
  },
  {
    type: "custom",
    action: (props) => handleNext(props),
    disabled: (props) => !props.data?._next,
    icon: faChevronRight,
    toooltip: "Next Document",
  },

  {
    type: "custom",
    toooltip: "Print",
    action: (props) => handlePrint(props),
    icon: faPrint,
    className: "!text-green-700 !border-green-500",
  },
];
