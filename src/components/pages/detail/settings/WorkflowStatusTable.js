import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faSave,
  faTrash,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import TableTooltip from "@/components/tooltip/TableTooltip";

const WorkflowStatusTable = ({
  statuses,
  newStatus,
  editingIndex,
  handleActionChange,
  handleNewStatusChange,
  handleSaveStatus,
  handleEditStatus,
  handleDeleteStatus,
  handlePermissionChange,
  addActionField,
  removeActionField,
}) => {
  const [expandedRows, setExpandedRows] = useState(
    new Array(statuses.length).fill(false)
  );

  const toggleRow = (index) => {
    setExpandedRows((prev) =>
      prev.map((isExpanded, i) => (i === index ? !isExpanded : isExpanded))
    );
  };

  const handleNextStatusChange = (index, value) => {
    const updatedStatuses = statuses.map((status, i) =>
      i === index ? { ...status, nextStatus: value } : status
    );
    handleSaveStatus(index, updatedStatuses);
  };

  return (
    <table className="min-w-full bg-white border border-gray-200 rounded-lg mb-4 shadow-md">
      <thead className="bg-gradient-to-br from-purple-300 to-pink-300 text-black">
        <tr>
          <th className="py-1 px-4 text-left text-sm font-medium">
            <TableTooltip content="The name of the status">Name</TableTooltip>
          </th>
          <th className="py-1 px-4 text-left text-sm font-medium">
            <TableTooltip content="Actions that can be performed on the status">
              Actions
            </TableTooltip>
          </th>
          <th className="py-1 px-4 text-left text-sm font-medium">
            <TableTooltip content="The next status after actions">
              Next Status
            </TableTooltip>
          </th>
          <th className="py-1 px-4 text-right text-sm font-medium">
            <TableTooltip content="Edit or delete the status">
              {/* Edit/Delete */}
            </TableTooltip>
          </th>
        </tr>
      </thead>
      <tbody className="bg-pink-50">
        {statuses.map((status, index) => (
          <React.Fragment key={index}>
            <tr
              data-index={index}
              className={`border-b border-gray-200 ${
                index % 2 === 0 ? "bg-white" : "bg-pink-50"
              } hover:bg-pink-100 ${expandedRows[index] ? "bg-gray-100" : ""}`}
            >
              <td className="py-2 px-4 text-sm flex items-start text-gray-700">
                {index === editingIndex ? (
                  <input
                    type="text"
                    name="name"
                    value={newStatus.name}
                    onChange={handleNewStatusChange}
                    className="w-full px-2 py-2 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter name"
                  />
                ) : (
                  status.name
                )}
              </td>
              <td className="py-2 px-4 text-sm text-gray-700">
                {index === editingIndex ? (
                  <>
                    {newStatus.actions.map((action, i) => (
                      <div key={i} className="flex items-start mb-2">
                        <input
                          type="text"
                          value={action}
                          onChange={(e) =>
                            handleActionChange(i, e.target.value)
                          }
                          className="w-full px-2 py-2 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Enter action"
                        />
                        <button
                          type="button"
                          onClick={() => removeActionField(i)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addActionField}
                      className="px-3 py-1 text-xs font-semibold text-white bg-purple-500 rounded-md hover:bg-purple-600"
                    >
                      Add Action
                    </button>
                  </>
                ) : (
                  status.actions.join(", ")
                )}
              </td>
              <td className="py-2 px-4 text-sm text-gray-700">
                <input
                  type="text"
                  name="nextStatus"
                  value={status.nextStatus || ""}
                  onChange={(e) =>
                    handleNextStatusChange(index, e.target.value)
                  }
                  className="w-full px-2 py-2 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter next status"
                />
              </td>
              <td className="flex py-2 px-4 text-sm text-gray-700 justify-end">
                {index === editingIndex ? (
                  <button
                    type="button"
                    onClick={() => handleSaveStatus(index)}
                    className="text-green-500 hover:text-green-700"
                  >
                    <FontAwesomeIcon icon={faSave} />
                  </button>
                ) : (
                  <div className="flex flex-row gap-x-4">
                    <button
                      type="button"
                      onClick={() => handleEditStatus(index)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteStatus(index)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleRow(index)}
                      className={`ml-2 ${
                        expandedRows[index] ? "text-gray-600" : "text-gray-400"
                      } hover:text-gray-600`}
                    >
                      <FontAwesomeIcon
                        icon={expandedRows[index] ? faChevronUp : faChevronDown}
                      />
                    </button>
                  </div>
                )}
              </td>
            </tr>
            {expandedRows[index] && (
              <tr>
                <td colSpan={4}>
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                    <thead className="bg-gradient-to-tr from-pink-300 to-purple-300 text-xs text-pink-900">
                      <tr>
                        <th className="py-1 px-4 text-left text-sm font-medium">
                          <TableTooltip content="User group for permissions">
                            User Group
                          </TableTooltip>
                        </th>
                        {status.actions.map((action) => (
                          <th
                            key={action}
                            className="py-1 px-4 text-left text-sm font-medium"
                          >
                            <TableTooltip content={`Permission for ${action}`}>
                              {action}
                            </TableTooltip>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {["admin", "editor", "viewer"].map((role) => (
                        <tr
                          key={role}
                          className={`${
                            role === "viewer" ? "bg-white" : "bg-gray-50"
                          }`}
                        >
                          <td className="py-2 px-4 text-sm text-gray-700">
                            {role}
                          </td>
                          {status.actions.map((action) => (
                            <td
                              key={action}
                              className="py-2 px-4 text-sm text-center"
                            >
                              <input
                                type="checkbox"
                                checked={
                                  status.permissions[role]?.[action] || false
                                }
                                onChange={(e) =>
                                  handlePermissionChange(
                                    status.id,
                                    role,
                                    action,
                                    e.target.checked
                                  )
                                }
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};

export default WorkflowStatusTable;
