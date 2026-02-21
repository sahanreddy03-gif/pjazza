# PJAZZA — Git helper (uses Git from Desktop)
$git = "$env:USERPROFILE\Desktop\Git\cmd\git.exe"
$repo = $PSScriptRoot

if (-not (Test-Path $git)) {
  Write-Host "Git not found at $git" -ForegroundColor Red
  exit 1
}

$argsList = $args
if ($argsList.Count -eq 0) {
  Write-Host "Usage:" -ForegroundColor Cyan
  Write-Host "  .\git-commit.ps1 add          # Stage all changes"
  Write-Host "  .\git-commit.ps1 commit       # Commit staged (prompts for message)"
  Write-Host "  .\git-commit.ps1 push         # Push to remote"
  Write-Host "  .\git-commit.ps1 status       # Show status"
  Write-Host "  .\git-commit.ps1 save 'msg'   # Add + commit in one step"
  exit 0
}

$cmd = $argsList[0]
switch ($cmd) {
  "add"   { & $git -C $repo add -A }
  "status" { & $git -C $repo status }
  "push"  { & $git -C $repo push }
  "commit" {
    $msg = Read-Host "Commit message"
    if ($msg) { & $git -C $repo commit -m $msg }
  }
  "save" {
    $msg = if ($argsList.Count -gt 1) { $argsList[1..($argsList.Count-1)] -join " " } else { "Update" }
    Write-Host "Running checks (lint + build)..." -ForegroundColor Cyan
    npm run check 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
      Write-Host "Checks failed. Fix errors before committing." -ForegroundColor Red
      exit 1
    }
    Write-Host "Checks passed." -ForegroundColor Green
    & $git -C $repo add -A
    & $git -C $repo commit -m $msg
  }
  default { & $git -C $repo @argsList }
}
