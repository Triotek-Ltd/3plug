import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faSave } from "@fortawesome/free-solid-svg-icons";
import WorkflowStatusTable from "@/components/pages/detail/settings/WorkflowStatusTable";

const ACTIONS = [
  "submit",
  "approve",
  "reject",
  "edit",
  "publish",
  "archive",
  "restore",
];

const WorkflowTable = ({ workflow = {}, onWorkflowChange }) => {
  const [newStatus, setNewStatus] = useState({
    name: "",
    actions: [{ action: "", nextStatus: "" }],
    permissions: {
      admin: {},
      editor: {},
      viewer: {},
    },
  });

  const [editingIndex, setEditingIndex] = useState(null);
  const [adding, setAdding] = useState(false);
  const [statuses, setStatuses] = useState(
    Array.isArray(workflow.statuses) ? workflow.statuses : []
  );

  const handleNewStatusChange = (e) => {
    const { name, value } = e.target;
    setNewStatus((prevStatus) => ({
      ...prevStatus,
      [name]: value,
    }));
  };

  const handleActionChange = (index, field, value) => {
    const updatedActions = [...newStatus.actions];
    updatedActions[index] = { ...updatedActions[index], [field]: value };
    setNewStatus((prevStatus) => ({
      ...prevStatus,
      actions: updatedActions,
    }));
  };

  const addActionField = () => {
    setNewStatus((prevStatus) => ({
      ...prevStatus,
      actions: [...prevStatus.actions, { action: "", nextStatus: "" }],
    }));
  };

  const removeActionField = (index) => {
    const updatedActions = newStatus.actions.filter((_, i) => i !== index);
    setNewStatus((prevStatus) => ({
      ...prevStatus,
      actions: updatedActions,
    }));
  };

  const handlePermissionChange = (statusId, role, action, checked) => {
    const updatedStatuses = statuses.map((status) =>
      status.id === statusId
        ? {
            ...status,
            permissions: {
              ...status.permissions,
              [role]: {
                ...status.permissions[role],
                [action]: checked,
              },
            },
          }
        : status
    );

    setStatuses(updatedStatuses);
    onWorkflowChange({ ...workflow, statuses: updatedStatuses });
  };

  const handleSaveNewStatus = () => {
    if (!newStatus.name) {
      alert("Name is required.");
      return;
    }

    const updatedStatuses = [...statuses, newStatus];
    onWorkflowChange({ ...workflow, statuses: updatedStatuses });

    setNewStatus({
      name: "",
      actions: [{ action: "", nextStatus: "" }],
      permissions: {
        admin: {},
        editor: {},
        viewer: {},
      },
    });
    setAdding(false);
  };

  const handleAddStatus = () => {
    setAdding(true);
  };

  const handleEditStatus = (index) => {
    setEditingIndex(index);
    setNewStatus(statuses[index]);
    document.querySelector(`tr[data-index="${index}"]`).scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const handleSaveStatus = (index) => {
    const updatedStatuses = statuses.map((status, i) =>
      i === index ? newStatus : status
    );
    onWorkflowChange({ ...workflow, statuses: updatedStatuses });
    setEditingIndex(null);
    setNewStatus({
      name: "",
      actions: [{ action: "", nextStatus: "" }],
      permissions: {
        admin: {},
        editor: {},
        viewer: {},
      },
    });
  };

  const handleDeleteStatus = (index) => {
    const updatedStatuses = statuses.filter((_, i) => i !== index);
    onWorkflowChange({ ...workflow, statuses: updatedStatuses });
  };

  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white shadow-soft-xl rounded-2xl bg-clip-border mb-4">
      <div className="flex-auto p-4">
        <p className="mb-1 font-sans text-sm font-semibold leading-normal">
          Workflow Statuses
        </p>
        <div className="overflow-auto">
          <WorkflowStatusTable
            statuses={statuses}
            newStatus={newStatus}
            editingIndex={editingIndex}
            handleActionChange={handleActionChange}
            handleNewStatusChange={handleNewStatusChange}
            handleSaveStatus={handleSaveStatus}
            handleEditStatus={handleEditStatus}
            handleDeleteStatus={handleDeleteStatus}
            handlePermissionChange={handlePermissionChange}
            addActionField={addActionField}
            removeActionField={removeActionField}
          />

          {adding ? (
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                value={newStatus.name}
                onChange={handleNewStatusChange}
                className="w-full h-fit px-2 py-2 m-1 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter status name"
              />
              <div className="flex flex-col space-y-1">
                {newStatus.actions.map((actionObj, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="text"
                      value={actionObj.action}
                      onChange={(e) =>
                        handleActionChange(index, "action", e.target.value)
                      }
                      className="w-full px-2 py-2 m-2 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter action"
                    />
                    <input
                      type="text"
                      value={actionObj.nextStatus}
                      onChange={(e) =>
                        handleActionChange(index, "nextStatus", e.target.value)
                      }
                      className="w-full px-2 py-2 m-2 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter next status"
                    />
                    <button
                      type="button"
                      onClick={() => removeActionField(index)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addActionField}
                  className="px-3 py-2 w-1/3 m-2 text-xs font-semibold text-white bg-purple-500 rounded-md hover:bg-purple-600"
                >
                  Add Action
                </button>
              </div>
              <button
                type="button"
                onClick={handleSaveNewStatus}
                className="px-3 py-3 w-1/2 text-xs font-semibold text-white bg-purple-500 rounded-md hover:bg-purple-600"
              >
                Save Status
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={handleAddStatus}
                className="px-3 py-2 text-xs font-semibold text-white bg-purple-500 rounded-md hover:bg-purple-600"
              >
                Add Status
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkflowTable;
