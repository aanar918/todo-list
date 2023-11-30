import * as React from "react";
import { Draggable } from "react-beautiful-dnd";

import makeStyles from "@material-ui/core/styles/makeStyles";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
// import InboxIcon from "@material-ui/icons/Inbox";

const useStyles = makeStyles({
	draggingListItem: {
		background: "rgb(235,235,235)",
	},
});

const DListItem = ({ item, index }) => {
	const classes = useStyles();
	return (
		<Draggable draggableId={item.id} index={index}>
			{(provided, snapshot) => (
				<ListItem
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					className={
						snapshot.isDragging ? classes.draggingListItem : ""
					}
				>
					<ListItemAvatar>
						<Avatar>
							<InboxIcon />
						</Avatar>
					</ListItemAvatar>
					<ListItemText
						primary={item.primary}
						secondary={item.secondary}
					/>
				</ListItem>
			)}
		</Draggable>
	);
};

export default DListItem;
