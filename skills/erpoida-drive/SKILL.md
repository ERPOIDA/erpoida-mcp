---
name: erpoida-drive
description: Read, write and organize ERPoida Drive folders, Markdown documents and files through the erpoida MCP server. Use when the user asks to find, summarize, draft, update, move or upload documents in ERPoida Drive, or to turn conversation output into a saved document.
---

# ERPoida: Drive and documents

ERPoida Drive holds folders, rich documents (written and returned as **Markdown**) and
uploaded files.

## Finding things

- `list_folder` with no folder lists the Drive root; pass a folder id to go deeper. Results
  include names, kinds, parent ids, owner and size.
- There is no full-text Drive search tool. Walk folders from the root and match names; tell the
  user if a name matches more than one item and ask which one.
- `get_document { id }` returns the document's Markdown content and metadata.

## Writing

| Tool | Behaviour |
| --- | --- |
| `create_document { name, content, folder_id? }` | `content` is Markdown. Omit `folder_id` for the root. |
| `create_folder { name, folder_id? }` | |
| `update_document { id, name?, content? }` | **`content` replaces the entire body.** |
| `move_document { id, folder_id? }` | Omit `folder_id` to move to the root. |
| `delete_drive_item` | Soft delete. A folder's children move to the Drive root. |

**Editing an existing document:** `get_document` first, apply the change to the full Markdown,
show the user the diff or the changed section, and only then call `update_document` with the
complete new body. Never send just the new paragraph: that would wipe the rest.

Confirm before overwriting a document someone else wrote, and before deleting.

## Files

- `upload_file` takes standard base64 bytes plus name and MIME type. Max **10 MB**.
- `download_file` returns base64 bytes with filename and MIME type. Max 10 MB.
- For larger files, send the user to the app.

## Writing good documents

- Use real Markdown structure: one `#` title, `##` sections, lists, `- [ ]` checklists, tables.
- Keep the user's wording when you are saving their notes; summarise only when asked.
- After creating, return the document name and where it lives.

## Example prompts

- "Create a Drive document called Weekly update with a heading and a checklist of next steps."
- "Find the document called Connector Review Notes and summarize it."
- "Move all documents named 'Draft *' in the root into a new folder called Drafts."
