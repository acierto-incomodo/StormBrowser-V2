$scripts = Get-ChildItem -Path ".\scriptsRun" -Filter "*.ps1"
if ($scripts.Count -eq 0) {
    Write-Host "No .ps1 scripts found in scriptsRun."
    exit
}

while ($true) {
    Clear-Host
    Write-Host "=== StormBrowser Build Menu ===" -ForegroundColor Cyan
    for ($i = 0; $i -lt $scripts.Count; $i++) {
        Write-Host "$($i + 1). $($scripts[$i].Name)"
    }
    Write-Host "Q. Quit"

    $selection = Read-Host "Enter selection"
    if ($selection -match "^[qQ]$") { break }

    if ($selection -match "^\d+$" -and [int]$selection -ge 1 -and [int]$selection -le $scripts.Count) {
        $scriptToRun = $scripts[[int]$selection - 1]

        $releaseType = Read-Host "Release type? (L)atest or (P)rerelease [L]"
        if ($releaseType -match "^[pP]$") {
            Write-Host "Setting release type to Prerelease" -ForegroundColor Yellow
            $env:RELEASE_TYPE = "prerelease"
        } else {
            Write-Host "Setting release type to Latest" -ForegroundColor Yellow
            Remove-Item -ErrorAction SilentlyContinue Env:\RELEASE_TYPE
        }

        Write-Host "Running $($scriptToRun.Name)..." -ForegroundColor Green
        & $scriptToRun.FullName
        Write-Host "Done. Press any key to continue..."
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        Remove-Item -ErrorAction SilentlyContinue Env:\RELEASE_TYPE
    }
}