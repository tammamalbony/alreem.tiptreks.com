# C.12 Content Management (Blog / FAQ / Banners) <MVP>

---

## Core Scenario

### Primary Actor  
Content Editor

### Trigger Event  
Editor wants to publish or draft new content for users (e.g., Blog, FAQ, or Homepage Banners).

### Pre‑conditions  
- User is authenticated with `CMS-Editor` role  
- Access to Content › Blog module  
- CDN cache integration is enabled

---

## Main Success Flow

1. Editor opens **Content › Blog** section.  
2. Clicks **New Post** → enters title, body in WYSIWYG editor, uploads hero image.  
3. Clicks **Publish**.  
4. System stores content, adds metadata (author, date, slug), purges CDN cache.

---

## Post‑conditions

- New content is visible to end-users.  
- Metadata is correctly indexed.  
- CDN cache is updated with fresh content.  
- The post appears in the CMS listing with `Published` status.

---

## Standard Alternate / Error Paths

| ID  | Condition / Branch | Expected Behaviour |
|-----|--------------------|--------------------|
| A‑1 | Save as draft      | Editor clicks "Save as Draft" → content is stored with status `Draft`. Not visible to users. |
| A‑2 | Invalid image format | Upload rejected with error: “Unsupported file type.” |

---

## Edge & Stretch Scenarios

| ID  | Category     | Scenario                                 | Release Tag |
|-----|--------------|-------------------------------------------|-------------|
| E‑1 | Connectivity | Editor loses connection before publishing | Stretch     |
| E‑2 | Permissions  | Editor attempts to publish without CMS‑Editor role | Stretch     |
| E‑3 | Accessibility | Screen reader support in WYSIWYG editor  | Stretch     |
| E‑4 | Performance  | Large hero image delays post creation     | Stretch     |

---

## Acceptance‑Criteria (G/W/T)

**1. Publish Post**  
*Given* CMS-Editor is authenticated and on the Blog page  
*When* they create a post and click Publish  
*Then* the system stores the content, updates metadata, and refreshes CDN

**2. Save as Draft**  
*Given* the editor is still working on a post  
*When* they click Save as Draft  
*Then* post is stored with Draft status and not publicly visible

**3. Handle invalid file upload**  
*Given* the user uploads an unsupported file format  
*When* they attempt upload  
*Then* an error message is shown and upload is blocked

---

## Sequence Diagram

```mermaid
sequenceDiagram
    participant CE as Content Editor
    participant UI as CMS Interface
    participant DB as Content DB
    participant IMG as Media Upload
    participant CDN as CDN Service
    participant META as Metadata Engine

    CE->>UI: Open Content › Blog
    CE->>UI: Click "New Post" → Enter content, upload image
    UI->>IMG: Upload image
    IMG-->>UI: Image URL returned

    CE->>UI: Click Publish
    UI->>META: Generate slug, timestamp, author
    META-->>UI: Metadata ready
    UI->>DB: Save post content + metadata
    DB-->>UI: Post saved

    UI->>CDN: Purge cache for affected endpoints
    CDN-->>UI: Cache cleared

    UI-->>CE: Post published
