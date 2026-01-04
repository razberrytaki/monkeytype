# Monkeytype Privacy Fork

This is a privacy-focused fork of [Monkeytype](https://github.com/monkeytypegame/monkeytype) that removes all backend functionality, user tracking, and external dependencies.

## Modifications

This fork removes the following features from the original Monkeytype:
- Backend API and server dependencies (Express, MongoDB, Redis)
- User authentication and account system
- Firebase integration and analytics
- Leaderboards and social features
- Discord bot integration
- External data collection

## Privacy Features

- **100% Client-Side**: All data stored locally in your browser
- **No External Communication**: Works completely offline after initial load
- **No User Tracking**: No analytics or telemetry
- **Local Data Persistence**: Settings, history, and personal bests saved in localStorage
- **Data Export/Import**: Backup and restore your data

## Retained Features

- Core typing test functionality
- Multiple test modes (time, words, quotes, custom)
- Live error tracking and statistics
- Theme system and customization
- Smooth caret and animations
- Sound effects
- Funbox modes
- Language support

## Development

This is a fork of monkeytype v25.49.0, modified to remove all backend dependencies.

### Setup

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

### Project Structure

- `frontend/` - Main application
- `static/` - Static assets (languages, themes, quotes)
- `packages/local-storage-manager` - localStorage abstraction layer
- `packages/util` - Shared utilities

## Data Storage

All user data is stored in browser localStorage:
- `mt_settings` - User preferences
- `mt_history` - Typing test history (max 500 results)
- `mt_personal_best` - Personal best records
- `mt_tags` - Tags and statistics
- `mt_version` - Storage format version

## Data Management

### Export Data
1. Open browser console
2. Run: `localStorage.getItem('mt_settings')` to get settings
3. Or use the export functionality in the UI (if available)

### Import Data
1. Copy your exported JSON data
2. Use the import functionality in the UI (if available)
3. Or manually set localStorage items

## License

This project is licensed under GNU General Public License v3.0, the same as the original Monkeytype project.

### Attribution

This is a fork of [Monkeytype](https://github.com/monkeytypegame/monkeytype) by [monkeytypegame](https://github.com/monkeytypegame).

All modifications are documented in the Git history. The original license and copyright notices are preserved in accordance with GPL-3.0 requirements.

### GPL-3.0 Compliance

- Modified files are clearly marked in the Git history
- Original copyright notices preserved
- License terms apply to the entire derived work
- Source code is provided in full

## Original Project

For the original Monkeytype with account system and social features, visit:
- Website: https://monkeytype.com
- Repository: https://github.com/monkeytypegame/monkeytype

## Support

This privacy fork is maintained independently from the original Monkeytype project. For issues specific to this fork, please report them in this repository.

## Contributing

Contributions are welcome! Please read:
- [CONTRIBUTING.md](./docs/CONTRIBUTING.md)
- [CODE_OF_CONDUCT.md](./docs/CODE_OF_CONDUCT.md)

When contributing, please focus on:
- Bug fixes
- Privacy improvements
- Client-side features
- Documentation updates

Do not add:
- Backend dependencies
- External API calls
- User tracking
- Analytics

## Credits

All credits go to the original [Monkeytype team](https://github.com/monkeytypegame/monkeytype/graphs/contributors) for creating the core typing experience.

This privacy fork was created to provide a completely offline, privacy-focused alternative for users who prefer not to share their typing data.
