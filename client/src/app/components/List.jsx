import * as React from "react";
import DListItem from "./DListItem";
import {
	DragDropContext,
	Droppable,
	OnDragEndResponder,
} from "react-beautiful-dnd";

const List = React.memo(({ items, onDragEnd }) => {
	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Droppable droppableId="droppable-list">
				{(provided) => (
					<div ref={provided.innerRef} {...provided.droppableProps}>
						{items.map((item, index) => (
							<DListItem item={item} index={index} key={item.id} />
						))}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
		</DragDropContext>
	);
});

export default List;
