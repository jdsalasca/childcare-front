# 🏫 Childcare Management System

[![CI/CD Pipeline](https://github.com/your-username/childcare-front/actions/workflows/ci.yml/badge.svg)](https://github.com/your-username/childcare-front/actions/workflows/ci.yml)
[![CodeQL](https://github.com/your-username/childcare-front/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/your-username/childcare-front/actions/workflows/codeql-analysis.yml)

[![Maintainability](https://api.codeclimate.com/v1/badges/your-repo-id/maintainability)](https://codeclimate.com/github/your-username/childcare-front/maintainability)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=your-project-key&metric=security_rating)](https://sonarcloud.io/dashboard?id=your-project-key)
[![Dependencies](https://img.shields.io/librariesio/github/your-username/childcare-front)](https://libraries.io/github/your-username/childcare-front)
[![License](https://img.shields.io/github/license/your-username/childcare-front)](LICENSE)
[![Version](https://img.shields.io/github/package-json/v/your-username/childcare-front)](package.json)

> A comprehensive childcare management system built with React, TypeScript, and modern web technologies.

## 🌟 Features

- 👶 **Child Management**: Complete child profiles with medical information, permissions, and formulas
- 💰 **Bills & Payments**: Daily cash record management with PDF report generation
- 📊 **Cash Register**: Opening/closing cash register with detailed money tracking
- 📋 **Contracts**: Digital contract generation and management
- 🏦 **Financial Reports**: Comprehensive financial reporting and analytics
- 🔒 **Security**: Role-based access control and data protection
- 📱 **Responsive Design**: Mobile-first approach with modern UI/UX
- 🌐 **Internationalization**: Multi-language support (English/Spanish)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Yarn package manager
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/childcare-front.git
cd childcare-front

# Install dependencies
yarn install

# Start development server
yarn dev

# Open http://localhost:3000 in your browser
```

### Development Commands

```bash
# Development
yarn dev              # Start development server
yarn build            # Build for production
yarn preview          # Preview production build

# Testing
yarn test             # Run tests
yarn test:watch       # Run tests in watch mode
yarn test:coverage    # Run tests with coverage
yarn test:ui          # Run tests with UI

# Code Quality
yarn lint             # Run ESLint
yarn lint:fix         # Fix ESLint issues
yarn format           # Format code with Prettier
yarn type-check       # Run TypeScript checks

# Analysis
yarn analyze          # Analyze bundle size
yarn audit            # Security audit
```

## 🏗️ Project Structure

```
childcare-front/
├── 📁 .github/              # GitHub workflows and templates
│   ├── workflows/           # CI/CD pipelines
│   ├── ISSUE_TEMPLATE/      # Issue templates
│   └── pull_request_template.md
├── 📁 public/               # Static assets
├── 📁 src/
│   ├── 📁 components/       # React components
│   │   ├── bills/          # Bills management
│   │   ├── contracts/      # Contract management
│   │   ├── deposits/       # Cash register
│   │   └── users/          # User management
│   ├── 📁 models/          # API models and hooks
│   ├── 📁 types/           # TypeScript definitions
│   ├── 📁 utils/           # Utility functions
│   ├── 📁 assets/          # Styles and assets
│   └── 📁 test/            # Test files
├── 📄 package.json
├── 📄 tsconfig.json
├── 📄 vite.config.js
└── 📄 vitest.config.ts
```

## 🧪 Testing

We maintain high code quality with comprehensive testing:

- **Unit Tests**: Component and utility function testing
- **Integration Tests**: API and workflow testing
- **Coverage**: Minimum 70% code coverage requirement
- **E2E Tests**: Critical user journey testing

```bash
# Run all tests
yarn test

# Run tests with coverage
yarn test:coverage

# Run specific test file
yarn test src/components/bills/Bills.test.tsx

# Run tests in watch mode
yarn test:watch
```

## 📊 Code Quality & Metrics

### Automated Quality Checks

- **ESLint**: Code linting and style enforcement
- **Prettier**: Code formatting
- **TypeScript**: Type checking and safety
- **Vitest**: Fast unit testing
- **CodeQL**: Security vulnerability scanning
- **Dependabot**: Automated dependency updates

### Quality Gates

- ✅ All tests must pass
- ✅ Code coverage ≥ 70%
- ✅ No ESLint errors
- ✅ No TypeScript errors
- ✅ No security vulnerabilities
- ✅ Bundle size within limits

## 🔒 Security

Security is a top priority. We implement:

- **CodeQL Analysis**: Automated security scanning
- **Dependency Scanning**: Vulnerability detection in dependencies
- **Snyk Integration**: Continuous security monitoring
- **OWASP Compliance**: Following security best practices
- **Regular Audits**: Weekly security audits

## 📈 Performance

- **Bundle Analysis**: Automated bundle size tracking
- **Performance Monitoring**: Core Web Vitals tracking
- **Optimization**: Code splitting and lazy loading
- **Caching**: Efficient caching strategies

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for your changes
5. Ensure all tests pass (`yarn test`)
6. Run quality checks (`yarn lint && yarn type-check`)
7. Commit your changes (`git commit -m 'Add amazing feature'`)
8. Push to the branch (`git push origin feature/amazing-feature`)
9. Open a Pull Request

### Code Style

- Follow the existing code style
- Use TypeScript for type safety
- Write tests for new functionality
- Keep functions small and focused
- Use meaningful variable names
- Add comments for complex logic

## 📋 Architecture

### Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Library**: PrimeReact, Tailwind CSS
- **State Management**: React Hook Form, React Query
- **Testing**: Vitest, React Testing Library
- **Build Tool**: Vite
- **Package Manager**: Yarn

### Key Patterns

- **Component Architecture**: Modular, reusable components
- **Custom Hooks**: Business logic separation
- **API Layer**: Centralized API management
- **Type Safety**: Comprehensive TypeScript usage
- **Error Handling**: Graceful error boundaries

## 📚 Documentation

- [API Documentation](docs/api.md)
- [Component Library](docs/components.md)
- [Testing Guide](TESTING_GUIDE.md)
- [Deployment Guide](docs/deployment.md)
- [Troubleshooting](docs/troubleshooting.md)

## 🚀 Deployment

### Environment Variables

```env
VITE_API_BASE_URL=https://api.example.com
VITE_APP_NAME=Childcare Management
VITE_APP_VERSION=1.0.0
```

### Production Build

```bash
# Build for production
yarn build

# Preview production build
yarn preview

# Deploy to your hosting platform
# (Configure your deployment pipeline)
```

## 📊 Project Metrics

- **Lines of Code**: ~15,000+
- **Components**: 50+
- **Test Coverage**: 70%+
- **Dependencies**: Actively maintained
- **Performance Score**: 95+

## 🐛 Issue Reporting

Found a bug? Please use our [Bug Report Template](.github/ISSUE_TEMPLATE/bug_report.md)

## ✨ Feature Requests

Have an idea? Use our [Feature Request Template](.github/ISSUE_TEMPLATE/feature_request.md)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- PrimeReact for the UI components
- Vite for the build tool
- All contributors who help improve this project

## 📞 Support

- 📧 Email: support@example.com
- 💬 Discord: [Join our community](https://discord.gg/example)
- 📖 Documentation: [Full docs](https://docs.example.com)

---

<div align="center">
  <p>Made with ❤️ by the Childcare Management Team</p>
  <p>
    <a href="https://github.com/your-username/childcare-front/stargazers">⭐ Star us on GitHub</a> •
    <a href="https://github.com/your-username/childcare-front/issues">🐛 Report Bug</a> •
    <a href="https://github.com/your-username/childcare-front/issues">✨ Request Feature</a>
  </p>
</div>
