# Youth Sports Scheduling MVP - Specification

## Project Overview
- **Name:** TeamSnap Lite
- **Type:** Web Application (React + Node.js)
- **Core Functionality:** Manage youth sports teams with player/coach rosters and automated game/practice scheduling
- **Target Users:** Youth sports league administrators, coaches, and parents

## UI/UX Specification

### Layout Structure
- **Header:** Logo + navigation (Dashboard, Teams, Schedule, Settings)
- **Main Content:** Dynamic based on route
- **Sidebar:** Quick actions and team selector
- **Footer:** Minimal, copyright only

### Responsive Breakpoints
- Mobile: < 768px (stacked layout)
- Tablet: 768px - 1024px (condensed sidebar)
- Desktop: > 1024px (full layout)

### Visual Design

#### Color Palette
- **Primary:** #1E3A5F (Deep Navy)
- **Secondary:** #4ECDC4 (Teal)
- **Accent:** #FF6B6B (Coral)
- **Background:** #F7F9FC (Light Gray)
- **Surface:** #FFFFFF (White)
- **Text Primary:** #2D3748 (Dark Gray)
- **Text Secondary:** #718096 (Medium Gray)
- **Success:** #48BB78 (Green)
- **Warning:** #ECC94B (Yellow)

#### Typography
- **Font Family:** "Nunito" (headings), "Source Sans Pro" (body)
- **Headings:** 24px (h1), 20px (h2), 16px (h3)
- **Body:** 14px regular, 14px medium for emphasis
- **Small:** 12px for labels/captions

#### Spacing System
- Base unit: 8px
- Margins: 16px (mobile), 24px (tablet), 32px (desktop)
- Padding: 12px (buttons), 16px (cards), 24px (sections)

#### Visual Effects
- Card shadows: 0 2px 8px rgba(0,0,0,0.08)
- Hover shadows: 0 4px 16px rgba(0,0,0,0.12)
- Border radius: 8px (cards), 6px (buttons), 4px (inputs)
- Transitions: 200ms ease-in-out

### Components

#### Navigation
- Top bar with logo left, nav links center, user menu right
- Active state: underline with primary color

#### Team Card
- Team name, sport type, player count badge
- Coach names below
- Hover: slight lift + shadow

#### Player/Coach Row
- Avatar placeholder (initials), name, position/role
- Contact info (email)
- Actions: edit, remove

#### Schedule Entry
- Date/time prominently displayed
- Team names, location
- Type badge (Game/Practice)

#### Form Inputs
- Rounded borders, subtle focus ring
- Labels above inputs
- Validation states (error: red border + message)

#### Buttons
- Primary: filled navy, white text
- Secondary: outlined, navy border/text
- Danger: filled coral for delete actions

## Functionality Specification

### Core Features

#### 1. Team Management
- Create team (name, sport, season)
- View list of all teams
- Edit team details
- Delete team (with confirmation)

#### 2. Player Management
- Add player to team (name, email, phone, position, jersey number)
- Edit player info
- Remove player from team
- View player roster per team

#### 3. Coach Management
- Add coach to team (name, email, phone, role)
- Edit coach info
- Remove coach from team
- Designate head coach

#### 4. Scheduling Algorithm
- **Inputs:**
  - Number of teams in league
  - Available venues (fields/courts)
  - Time slots (weekdays 4-8pm, weekends 8am-6pm)
  - Team preferences (home/away)
- **Constraints:**
  - No back-to-back games for same team on same day
  - Maximum 2 games per team per week
  - Preferred rest days between games
  - Venue capacity respected
- **Output:**
  - Full season schedule with games
  - Practice slots filled around games

#### 5. Schedule Display
- Calendar view (week/month toggle)
- List view with filters
- Export to iCal format
- Conflict detection display

### User Interactions
- Click team card → view team details
- Add button → modal form
- Edit icon → inline or modal edit
- Drag-drop for schedule adjustments (future enhancement)

### Data Handling
- Local storage for demo persistence
- JSON structure for teams, players, coaches, schedules
- Export/import JSON for data portability

### Edge Cases
- Empty team (no players) - allow but warn
- Scheduling impossible (too many teams, too few slots) - show message
- Duplicate email handling - allow with warning

## Acceptance Criteria

1. ✅ Can create a new team with name and sport
2. ✅ Can add players with required fields (name, email)
3. ✅ Can add coaches with required fields (name, email)
4. ✅ Scheduling algorithm generates valid schedule for 4+ teams
5. ✅ Schedule displays correctly in calendar and list views
6. ✅ Responsive design works on mobile/tablet/desktop
7. ✅ All CRUD operations work without errors
8. ✅ Data persists across page refreshes (localStorage)
