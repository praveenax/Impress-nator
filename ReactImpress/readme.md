# ReactImpress

ReactImpress is a browser-based presentation builder inspired by Google Slides, with output powered by impress.js. The goal is to let a user create, edit, organize, preview, save, and share slide decks from a modern React UI, while exporting presentations that use impress.js 3D transitions and unique presentation links.

## Current Status

This folder now contains a working React and TypeScript application scaffold built with Vite.

Implemented in the current MVP:

- Presentation library with deck creation and deletion.
- Local browser persistence using localStorage.
- Editor route with slide CRUD, reordering, and slide selection.
- Inspector panel for slide content, notes, background, and transform values.
- Spatial canvas for visual slide positioning.
- Preview route rendered through vendored impress.js assets.
- Publish action that creates a local share slug and read-only published route.
- Export to JSON and standalone HTML.

## Quick Start

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

## Routes

- `/` presentation library
- `/editor/:presentationId` editor workspace
- `/preview/:presentationId` live impress.js preview
- `/published/:shareSlug` read-only published deck view

## Product Goal

Build a lightweight slide editor that combines the usability of a traditional presentation tool with the spatial movement and 3D transitions of impress.js.

## Core User Story

A user can create a presentation, add slides, edit content visually, arrange slide positions and transitions, save the presentation state, and open a shareable presentation link that renders the deck through impress.js.

## Proposed Features

### Presentation Management

- Create a new presentation with title, author, theme, and description.
- Open an existing presentation from saved JSON data.
- Duplicate and delete presentations.
- Auto-save presentation changes.
- Track last edited time and presentation metadata.

### Slide Editing

- Add, duplicate, reorder, and delete slides.
- Edit slide title, body text, speaker notes, and optional background.
- Support text blocks, images, and simple shapes in later versions.
- Provide slide thumbnails in a left sidebar for quick navigation.
- Allow per-slide settings for position, scale, and rotation.

### Layout and Motion

- Place slides on a 2D canvas that maps to impress.js coordinates.
- Drag slides to adjust X and Y positions visually.
- Configure rotate, rotateX, rotateY, scale, and z-depth.
- Offer quick presets such as left, right, up, down, zoom, and flip.
- Show connecting paths between slides in editor mode.

### Preview and Playback

- Preview the current presentation inside the app.
- Launch a full presentation view rendered by impress.js.
- Support keyboard navigation between slides.
- Show fallback messaging for unsupported browsers.
- Provide presenter mode as a later enhancement.

### Sharing and Export

- Save presentation data as JSON.
- Export a standalone HTML package that includes slide markup and impress.js assets.
- Generate a unique share URL for published presentations.
- Support read-only public presentation links.
- Add import and export compatibility improvements in later phases.

### Collaboration and Quality

- Add input validation for required fields and invalid transforms.
- Preserve unsaved changes during refresh or accidental navigation.
- Add version history in a later phase.
- Add authentication and multi-user collaboration in a later phase.

## Functional Requirements

- The application must let users create and manage multiple presentations.
- Each presentation must contain an ordered list of slides.
- Each slide must store content and transform data required by impress.js.
- The editor must support both form-based editing and visual positioning.
- The preview must accurately reflect exported presentation behavior.
- Saved presentation state must be serializable to JSON.
- Published presentations must be addressable through stable unique links.

## Suggested Data Model

```json
{
  "id": "presentation_123",
  "title": "Quarterly Demo",
  "author": "Admin",
  "theme": "classic",
  "slides": [
    {
      "id": "slide_1",
      "title": "Welcome",
      "content": "Opening slide content",
      "notes": "Optional presenter notes",
      "transform": {
        "x": 1000,
        "y": 1000,
        "z": 0,
        "rotate": 0,
        "rotateX": 0,
        "rotateY": 0,
        "scale": 1
      }
    }
  ],
  "createdAt": "2026-04-14T00:00:00Z",
  "updatedAt": "2026-04-14T00:00:00Z",
  "published": false,
  "shareSlug": "quarterly-demo-abc123"
}
```

## Suggested Technical Stack

- React for the application UI.
- TypeScript for safer state and component contracts.
- Vite for development and build tooling.
- React Router for editor and presentation routes.
- Zustand or Redux Toolkit for editor state.
- Local storage for early persistence, then a backend API.
- impress.js for playback and exported presentation rendering.
- CSS modules or a component library for consistent UI styling.

## Application Structure

```text
ReactImpress/
	src/
		app/
		components/
		features/
			presentations/
			slides/
			editor/
			preview/
			publish/
		lib/
			impress/
			storage/
			export/
		routes/
		types/
```

## Implementation Plan

### Phase 1: Foundation

- Initialize a React and TypeScript project.
- Set up routing for home, editor, preview, and published presentation pages.
- Define TypeScript types for presentation, slide, and transform data.
- Build static layout shells for sidebar, canvas, properties panel, and toolbar.

### Phase 2: Editor MVP

- Implement presentation creation and local persistence.
- Build slide list management: add, select, delete, duplicate, and reorder.
- Add a properties panel to edit title, content, x, y, z, rotate, and scale.
- Render slide cards on an editor canvas based on transform values.

### Phase 3: Impress.js Integration

- Build a preview route that maps saved slide data to impress.js markup.
- Ensure preview initialization and cleanup work correctly in React.
- Match editor transform values to impress.js output attributes.
- Validate that exported output behaves the same as preview.

### Phase 4: Export and Sharing

- Add JSON import and export.
- Generate standalone HTML output with required CSS and JS assets.
- Add a publish flow that creates unique share slugs.
- Implement a read-only presentation route for published decks.

### Phase 5: Polishing

- Add themes, templates, and transition presets.
- Improve canvas interactions with drag, snap, and zoom controls.
- Add keyboard shortcuts and better accessibility.
- Add tests for state updates, export logic, and preview rendering.

## MVP Scope

The first usable version should include:

- Create presentation
- Add and edit slides
- Set slide position and rotation
- Save locally
- Preview with impress.js
- Export to HTML

## Non-Goals for MVP

- Real-time collaboration
- Full rich text editing
- Advanced media editing
- Cloud sync across accounts
- Presenter analytics

## Key Risks

- impress.js is DOM-oriented and may require careful lifecycle handling inside React.
- Visual drag positioning must stay consistent with exported transform data.
- Exported HTML and in-app preview can drift if they use different rendering logic.
- Share-link publishing will require backend storage once local-only persistence is no longer enough.

## Recommended Milestones

1. Set up the project and define the data model.
2. Build the editor shell and local presentation storage.
3. Implement slide CRUD and transform editing.
4. Integrate impress.js preview.
5. Add HTML export.
6. Add publishing and unique links.

## Success Criteria

- A user can create a deck from scratch in the browser.
- A saved deck can be reopened without data loss.
- Preview output matches exported output.
- Published decks can be opened through a unique link.
- The editor remains simple enough to use without documentation.
