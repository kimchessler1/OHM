# OHM Staging Full Regression Test Suite
**Environment:** OHM Staging — https://ohm-stg.preprod.ludev.team/
**Status:** Working Draft — Jan 2026
**Scope:** Instructor Site Workflow — Staging only. Production Smoke Suite is separate.

> **Risk Levels:** Low | Medium | High
> Tests should be filterable by risk level. Note: Login is implicitly high risk even if not marked.

---

## 1. Home Page (Login)

| # | Test Case | Steps | Expected Behavior | Notes |
|---|-----------|-------|-------------------|-------|
| 1.1 | Confirm Login | Login with existing username/password | Redirects to OHM Home Page | First-time login presents EULA |
| 1.2 | Enroll in New Course from Login | Use Course ID + Enrollment Key to search | Course ID and Enrollment Key search finds desired course and provides access | |
| 1.3 | Forgot Password | Click Forgot Password, enter email | Email received with reset link | |
| 1.4 | Forgot Username | Click Forgot Username, enter email | Email received with username | |
| 1.5 | What is Lumen OHM? | Click link | lumenlearning.com opens in new tab | |
| 1.6 | Request an Instructor Account | Click link | https://info.lumenlearning.com/try-lumen-course opens in new tab | |

---

## 2. Home and Core Pages

| # | Test Case | Steps | Expected Behavior | Notes |
|---|-----------|-------|-------------------|-------|
| 2.1 | Courses You're Teaching | Navigate to OHM Home | Left panel populates list of courses being taught | |
| 2.2 | Add New Course | Click Add New Course | Course creation page loads; prompts to select template, copy, or blank | Deep-dive in Course Creation section | **Medium** |
| 2.3 | Enroll in New Class | Search by CID + enrollment key | Course found and enrolled successfully | **Medium** |
| 2.4 | User Settings | Open and modify settings | Changes save and persist | |
| 2.5 | Right Dash Items | Check each option | My Classes, Help, Log Out all function | |

---

## 3. OHM User Settings

| # | Test Case | Steps | Expected Behavior | Notes |
|---|-----------|-------|-------------------|-------|
| 3.1 | Edit Name & Email | Modify first name, last name, email fields | Changes save successfully | ⚠️ Accessibility/Display Preferences changing in upcoming sprint — hold off |

---

## 4. Admin Page (Admin User Only)

| # | Test Case | Steps | Expected Behavior | Notes |
|---|-----------|-------|-------------------|-------|
| 4.1 | Groups | Navigate to Groups | List of existing groups shown; option to add new group at bottom | Breadcrumb dashboard missing — known bug to be fixed |
| 4.2 | Utilities | Navigate to Utilities | All utility links populate and are accessible | See Utilities section |
| 4.3 | Diagnostics | Navigate to Diagnostics | Page loads | Purpose unclear — investigate |
| 4.4 | LTI 1.1 Provider Creds | Click link | Page exists and loads | General navigation check |
| 4.5 | LTI 1.3 Platforms | View existing creds; test LMS dropdown | Existing creds listed; LMS dropdown functions | |
| 4.6 | External Tools | Click link | Page exists and loads | General navigation check |
| 4.7 | Manage Question Set | Click link | Page loads | May be addressed outside Lumen Admin tools |
| 4.8 | Manage Libraries | Click link | Page loads | May be addressed outside Lumen Admin tools |
| 4.9 | Export/Import Libraries | Click link | Page loads | May be addressed outside Lumen Admin tools |

---

## 5. OHM User Reports (Admin)

| # | Test Case | Steps | Expected Behavior | Notes |
|---|-----------|-------|-------------------|-------|
| 5.1 | Groups List | Navigate to Groups | List of existing groups shown; add new option at bottom | Breadcrumb bug known |
| 5.2 | New Instructors Report | Generate report; download CSV | Users added within 30 days listed; CSV downloads | Best tested in Production where new users are frequent |
| 5.3 | Desmos Overview | Open overview; change calendar dates | Unique student view counts populate per date range | |
| 5.4 | Add New User | Fill in username, password, role, task rights, groups | New user created successfully | |
| 5.5 | Batch Add Instructors | Select group; upload CSV | CSV imports instructors into OHM | |

---

## 6. Course Home — Communication (Left Dash)

| # | Test Case | Steps | Expected Behavior | Notes |
|---|-----------|-------|-------------------|-------|
| 6.1 | Messages | Access messaging inbox; toggle messages | Inbox accessible; messages respond | |
| 6.2 | Forums | Open Forums | Existing forums populate (if any) | Limited testing needed if no forums exist |

---

## 7. Course Home — Tools (Left Dash)

| # | Test Case | Steps | Expected Behavior | Notes |
|---|-----------|-------|-------------------|-------|
| 7.1 | Roster | Access Roster and view settings | Enrolled students displayed; settings accessible | Late passes/exceptions tested elsewhere |
| 7.2 | Gradebook | Open Gradebook | Gradebook loads | Full testing in Gradebook section |
| 7.3 | Calendar | Open Calendar; modify assessment due date items | Calendar items shown; drag-and-drop works; events can be added/repeated | |
| 7.4 | Course Map | Open Course Map | Populates; items can be jumped to within course | |
| 7.5 | More… Reports | Access report options | Course report links open correct pages | |
| 7.6 | Groups | Add New Set of Groups | Group created; appears in assessment group dropdown | |
| 7.7 | Outcomes | Add New Outcome | Outcome created; appears in assessment Grading and Feedback dropdown | |
| 7.8 | Merge Assessments | Number assessments; merge | New merged assessment created within course | |

---

## 8. Course Home — Questions (Left Dash)

| # | Test Case | Steps | Expected Behavior | Notes |
|---|-----------|-------|-------------------|-------|
| 8.1 | Manage | Navigate to Manage | Page loads | |
| 8.2 | Libraries | Navigate to Libraries | Page loads | |

---

## 9. Course Home — Course Items (Left Dash)

| # | Test Case | Steps | Expected Behavior | Notes |
|---|-----------|-------|-------------------|-------|
| 9.1 | Copy From… | Copy from own courses, group courses, or by CID | Items copied successfully from all available options | |
| 9.2 | Export | Select LMS; choose specific items; download .imscc | Only selected items included in export package | |
| 9.3 | Import | Import appropriate file into OHM course | File imports successfully | |

---

## 10. Course Home — Mass Change (Left Dash)

| # | Test Case | Steps | Expected Behavior | Notes |
|---|-----------|-------|-------------------|-------|
| 10.1 | Assessments | Set prereqs; select assessments; apply change settings | Settings applied to selected assessments | |
| 10.2 | Forums | Select forums; apply options | Options applied | Only applies to courses with forums |
| 10.3 | Blocks | Select blocks; apply options | Options applied | |
| 10.4 | Dates | Mass change dates | Dates updated | |
| 10.5 | Time Shift | Apply time shift | Time shift applied | |

---

## 11. Course Home — Settings (Left Dash)

| # | Test Case | Steps | Expected Behavior | Notes |
|---|-----------|-------|-------------------|-------|
| 11.1 | Course Settings | Click Course Settings link | Opens Course Settings page | See Course Settings section |
| 11.2 | Help | Click Help | Lumen OHM Help opens | |
| 11.3 | Log Out | Click Log Out | User logged out successfully | |

---

## 12. Course Settings

| # | Test Case | Steps | Expected Behavior | Notes |
|---|-----------|-------|-------------------|-------|
| 12.1 | Course Name & Enrollment Key | Edit name and enrollment key fields; change level dropdown | Fields editable; dropdown populates level options | **Medium** |
| 12.2 | Availability and Access | Adjust availability settings | Access locked/unlocked per settings | ⚠️ Test after suite is near complete |
| 12.3 | LMS Integration (LTI) | Click Instructions link | Opens in new window | Due Dates and Copies of Copies tested in LMS Integration section |
| 12.4 | Additional Items | Review additional settings | Settings function | |

---

## 13. Course Creation — Basic (with Template)

| # | Test Case | Steps | Expected Behavior | Notes |
|---|-----------|-------|-------------------|-------|
| 13.1 | Click Add New Course | Click from admin/instructor homepage | Course creation page loads with template/copy options | |
| 13.2 | Use a Lumen Template | Click "Use a Lumen Template" | Template module populates with filter and selection options | |
| 13.3 | Course Dropdown Options | Click any course dropdown | Preview Course and Add Course options present | |
| 13.4 | Preview Course | Click Preview Course | New tab opens with viewable course template | |
| 13.5 | Close Preview Modal | Click Close | Modal disappears | |
| 13.6 | Add Course | Click Add Course | Add New Course page populates with: name, enrollment key, course level, assessment player, copy options, access, LMS integration, other options | |
| 13.7 | Submit Without Enrollment Key | Leave enrollment key blank; click Submit | Validation error shown | |
| 13.8 | Toggle Course Copy Options | Check/uncheck course copy options | Options toggle correctly | |
| 13.9 | Toggle Availability and Access | Modify availability settings | Settings reflect correctly | |
| 13.10 | Toggle LMS Integration Options | Check/uncheck LMS integration options | Options toggle correctly | |
| 13.11 | Submit Course | Fill all required fields; click Submit | Confirmation page: "Your course has been created!"; Course ID and enrollment key displayed | |
| 13.12 | Enter Course | Click Enter Course | Course page loads | |

---

## 14. Course Creation — Advanced Options

### 14a. Community Course
| # | Test Case | Steps | Expected Behavior | Notes |
|---|-----------|-------|-------------------|-------|
| 14a.1 | Use a Community Template | Click "Use a Community Template" | Modal of community templates populates | |
| 14a.2 | Preview Community Course | Click Preview Course | Course preview opens | |
| 14a.3 | Add Community Course | Click Add Course | Course can be created | |

### 14b. Create Blank Course
| # | Test Case | Steps | Expected Behavior | Notes |
|---|-----------|-------|-------------------|-------|
| 14b.1 | Create Blank Course | Click "Create Blank Course" | Add New Course page loads | |
| 14b.2 | Submit with Modified Fields | Change fields; submit | Course created with specified settings | |

### 14c. Copy Course — From Previous Term
| # | Test Case | Steps | Expected Behavior | Notes |
|---|-----------|-------|-------------------|-------|
| 14c.1 | Copy from Previous Term | Click "Copy MY course from previous term"; click Preview; select course; click Continue | Dropdown surfaces; preview opens in new tab; Add New Course page loads with settings | |

### 14d. Copy Course — Someone Else's Course
| # | Test Case | Steps | Expected Behavior | Notes |
|---|-----------|-------|-------------------|-------|
| 14d.1 | Copy Someone Else's Course | Expand dropdown; enter CID; click Look Up; try Continue without enrollment key; return and enter key; click Continue | Course found; validation prevents continue without key; course accessible with key | |

### 14e. Copy Course — Group Member's Course
| # | Test Case | Steps | Expected Behavior | Notes |
|---|-----------|-------|-------------------|-------|
| 14e.1 | Copy Group Member's Course | Click "Copy a group member's course"; click name dropdown; select course; attempt without enrollment key; re-enter key; click Continue | Full flow completes as expected | |

---

## 15. Course Settings (Advanced)

| # | Test Case | Steps | Expected Behavior | Notes |
|---|-----------|-------|-------------------|-------|
| 15.1 | Change Enrollment Key | Edit key; click Submit | Redirected to course home; new key saved and visible in settings | Are there forbidden characters? |
| 15.2 | Change Course Name | Edit name; click Submit | New name saved and shown in title bar | |
| 15.3 | Change Course Level | Change level; click Submit | Level updates with content | |
| 15.4 | Uncheck "Available to Students" | Uncheck availability | Course unavailable for student registration | What happens to currently enrolled students? |
| 15.5 | Course Start/End Dates | Set start and end dates | Course unavailable outside the date range; available within it | |
| 15.6 | Self-Enrollment Toggle | Uncheck / re-check self-enrollment | Students cannot/can enroll themselves accordingly | |
| 15.7 | LMS Integration Help Link | Click Integration setup help link | Help page opens in new tab | |
| 15.8 | Show Course Level Key/Secret | Click link | Section dropdown reveals LTI keys and secret | |
| 15.9 | Edit Course Secret | Edit secret; click Submit | New secret saved | ⚠️ Blank secret appears saveable — potential bug |
| 15.10 | Due Dates Setting | Toggle allow/disallow | Due date setting in Canvas reflects the toggle | |
| 15.11 | Late Pass Extension | Change extension value | Late pass extension duration updates correctly | |
| 15.12 | Send Teacher Message on Enroll | Toggle on/off | Message sent/not sent when student enrolls | |
| 15.13 | Message System Options | Set each messaging mode | Each mode restricts/enables messaging per spec | Investigate "enable monitoring" behavior |
| 15.14 | Navigation Links for Students | Uncheck each nav link | Corresponding link removed from student view | |

---

## 16. Adding Items to OHM Course

| # | Test Case | Steps | Expected Behavior | Notes |
|---|-----------|-------|-------------------|-------|
| 16.1 | Add Item Dropdown | Click Add Item | Dropdown lists all item options | |
| 16.2 | Add Assessment | Create new assessment | Assessment created in course | |
| 16.3 | Add Inline Text | Create inline text | Inline text created | |
| 16.4 | Add Link | Create link | Link created | |
| 16.5 | Add Forum | Create forum | Forum created | |
| 16.6 | Add Wiki | Create wiki | Wiki created | |
| 16.7 | Add Drill | Create drill | Drill created | |
| 16.8 | Add Block | Create block | Block created | |
| 16.9 | Add Calendar | Create calendar item | Calendar item created | |
| 16.10 | Add Desmos Interactive | Create Desmos interactive | Desmos item created | ⚠️ Requires its own thorough testing section |

---

## 17. Gradebook (with Scores)

| # | Test Case | Steps | Expected Behavior | Notes |
|---|-----------|-------|-------------------|-------|
| 17.1 | Enter Gradebook | Via left dash OR top item options | Gradebook loads in default view | View depends on gradebook settings |
| 17.2 | Gradebook Dashboard Options | Check: Offline Grades, Export, Settings, Comments, Color/Category dropdowns, Toggles | All items respond | Full page testing for each done elsewhere |
| 17.3 | Student Name → Detail | Click student name | Individual student gradebook detail opens | |
| 17.4 | Grade Item → Assessment Review | Click grade item | Assessment attempt review opens | |
| 17.5 | Make an Exception | Open student grade item with past due date; make exception | Student gains access to past-due item | Requires past-due assessment and test student user |
| 17.6 | Override Score | Override score; delete all attempts | Score changed or attempts wiped | Verify student regains attempt ability after deletion |
| 17.7 | Single Score Override | Enter manual score for single question; choose Full Credit | Individual question score updated | |
| 17.8 | Return to Gradebook | Click return link from detail view | Returns to gradebook successfully | |
| 17.9 | Gradebook Detail Links | Click View as Student, Print Version, Activity Log | Each opens correct page | |
| 17.10 | Status Flags — Attempt States | Verify: IP, OT, PT, EC, NC, NS | Correct flags shown per student scenario | Requires student data for each scenario |
| 17.11 | Status Flags — Score Modifiers | Verify: * (feedback), d (dropped), x (excused), e (exception), LP (late pass) | Correct flags shown | Requires matching student data |

---

## 18. Gradebook Settings

| # | Test Case | Steps | Expected Behavior | Notes |
|---|-----------|-------|-------------------|-------|
| 18.1 | Add Category (Points) | Name category; set 10 scale points; drop lowest 1 | Category applied; lowest score dropped for students with submissions | Test with student data in gradebook |
| 18.2 | Add Category (Percent) | Name category; set 10 scale percent; keep highest 1 | Category applied; highest score kept | Test with student data |
| 18.3 | Edit View Settings | Click expand link; click Hide | Settings expand and collapse correctly | |
| 18.4 | View Settings Dropdowns | Open dropdowns | Options populate | |
| 18.5 | View Settings Radio/Checkboxes | Check various options | Selections register | |
| 18.6 | Apply and Verify View Settings | Set: alphabetical order, last name default, show as %, include all details; return to gradebook | All settings display correctly in gradebook | |

---

## 19. Utilities (Admin)

| # | Test Case | Steps | Expected Behavior | Notes |
|---|-----------|-------|-------------------|-------|
| 19.1 | User Lookup | Search by LastName, FirstName, username, or email | Matching user found; investigate/emulate links function | Some emulate links go to OHM home only — investigate |
| 19.2 | Approve Pending Instructor Accounts | Find pending users; take action | User moved out of pending status | |
| 19.3 | Jump to Item | Enter Course ID, Assessment ID, Preview Question ID, or Question ID | Item found and accessible | Use known test CID/QID |
| 19.4 | Batch Create Instructor Accounts | Upload CSV with correct column format | Instructors created in batch | Confirm group dropdown and CSV file picker work |
| 19.5 | Batch Anonymize Old Accounts | Run batch | Accounts anonymized | |
| 19.6 | Get Student Count | Run count | All active users listed with last-30-day breakdown | Allow time for browser to load |
| 19.7 | Cross-Course Grade Comparison | Enter base course ID; generate | Assessment averages from all copies returned | Use a copied base course |
| 19.8 | Cross-Course Question-Level Comparison | Enter assessment ID; generate | Question averages from all copies returned | Use a copied base course |
| 19.9 | Get Detailed Student Count | Run count | All students who accessed courses in 30 days listed | |
| 19.10 | Enable Debug Mode | Navigate to page | Page loads | ⚠️ Consider skipping in automated suite |
| 19.11 | Fix Orphaned Questions | Run tool | Questions not attached to libraries found | |
| 19.12 | Fix Duplicate Forum Grades | Run tool | Duplicate forum grade records found | |
| 19.13 | Emulate User | Enter known user ID | User successfully emulated | |
| 19.14 | List Admins | Generate list | Full, Group, and Global admins listed on same report | |
| 19.15 | List ExtRefs | Generate list | External refs listed | |
| 19.16 | Notifications | View banners; create live banner; view as user | Banner appears; user view reflects banner | |
| 19.17 | Desmos Usage Report | Set date range using calendar icons | Total count updates per date selection | |
| 19.18 | Search Block Titles | Run search | Results returned | Jira: OHM-1593 |
| 19.19 | Search Inline/Linked Items | Run search | Results returned | Jira: OHM-1593 |

---

## 20. Question Management

| # | Test Case | Steps | Expected Behavior | Notes |
|---|-----------|-------|-------------------|-------|
| 20.1 | Load Question Set Management | Admin → Manage Question Set | Page loads with 200 results and search bar | |
| 20.2 | Toggle In Libraries / All Libraries | Click "In Libraries"; click "All Libraries" | Submenu populates; label switches to All Libraries | |
| 20.3 | Select Libraries | Click Select Libraries; expand + boxes; select libraries; click Use Libraries; test Close/X | Popup opens; selections applied on Use Libraries; Close cancels | |
| 20.4 | Search Validation | Leave search empty; click Search | Error: "You must provide a search term when searching All Libraries" | |
| 20.5 | Search with Term | Enter term (e.g. "degrees"); click Search | Results filtered to matching questions | |
| 20.6 | Clear Search Term | Click X next to search term | Search term cleared | |
| 20.7 | Advanced Search Options | Click dropdown arrow next to Search | Options window opens: has words, doesn't have, author, ID, OHM id, type, time, score, dates, checkboxes | |
| 20.8 | Apply Search Refinements | Fill in refinements; click Search | Refinements applied to results; date pickers function | |
| 20.9 | Check All / None | Click All; click None | All visible questions checked/unchecked | |
| 20.10 | With Selected — No Selection | Click With Selected; choose any option | Message: "No questions selected"; Go Back link functions | |
| 20.11 | Transfer Ownership | Select question; Transfer; list group members; look up teacher; test Nevermind; test Transfer | Transfer completes; Nevermind returns to results | |
| 20.12 | Delete Question | Select question; Delete; test Nevermind; test Really Delete | Nevermind returns; Really Delete permanently removes question | What happens if question is part of an exam? |
| 20.13 | Library Assignment | Select question; Library Assignment; test each option (Add/keep, Add/remove, Remove); test Nevermind; Make Changes | Correct library assignment applied per selection | |
| 20.14 | Change Rights | Select question; Change Rights; select new rights; test Nevermind; apply | Rights changed correctly; usage restricted per selection | |
| 20.15 | Change License | Select question; Change License; modify attribution; test Nevermind; apply | License updated | Investigate additional attribution field behavior; verify change restrictions enforced |

---

*Suite version: Working Draft Jan 2026 — Staging regression only. Production Smoke Suite is a separate document.*
