$currentScript = $MyInvocation.MyCommand.Name
Get-ChildItem -Path $PSScriptRoot -Filter "*.ps1" | Where-Object { $_.Name -ne $currentScript } | ForEach-Object {
    Write-Host "Running $($_.Name)..."
    & $_.FullName
}