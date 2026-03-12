$base = $PSScriptRoot

# Đã bổ sung đầy đủ 12 services
$svcs = @(
    @("customer-service", "customer_service"),
    @("book-service", "book_service"),
    @("cart-service", "cart_service"),
    @("staff-service", "staff_service"),
    @("manager-service", "manager_service"),
    @("catalog-service", "catalog_service"),
    @("order-service", "order_service"),
    @("ship-service", "ship_service"),
    @("pay-service", "pay_service"),
    @("comment-rate-service", "comment_rate_service"),
    @("recommender-ai-service", "recommender_ai_service"),
    @("api-gateway", "api_gateway")
)

foreach ($s in $svcs) {
    $svc = $s[0]; $dj = $s[1]
    
    $venvPath = "$base\$svc\venv"
    $py = "$venvPath\Scripts\python.exe"
    $pip = "$venvPath\Scripts\pip.exe"
    $req = "$base\$svc\requirements.txt"
    $manage = "$base\$svc\$dj\manage.py"
    
    Write-Host "=== Recreating venv & migrating for $svc ===" -ForegroundColor Cyan
    
    # 1. Remove broken old venv (if exists)
    if (Test-Path $venvPath) {
        Write-Host "1. Removing old venv..."
        Remove-Item -Recurse -Force $venvPath
    }
    
    # 2. Create a new venv using system Python
    Write-Host "2. Creating new venv..."
    python -m venv $venvPath
    
    # 3. Install dependencies from requirements.txt
    Write-Host "3. Installing dependencies (please wait)..."
    & $pip install -r $req | Out-Null
    
    # 4. Run Django migration commands
    Write-Host "4. Running migrations..."
    & $py $manage makemigrations app
    & $py $manage migrate
    
    # Check the result
    $db = Test-Path "$base\$svc\$dj\db.sqlite3"
    Write-Host "DB created: $db" -ForegroundColor $(if ($db) {"Green"} else {"Red"})
    Write-Host "------------------------------------------------"
}

Write-Host "ALL PROCESSES COMPLETED!" -ForegroundColor Green