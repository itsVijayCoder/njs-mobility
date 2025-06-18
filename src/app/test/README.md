# Test Suite Documentation

## Overview

This directory contains all test-related routes and components for the NJS
Mobility Shift Management System. The test environment provides a safe space to
test all features without affecting production data.

## Directory Structure

```
src/app/test/
├── layout.tsx                 # Test environment layout with navigation
├── page.tsx                   # Test suite dashboard and navigation
├── debug-parsing/             # Detailed parsing logs and debugging
├── fuel-price-api-test/       # API endpoint testing
├── fuel-price-demo/           # Live price update simulation
├── test-parsing/              # Basic parsing algorithm testing
├── test-paste-functionality/  # Comprehensive paste/import testing
├── test-shift/                # Shift 1 testing (with pump test)
├── test-shift-2/              # Shift 2 testing (without pump test)
├── theme-test/                # UI components and styling tests
└── user-data-test/            # User's exact data format testing
```

## Access Points

### Main Test Dashboard

-  **URL**: `/test`
-  **Purpose**: Central navigation hub for all test routes
-  **Features**: Organized by category, direct links, quick navigation

### Individual Test Routes

#### Shift Reading Tests

-  `/test/test-shift` - Shift 1 with automatic 5L pump test
-  `/test/test-shift-2` - Shift 2 without pump test

#### Data Import & Parsing Tests

-  `/test/test-paste-functionality` - Comprehensive paste testing
-  `/test/test-parsing` - Basic parsing algorithms
-  `/test/user-data-test` - Real user data format testing
-  `/test/debug-parsing` - Detailed parsing logs

#### Fuel Price Integration Tests

-  `/test/fuel-price-demo` - Live price update simulation
-  `/test/fuel-price-api-test` - API integration testing

#### UI & Theme Tests

-  `/test/theme-test` - Component styling and themes

## Features

### Test Environment Layout

-  **Header**: Clear test environment branding
-  **Navigation**: Quick access to test suite and main app
-  **Footer**: Safety reminder about test environment

### Organized Categories

-  **Shift Reading**: Different shift configurations
-  **Data Processing**: Import, parsing, and validation
-  **API Integration**: Real-time price updates
-  **UI Components**: Styling and theming

### Safety Features

-  Isolated from production routes
-  Clear visual indicators of test environment
-  Safe data manipulation without affecting main app

## Usage Guidelines

### For Development

1. Use `/test` as the main entry point
2. Test features in isolation using specific test routes
3. Verify API integrations using dedicated test pages
4. Debug data parsing issues using debug tools

### For QA Testing

1. Access the test suite dashboard at `/test`
2. Follow the organized categories for systematic testing
3. Test edge cases using the debug and parsing tools
4. Verify fuel price integration using API test pages

### For Demonstrations

1. Use `/test/test-shift` for shift reading demos
2. Use `/test/fuel-price-demo` for price integration demos
3. Use `/test/test-paste-functionality` for data import demos

## Architecture Benefits

### Clean Separation

-  Test routes isolated from production code
-  Clear organizational structure
-  Easy maintenance and updates

### Comprehensive Coverage

-  All major features have dedicated test routes
-  Edge cases and debugging tools included
-  API integration testing available

### User-Friendly Navigation

-  Centralized dashboard with categories
-  Direct links to all test functionality
-  Quick navigation between test and main app

### Production Ready

-  Test routes can be easily excluded from production builds
-  No interference with main application routes
-  Safe environment for testing and development

## Maintenance

### Adding New Tests

1. Create new test component in appropriate subfolder
2. Add route entry to `page.tsx` test dashboard
3. Update this documentation

### Removing Tests

1. Remove test folder/component
2. Update test dashboard navigation
3. Update documentation

This organization ensures a clean, maintainable, and comprehensive testing
environment for the shift management system.
