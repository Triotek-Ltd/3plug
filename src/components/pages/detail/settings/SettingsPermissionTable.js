import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faSave } from "@fortawesome/free-solid-svg-icons";
import TableTooltip from "@/components/tooltip/TableTooltip";
import DocLink from "@/components/pages/new/DocLink";

const PERMISSIONS = ["read", "write", "create", "update", "delete"];

const SettingsPermissionTable = ({ settings = {}, onPermissionsChange }) => {
  const [newPermission, setNewPermission] = useState({
    name: "",
    permissions: {
      read: false,
      write: false,
      create: false,
      update: false,
      delete: false,
    },
  });

  const [editingIndex, setEditingIndex] = useState(null);

  // Ensure permissions is an array
  const permissions = Array.isArray(settings.permissions)
    ? settings.permissions
    : [];

  const handleNewPermissionChange = (e) => {
    const value = e.value;
    const name = "name";
    setNewPermission((prevPermission) => ({
      ...prevPermission,
      [name]: value,
    }));
  };

  const handlePermissionCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setNewPermission((prevPermission) => ({
      ...prevPermission,
      permissions: {
        ...prevPermission.permissions,
        [name]: checked,
      },
    }));
  };

  const handleAddPermission = () => {
    const updatedPermissions = [
      ...permissions,
      {
        ...newPermission,
        permissions: Object.keys(newPermission.permissions)?.filter(
          (key) => newPermission.permissions[key]
        ),
      },
    ];

    onPermissionsChange({ ...settings, permissions: updatedPermissions });
    setNewPermission({
      name: "",
      permissions: {
        read: false,
        write: false,
        create: false,
        update: false,
        delete: false,
      },
    });
  };

  const handleEditPermission = (index) => {
    setEditingIndex(index);
    setNewPermission({
      ...permissions[index],
      permissions: PERMISSIONS.reduce((acc, perm) => {
        acc[perm] = permissions[index].permissions.includes(perm);
        return acc;
      }, {}),
    });
    document.querySelector(`tr[data-index="${index}"]`).scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const handleSavePermission = (index) => {
    const updatedPermissions = permissions?.map((perm, i) =>
      i === index
        ? {
            ...newPermission,
            permissions: Object.keys(newPermission.permissions).filter(
              (key) => newPermission.permissions[key]
            ),
          }
        : perm
    );
    onPermissionsChange({ ...settings, permissions: updatedPermissions });
    setEditingIndex(null);
    setNewPermission({
      name: "",
      permissions: {
        read: false,
        write: false,
        create: false,
        update: false,
        delete: false,
      },
    });
  };

  const handleDeletePermission = (index) => {
    const updatedPermissions = permissions?.filter((_, i) => i !== index);
    onPermissionsChange({ ...settings, permissions: updatedPermissions });
  };

  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white shadow-soft-xl rounded-2xl bg-clip-border mb-4">
      <div className="flex-auto p-4">
        <p className="mb-1 font-sans text-sm font-semibold leading-normal">
          Permissions
        </p>
        <div className="relative z-1">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <TableTooltip content="The group associated with the permission">
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                    Name
                  </th>
                </TableTooltip>
                {PERMISSIONS?.map((perm) => (
                  <th
                    key={perm}
                    className="py-3 px-4 text-left text-sm font-medium text-gray-700"
                  >
                    <TableTooltip content={`Permission to ${perm}`}>
                      {perm?.charAt(0).toUpperCase() + perm.slice(1)}
                    </TableTooltip>
                  </th>
                ))}
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                  <TableTooltip content="Actions that can be performed on the permission">
                    Actions
                  </TableTooltip>
                </th>
              </tr>
            </thead>
            <tbody>
              {permissions?.map((permission, index) => (
                <tr
                  key={index}
                  data-index={index}
                  className="border-b border-gray-200"
                >
                  <td className="py-2 px-4 text-sm text-gray-700">
                    {index === editingIndex ? (
                      <td className="relative z-1000 py-2 px-2 text-xs">
                        <DocLink
                          value={newPermission.name}
                          handleChange={handleNewPermissionChange}
                          // handleChange={(e) => {
                          //   handleInputChange(field.id1, e.value.id, "text");
                          // }}
                          doc={"Rolegroup"}
                          placeholder={`Select the role group`}
                          field={{}}
                          isNew={true}
                        />
                      </td>
                    ) : (
                      permission.name.name
                    )}
                  </td>
                  {PERMISSIONS?.map((perm) => (
                    <td key={perm} className="py-2 px-4 text-sm text-gray-700">
                      {index === editingIndex ? (
                        <input
                          type="checkbox"
                          name={perm}
                          checked={newPermission?.permissions[perm]}
                          onChange={handlePermissionCheckboxChange}
                          className="h-4 w-4 border-gray-300 rounded focus:ring-purple-500"
                        />
                      ) : permission.permissions.includes(perm) ? (
                        <span className="text-green-500">✓</span>
                      ) : (
                        <span className="text-red-500">✗</span>
                      )}
                    </td>
                  ))}
                  <td className="py-2 px-4 text-sm text-gray-700">
                    {index === editingIndex ? (
                      <button
                        type="button"
                        onClick={() => handleSavePermission(index)}
                        className="text-green-500 hover:text-green-700"
                      >
                        <FontAwesomeIcon icon={faSave} />
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => handleEditPermission(index)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePermission(index)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {editingIndex == null && (
                <tr>
                  <td className="relative z-100 py-2 px-2 text-xs">
                    <DocLink
                      value={newPermission.name}
                      handleChange={handleNewPermissionChange}
                      // handleChange={(e) => {
                      //   handleInputChange(field.id1, e.value.id, "text");
                      // }}
                      doc={"Rolegroup"}
                      placeholder={`Select the role group`}
                      field={{}}
                      isNew={true}
                    />
                  </td>
                  {PERMISSIONS?.map((perm) => (
                    <td key={perm} className="py-2 px-2 text-xs">
                      <input
                        type="checkbox"
                        name={perm}
                        checked={newPermission?.permissions[perm]}
                        onChange={handlePermissionCheckboxChange}
                        className="h-4 w-4 border-gray-300 rounded focus:ring-purple-500"
                      />
                    </td>
                  ))}
                  <td className="py-2 px-2 text-xs">
                    <button
                      type="button"
                      onClick={handleAddPermission}
                      className="px-3 py-2 text-xs font-semibold text-white bg-purple-500 rounded-md hover:bg-purple-600"
                    >
                      Add
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SettingsPermissionTable;
