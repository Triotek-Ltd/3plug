import { useDrop } from "react-dnd";
import DraggableItem from "@/components/studio/doctype/DraggableItem";

const ColumnDropZone = ({
  column,
  sectionId,
  selectedFieldId,
  handleFocus,
  handleBlur,
  handleInputChange,
  handleMoveItem,
  deleteField,
  ItemType, // 'field' or 'section' or 'column'
}) => {
  const [, drop] = useDrop({
    accept: [ItemType, "column", "section"], // Accept columns, sections, and fields
    drop: (item) => {
      handleMoveItem(item, column, item.parentId, column.id);
    },
  });

  return (
    <div ref={drop} className="flex-1 bg-white rounded-lg">
      {column?.length === 0 ? (
        <div>
          <DraggableItem
            key={0}
            item={{}}
            index={0}
            column={{}}
            selectedFieldId={selectedFieldId}
            handleFocus={handleFocus}
            handleBlur={handleBlur}
            handleInputChange={handleInputChange}
            moveItem={handleMoveItem}
            parentId={column.id}
            placeholder={true}
            itemType="field" // Placeholder should have 'field' as its itemType
          />
        </div>
      ) : (
        column?.map((field, index) => (
          <DraggableItem
            key={field.id}
            item={field}
            index={index}
            column={column}
            selectedFieldId={selectedFieldId}
            handleFocus={handleFocus}
            handleBlur={handleBlur}
            handleInputChange={handleInputChange}
            moveItem={handleMoveItem}
            parentId={column.id}
            deleteField={deleteField}
            itemType="field" // Fields will have 'field' as itemType
          />
        ))
      )}
    </div>
  );
};

export default ColumnDropZone;
