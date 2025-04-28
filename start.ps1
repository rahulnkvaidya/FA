# Yeh script aapke Express aur React projects ko alag-alag PowerShell windows mein run karegi.

# Dhyan dein: Maan lijiye ki aapke 'express' aur 'react' folders ussi directory mein hain jahan yeh script file (.ps1) rakhi hai.
# Agar aapke folders kahin aur hain, toh neeche diye gaye paths ko update karein.

# Script ki directory pata karein
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition

# Express folder ka path define karein
# Agar 'express' folder script ke paas nahi hai, toh yahan sahi path dein.
$ExpressFolderPath = Join-Path $ScriptDir "express"

# React folder ka path define karein
# Agar 'react' folder script ke paas nahi hai, toh yahan sahi path dein.
$ReactFolderPath = Join-Path $ScriptDir "react"

Write-Host "Express backend ko ek naye PowerShell window mein start kar rahe hain..."

# Check karein ki Express folder exist karta hai
if (Test-Path $ExpressFolderPath -PathType Container) {
    # 'Start-Process' command ek naya process (yahan PowerShell) start karta hai.
    # '-NoExit' naye window ko command execute hone ke baad khula rakhta hai.
    # '-ArgumentList' naye PowerShell instance ko arguments pass karta hai.
    # '-Command' argument naye PowerShell window mein execute hone wali command specify karta hai.
    # Nested quotes (single inside double) command string ke liye zaroori hain.
    Start-Process powershell -ArgumentList "-NoExit -Command ""Set-Location -Path '$ExpressFolderPath'; Write-Host 'Express backend chal raha hai...'; npm run start"""
    Write-Host "Express ke liye naya PowerShell window khul gaya hai."
} else {
    Write-Host "Error: Express folder '$ExpressFolderPath' nahi mila."
}

Write-Host "React frontend ko ek dusre naye PowerShell window mein start kar rahe hain..."

# Check karein ki React folder exist karta hai
if (Test-Path $ReactFolderPath -PathType Container) {
    # React ke liye ek aur naya PowerShell window start karein
    Start-Process powershell -ArgumentList "-NoExit -Command ""Set-Location -Path '$ReactFolderPath'; Write-Host 'React frontend chal raha hai...'; npm run start"""
    Write-Host "React ke liye naya PowerShell window khul