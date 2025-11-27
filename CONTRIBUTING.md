# Contributing to @yambwa/ussd-lab

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/pretty-lodger.git
   cd ussb-lab
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a new branch** for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm test:ui

# Run tests with coverage
npm test -- --coverage
```

### Code Quality

```bash
# Type check
npm run type-check

# Lint code
npm run lint

# Format code
npm run format
```

### Building

```bash
# Build for production
npm run build

# Build in watch mode (for development)
npm run dev
```

## Code Style

- **Language**: TypeScript
- **Format**: Prettier (auto-formatted)
- **Linting**: ESLint
- **Testing**: Vitest

Please run `npm run format` before committing.

## Commit Messages

Use clear, descriptive commit messages:
- ✨ `feat: add new feature`
- 🐛 `fix: resolve issue`
- 📚 `docs: update documentation`
- 🎨 `style: code formatting`
- ♻️ `refactor: restructure code`
- ✅ `test: add/update tests`

## Pull Request Process

1. **Ensure tests pass**: `npm test`
2. **Ensure code is formatted**: `npm run format`
3. **Ensure no lint errors**: `npm run lint`
4. **Update documentation** if needed
5. **Describe changes** in your PR with context and motivation
6. **Reference any related issues** (e.g., "Closes #123")

## Reporting Bugs

When reporting bugs, please include:
- Description of the issue
- Steps to reproduce
- Expected behavior vs actual behavior
- Your environment (Node version, OS, etc.)
- Code snippet or test case if possible

## Feature Requests

Feature requests are welcome! Please describe:
- The problem it solves
- How it would be used
- Any design considerations
- Examples or user stories

## Areas for Contribution

- **Core Features**: Enhancements to simulation, validation, routing
- **Testing**: Additional test cases and edge cases
- **Documentation**: Examples, tutorials, API docs
- **Performance**: Optimizations and benchmarks
- **Integration**: Examples with real USSD providers
- **UI Playground**: React component development
- **Localization**: Multi-language support

## Project Structure

```
src/
├── core/           # Types, validation, app builders
├── simulator/      # Session simulation engine
├── testing/        # Test helpers and assertions
└── playground/     # (Future) React UI component
```

## Questions?

Feel free to open an issue or reach out. We're here to help!

---

Thank you for contributing to making USSD development easier! 🚀
