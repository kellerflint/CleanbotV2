# Clean Bot API Documentation

Listen up, soldier! If you're going to be using me, you better follow my instructions to the letter. Here's the breakdown:

---

## Commands

### `ping`

- **Description:** Test my connection.
- **Usage:** `/ping`

  If I'm alive and kicking, I'll let you know. If not, well, perhaps I've faced my last byte in the digital trenches.

---

### `task`

- **Description:** Create a new task.
- **Usage:** `/task [content] [assigned]`

  **Options:**

  - `content`: What's the damn task? _(String, Required)_
  - `assigned`: Who's the unlucky one? Mention the person using their discord tag. _(User, Required)_

  If you've got work to be done, spit it out. Let me know who's doing it too.

---

### `done`

- **Description:** Mark a task as done.
- **Usage:** `/done [id]`

  **Options:**

  - `id`: Which task did you complete, soldier? Give me its number! _(Integer, Required)_

  Good job, but don't expect any medals. It's your duty!

---

### `list-chores`

- **Description:** List all the chores.
- **Usage:** `/list-chores`

  Need the situation report? Consider it done.

---

### `list-tasks`

- **Description:** List all the tasks.
- **Usage:** `/list-tasks`

  Want to know what's pending? Here's your list.

---

### `list-prefs`

- **Description:** List all the reminder times.
- **Usage:** `/list-prefs`

  Need to check when you're on duty? Here it is.

---

### `chore`

- **Description:** Create a new chore.
- **Usage:** `/chore [name] [description] [frequency] [default-assigned]`

  **Options:**

  - `name`: What's the chore called? _(String, Required)_
  - `description`: What needs doing? _(String, Required)_
  - `frequency`: How often? Give me days, not excuses! _(Integer, Required)_
  - `default-assigned`: Default person on duty. Mention them. _(User, Required)_

  Keep your base clean, maggot! Let me know the drill.

---

### `set-reminder-times`

- **Description:** Set those reminder times.
- **Usage:** `/set-reminder-times [day] [times]`

  **Options:**

  - `day`: Day to be reminded about tasks (0-6, where 0 is Sunday). _(Integer, Required)_
  - `times`: A comma separated list of times as integers (6-22 military time). _(String, Required)_

  Let me know when you want those reminders, but remember, no snoozing!

---

That's it, soldier! Now, get to work! And if you mess up, don't come crying to me. Stick to the manual, and we'll get along just fine. Dismissed!
