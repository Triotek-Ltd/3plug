export default function setup(frm, registerEvent) {
  // Refresh event to dynamically set button type
  registerEvent("refresh", async (frm, updateForm, doc, updateDoc) => {
    const newButtons = [];

    if (frm.type === "Invoice") {
      newButtons.push({
        text: "Offload",
        action: () => {
          updateForm({
            ...frm,
            type: "Quote",
          });
        },
      });
    } else {
      newButtons.push({
        text: "Load",
        action: () => {
          updateForm({
            ...frm,
            type: "Invoice",
          });
        },
      });
    }

    const item = () => {
      return <div>item</div>;
    };

    updateDoc({ ...doc, buttons: newButtons, componentBefore: item });
  });

  registerEvent("before_save", async (frm) => {
    console.log("Before Save Triggered for", frm);
  });

  registerEvent("after_save", async (frm) => {
    console.log("Order saved:", frm);
  });
}

import React from "react";
