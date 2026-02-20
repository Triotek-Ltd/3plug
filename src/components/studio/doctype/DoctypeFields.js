import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const DoctypeFields = ({ config, data }) => {
  const [fields, setFields] = useState(config.fields);

  // Handle the drag-and-drop rearrangement of fields
  const handleOnDragEnd = (result) => {
    const { destination, source } = result;
    if (!destination) return; // dropped outside the list

    const reorderedFields = Array.from(fields);
    const [movedItem] = reorderedFields.splice(source.index, 1);
    reorderedFields.splice(destination.index, 0, movedItem);

    setFields(reorderedFields);
  };

  // Handle input changes for data fields
  const handleInputChange = (fieldName, value) => {
    const updatedData = { ...data, [fieldName]: value };
    setData(updatedData);
  };

  // Function to render different field types with enhanced block styling
  const renderField = (item) => {
    switch (item.fieldtype) {
      case "Section Break":
        return (
          <div className="section-break my-6">
            <h3 className="text-xl font-semibold text-gray-800">
              {item.label}
            </h3>
          </div>
        );
      case "Column Break":
        return (
          <div className="column-break grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
            {/* This creates two or three columns per section break */}
          </div>
        );
      case "Tab Break":
        return (
          <div className="tab-break my-6">
            <h3 className="text-xl font-semibold text-gray-800">
              {item.label}
            </h3>
            {/* Tab logic can be added here */}
          </div>
        );
      default:
        return (
          <div className="field p-4 mb-6 bg-white shadow-lg rounded-lg border border-gray-200">
            <div className="flex justify-between">
              <div className="flex flex-col">
                <h5 className="text-lg font-semibold text-gray-700">
                  {item.label}
                </h5>
                <span className="text-sm text-gray-500">{item.fieldtype}</span>
                {item.description && (
                  <p className="text-sm text-gray-400">{item.description}</p>
                )}
                {item.reqd && (
                  <span className="text-xs text-red-500">Required</span>
                )}
              </div>
              {item.icon && (
                <div className="flex items-center justify-center w-12 h-12 text-center rounded-full bg-gradient-to-tl from-purple-600 to-pink-500">
                  <FontAwesomeIcon
                    icon={item.icon}
                    className="h-6 w-6 text-white"
                  />
                </div>
              )}
            </div>
            <div className="mt-3">
              {item.fieldtype === "Check" ? (
                <input
                  type="checkbox"
                  checked={data[item.fieldname]}
                  onChange={(e) =>
                    handleInputChange(item.fieldname, e.target.checked)
                  }
                  className="p-2 border rounded-lg w-full"
                />
              ) : item.fieldtype === "Data" ? (
                <input
                  type="text"
                  value={data[item.fieldname]}
                  onChange={(e) =>
                    handleInputChange(item.fieldname, e.target.value)
                  }
                  className="p-2 border rounded-lg w-full"
                />
              ) : (
                <span className="text-lg font-bold">
                  {data[item.fieldname]}
                </span>
              )}
            </div>
          </div>
        );
    }
  };

  // Render content of the tab based on the tabItem
  const renderTabContent = (tabItem) => {
    return (
      <div className="my-4 p-4 bg-white shadow-lg rounded-md">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <h5 className="text-lg font-semibold text-gray-700">
              {tabItem.label}
            </h5>
            <span className="text-sm text-gray-500">{tabItem.fieldtype}</span>
            {tabItem.description && (
              <p className="text-sm text-gray-400">{tabItem.description}</p>
            )}
            {tabItem.reqd && (
              <span className="text-xs text-red-500">Required</span>
            )}
          </div>
          {tabItem.icon && (
            <div className="w-12 h-12 bg-gradient-to-tl from-purple-600 to-pink-500 rounded-full flex justify-center items-center">
              <FontAwesomeIcon icon={tabItem.icon} className="text-white" />
            </div>
          )}
        </div>
        <div className="mt-3">
          {tabItem.fieldtype === "Check" ? (
            <input
              type="checkbox"
              checked={data[tabItem.fieldname]}
              onChange={(e) =>
                handleInputChange(tabItem.fieldname, e.target.checked)
              }
            />
          ) : tabItem.fieldtype === "Data" ? (
            <input
              type="text"
              value={data[tabItem.fieldname]}
              onChange={(e) =>
                handleInputChange(tabItem.fieldname, e.target.value)
              }
              className="p-2 border rounded-lg w-full"
            />
          ) : (
            <span className="text-lg font-bold">{data[tabItem.fieldname]}</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="droppable" direction="vertical">
        {(provided) => (
          <div
            className="py-8 space-y-6"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {/* Render fields in a grid format */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {config.field_order?.map((fieldname, index) => {
                // Find the field object from `config.fields` using the `fieldname`
                const field = fields.find((f) => f.fieldname === fieldname);

                if (!field) return null; // Skip if field not found

                return (
                  <Draggable
                    key={field.fieldname}
                    draggableId={field.fieldname}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="w-full mb-4"
                      >
                        <div className="relative flex flex-col min-w-0 break-words bg-white shadow-lg rounded-2xl bg-clip-border">
                          {/* Render each field or tab content based on its type */}
                          {field.fieldtype === "Tab Break"
                            ? renderTabContent(field)
                            : renderField(field)}
                        </div>
                      </div>
                    )}
                  </Draggable>
                );
              })}
            </div>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DoctypeFields;
