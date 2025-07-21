import { useState } from "react";
import type { Comment, User } from "../types";
import {
  Typography,
  Stack,
  Button,
  Collapse,
  Paper,
  TextField,
} from "@mui/material";

interface Props {
  comment: Comment;
  onReply: (parentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
  onEdit: (commentId: string, newContent: string) => void; // ⬅️ Add this prop
  currentUser: User | null;
  blogAuthorId: string;
}

export default function CommentItem({
  comment,
  onReply,
  onDelete,
  onEdit,
  currentUser,
  blogAuthorId,
}: Props) {
  const [showReplies, setShowReplies] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  const canDelete =
    currentUser &&
    (currentUser.id === comment.user.id || currentUser.id === blogAuthorId);

  const canEdit = currentUser && currentUser.id === comment.user.id;

  const handleReply = () => {
    const content = prompt(`Reply to ${comment.user.name}:`);
    if (content?.trim()) {
      onReply(comment.id, content.trim());
    }
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm("Delete this comment?");
    if (confirmDelete) {
      onDelete(comment.id);
    }
  };

  const handleEditSave = () => {
    if (editedContent.trim()) {
      onEdit(comment.id, editedContent.trim());
      setIsEditing(false);
    }
  };

  return (
    <Paper sx={{ p: 2, bgcolor: "#f9f9f9", mb: 2 }}>
      <Typography fontWeight={600}>
        {comment.user.name}
        {comment.parent?.user?.name &&
          ` (replied to ${comment.parent.user.name})`}
      </Typography>

      {isEditing ? (
        <Stack spacing={1}>
          <TextField
            multiline
            fullWidth
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
          <Stack direction="row" spacing={1}>
            <Button size="small" onClick={handleEditSave}>
              Save
            </Button>
            <Button size="small" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </Stack>
        </Stack>
      ) : (
        <Typography sx={{ whiteSpace: "pre-wrap" }}>
          {comment.content}
        </Typography>
      )}

      <Stack direction="row" spacing={2} mt={1}>
        <Button size="small" onClick={handleReply}>
          Reply
        </Button>

        {comment.replies.length > 0 && (
          <Button size="small" onClick={() => setShowReplies((prev) => !prev)}>
            {showReplies
              ? "Hide replies"
              : `View replies (${comment.replies.length})`}
          </Button>
        )}

        {canEdit && (
          <Button size="small" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
        )}

        {canDelete && (
          <Button
            size="small"
            color="error"
            onClick={handleDelete}
            sx={{ ml: comment.replies.length > 0 ? 0 : "auto" }}
          >
            Delete
          </Button>
        )}
      </Stack>

      <Collapse in={showReplies}>
        <Stack spacing={2} mt={2} ml={4}>
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onDelete={onDelete}
              onEdit={onEdit} // ⬅️ Prop passed to nested replies
              currentUser={currentUser}
              blogAuthorId={blogAuthorId}
            />
          ))}
        </Stack>
      </Collapse>
    </Paper>
  );
}
