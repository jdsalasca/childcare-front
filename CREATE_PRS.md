# Creating Pull Requests for Issue Resolution

## Prerequisites
- GitHub CLI installed (`gh`)
- Authenticated with GitHub (`gh auth login`)

## Issue #12 - TypeScript Types

### Create PR for Issue #12
```bash
# Make sure you're on the correct branch
git checkout fix/issue-12-typescript-types

# Create PR using GitHub CLI
gh pr create \
  --title "Fix Issue #12: Replace 'any' types with proper TypeScript types" \
  --body-file PR_ISSUE_12.md \
  --base master \
  --head fix/issue-12-typescript-types
```

## Issue #13 - Console.log Removal

### Create PR for Issue #13
```bash
# Make sure you're on the correct branch
git checkout fix/issue-13-remove-debug-console-statements

# Create PR using GitHub CLI
gh pr create \
  --title "Fix Issue #13: Remove debug console.log statements from production code" \
  --body-file PR_ISSUE_13.md \
  --base master \
  --head fix/issue-13-remove-debug-console-statements
```

## Alternative: Manual PR Creation

If GitHub CLI is not available, you can create PRs manually:

1. Go to https://github.com/jdsalasca/childcare-front
2. Click "Compare & pull request" for the respective branches
3. Copy the content from `PR_ISSUE_12.md` or `PR_ISSUE_13.md`
4. Paste into the PR description
5. Add appropriate labels and assignees
6. Create the PR

## Review Existing Branches

The following branches already exist and may need review:

- `origin/fix/issue-20-inconsistent-error-handling`
- `origin/fix/issue-25-missing-unit-tests`
- `origin/fix/issue-26-missing-documentation`

## Dependabot PRs

Review and merge these automated PRs if safe:
- PR #52: Bump es-shim-unscopables from 1.0.2 to 1.1.0
- PR #53: Bump jspdf from 2.5.2 to 3.0.1
- PR #54: Bump react-phone-number-input from 3.4.9 to 3.4.12

## Issue #10 - Token Storage Security

This issue needs a new branch and PR:

```bash
# Create new branch for issue #10
git checkout -b fix/issue-10-token-storage-security

# Make changes to fix token storage security
# ... implement security improvements ...

# Commit and push
git add .
git commit -m "fix: implement secure token storage for issue #10"
git push origin fix/issue-10-token-storage-security

# Create PR
gh pr create \
  --title "Fix Issue #10: Implement secure token storage" \
  --body "Addresses token storage security issues" \
  --base master \
  --head fix/issue-10-token-storage-security
```