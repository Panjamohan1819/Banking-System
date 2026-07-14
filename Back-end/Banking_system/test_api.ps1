$ErrorActionPreference = 'Stop'

$baseUrl = "http://localhost:8080/api"

Write-Host "1. Registering user..."
$regBody = @{
    fullName = "Test User"
    email = "test@example.com"
    password = "password123"
    phoneNumber = "9876543210"
} | ConvertTo-Json

$regRes = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $regBody -ContentType "application/json"
$token = $regRes.token
Write-Host "Token received successfully!"

$headers = @{
    Authorization = "Bearer $token"
}

Write-Host "2. Creating account..."
$accRes = Invoke-RestMethod -Uri "$baseUrl/accounts" -Method Post -Headers $headers
Write-Host "Account Created: $($accRes | ConvertTo-Json)"

Write-Host "3. Getting account details..."
$getAccRes = Invoke-RestMethod -Uri "$baseUrl/accounts" -Method Get -Headers $headers
Write-Host "My Account: $($getAccRes | ConvertTo-Json)"

Write-Host "4. Depositing money..."
$depBody = @{
    amount = 500.00
    description = "Initial Deposit"
} | ConvertTo-Json
$depRes = Invoke-RestMethod -Uri "$baseUrl/accounts/deposit" -Method Post -Body $depBody -Headers $headers -ContentType "application/json"
Write-Host "Deposit response: $($depRes | ConvertTo-Json)"
