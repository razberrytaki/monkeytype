# @monkeytype/local-storage-manager

localStorage abstraction layer for privacy-focused monkeytype fork.

## Features

- Safe localStorage access with quota management
- Automatic cleanup when quota exceeded
- In-memory fallback when localStorage unavailable
- Schema validation using Zod
- Data import/export functionality
- Migration support for schema changes

## Usage

```typescript
import storageManager from "@monkeytype/local-storage-manager";

// Check availability
if (storageManager.getAvailable()) {
  // Use localStorage
}

// Settings
storageManager.setSettings({ theme: "dark", sound: true });
const settings = storageManager.getSettings();

// History
storageManager.addResult({
  id: "123",
  wpm: 100,
  acc: 98,
  mode: "time",
  mode2: "60",
  timestamp: Date.now(),
  testDuration: 60,
  characters: 300,
  consistency: 95,
  rawWpm: 102,
});
const history = storageManager.getHistory();

// Personal best
storageManager.updatePersonalBest("time60", 105);
const pb = storageManager.getPersonalBest();

// Export/Import
const data = storageManager.exportData();
storageManager.importData(data);
```

## Storage Keys

- `mt_settings` - User preferences
- `mt_history` - Typing test history
- `mt_personal_best` - Personal best records
- `mt_tags` - Tags and statistics
- `mt_version` - Storage format version

## Limitations

- Maximum history size: 500 results
- Automatic cleanup when quota exceeded
- localStorage limit: ~5-10MB (browser dependent)
