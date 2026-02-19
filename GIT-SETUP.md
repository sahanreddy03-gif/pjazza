# Git Setup for PJAZZA

Git is installed at: **`C:\Users\User\Desktop\Git\`**

## Quick commit & push

### Option 1: Use the helper script (recommended)

In PowerShell, from the PJAZZA folder:

```powershell
# Stage all changes
.\git-commit.ps1 add

# Commit with message
.\git-commit.ps1 save "Your commit message"

# Push to GitHub/remote
.\git-commit.ps1 push
```

### Option 2: Add Git to PATH (one-time)

1. Press **Win + R**, type `sysdm.cpl`, Enter
2. **Advanced** → **Environment Variables**
3. Under **User variables**, select **Path** → **Edit**
4. **New** → add: `C:\Users\User\Desktop\Git\cmd`
5. OK, restart your terminal

Then you can use `git` normally:

```bash
git add -A
git commit -m "Your message"
git push
```

### Option 3: Use full path

```powershell
& "C:\Users\User\Desktop\Git\cmd\git.exe" -C "C:\Users\User\Desktop\PJAZZA" add -A
& "C:\Users\User\Desktop\Git\cmd\git.exe" -C "C:\Users\User\Desktop\PJAZZA" commit -m "Your message"
& "C:\Users\User\Desktop\Git\cmd\git.exe" -C "C:\Users\User\Desktop\PJAZZA" push
```

## First-time: connect to GitHub

If you haven't set a remote yet:

```powershell
.\git-commit.ps1 push
# Or with full path:
# & "C:\Users\User\Desktop\Git\cmd\git.exe" -C "C:\Users\User\Desktop\PJAZZA" remote add origin https://github.com/YOUR_USERNAME/pjazza.git
# & "C:\Users\User\Desktop\Git\cmd\git.exe" -C "C:\Users\User\Desktop\PJAZZA" push -u origin master
```
