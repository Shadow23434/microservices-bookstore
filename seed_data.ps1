param(
    [string]$GatewayBaseUrl = "http://localhost:8000",
    [int]$TimeoutSeconds = 120
)

$ErrorActionPreference = "Stop"

function Wait-ForEndpoint {
    param(
        [string]$Url,
        [int]$TimeoutSeconds = 120
    )

    $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
    while ((Get-Date) -lt $deadline) {
        try {
            Invoke-RestMethod -Uri $Url -Method Get | Out-Null
            return
        } catch {
            Start-Sleep -Seconds 2
        }
    }

    throw "Timed out waiting for $Url"
}

function Wait-ForHealthyServices {
    param(
        [string]$HealthUrl,
        [int]$TimeoutSeconds = 120
    )

    $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
    while ((Get-Date) -lt $deadline) {
        try {
            $health = Invoke-RestMethod -Uri $HealthUrl -Method Get
            $states = @($health.services.PSObject.Properties | ForEach-Object { $_.Value })
            if ($states.Count -gt 0 -and ($states | Where-Object { $_ -ne "up" }).Count -eq 0) {
                return
            }
        } catch {
        }
        Start-Sleep -Seconds 3
    }

    throw "Timed out waiting for healthy services at $HealthUrl"
}

function Get-Json {
    param([string]$Url)

    return Invoke-RestMethod -Uri $Url -Method Get
}

function Post-Json {
    param(
        [string]$Url,
        [object]$Body
    )

    # Explicitly encode as UTF-8 bytes so non-ASCII characters (e.g. Vietnamese)
    # are transmitted correctly regardless of the system's default ANSI code page.
    $json  = $Body | ConvertTo-Json -Depth 10 -Compress
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
    return Invoke-RestMethod -Uri $Url -Method Post -ContentType "application/json; charset=utf-8" -Body $bytes
}

function Ensure-Entity {
    param(
        [string]$ListUrl,
        [object]$Payload,
        [scriptblock]$Match
    )

    $existing = Get-Json -Url $ListUrl
    foreach ($item in $existing) {
        if (& $Match $item $Payload) {
            return $item
        }
    }

    return Post-Json -Url $ListUrl -Body $Payload
}

function Get-CollectionCount {
    param([object]$Items)

    if ($null -eq $Items) {
        return 0
    }

    return @($Items | ForEach-Object { $_ }).Count
}

$apiBase = "$($GatewayBaseUrl.TrimEnd('/'))/api"

Write-Host "Waiting for API Gateway at $GatewayBaseUrl ..." -ForegroundColor Cyan
Wait-ForEndpoint -Url "$GatewayBaseUrl/health/" -TimeoutSeconds $TimeoutSeconds
Write-Host "Waiting for all services to report healthy ..." -ForegroundColor Cyan
Wait-ForHealthyServices -HealthUrl "$GatewayBaseUrl/health/" -TimeoutSeconds $TimeoutSeconds

$categories = @(
    @{ name = "Programming"; description = "Sách lập trình và thực hành phát triển phần mềm" },
    @{ name = "Python"; description = "Sách về Python cho người mới và nâng cao" },
    @{ name = "Software Architecture"; description = "Thiết kế hệ thống và kiến trúc phần mềm" },
    @{ name = "Data Engineering"; description = "Dữ liệu, hạ tầng và hệ thống phân tán" }
)

$books = @(
    @{
        title = "Python Crash Course"
        author = "Eric Matthes"
        price = "320000"
        stock = 15
        imageUrl = "https://covers.openlibrary.org/b/isbn/9781593279288-L.jpg"
    },
    @{
        title = "Fluent Python"
        author = "Luciano Ramalho"
        price = "495000"
        stock = 9
        imageUrl = "https://covers.openlibrary.org/b/isbn/9781492056355-L.jpg"
    },
    @{
        title = "Clean Code"
        author = "Robert C. Martin"
        price = "410000"
        stock = 12
        imageUrl = "https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg"
    },
    @{
        title = "The Pragmatic Programmer"
        author = "Andrew Hunt"
        price = "450000"
        stock = 7
        imageUrl = "https://covers.openlibrary.org/b/isbn/9780135957059-L.jpg"
    },
    @{
        title = "Designing Data-Intensive Applications"
        author = "Martin Kleppmann"
        price = "560000"
        stock = 6
        imageUrl = "https://covers.openlibrary.org/b/isbn/9781449373320-L.jpg"
    }
)

$customers = @(
    @{ name = "Nguyen Van An"; email = "nguyenvanan@example.com" },
    @{ name = "Tran Minh Chau"; email = "tranminhchau@example.com" },
    @{ name = "Le Hoang Duc"; email = "lehoangduc@example.com" }
)

$staffMembers = @(
    @{ name = "Pham Thi Kho"; email = "warehouse.team@example.com"; role = "warehouse"; employee_id = "STF001"; is_active = $true },
    @{ name = "Vu Bao Sales"; email = "sales.team@example.com"; role = "sales"; employee_id = "STF002"; is_active = $true },
    @{ name = "Do Support"; email = "support.team@example.com"; role = "support"; employee_id = "STF003"; is_active = $true }
)

$managers = @(
    @{ name = "Nguyen Operations"; email = "operations.manager@example.com"; department = "operations"; employee_id = "MGR001"; is_active = $true },
    @{ name = "Tran Inventory"; email = "inventory.manager@example.com"; department = "inventory"; employee_id = "MGR002"; is_active = $true },
    @{ name = "Le Finance"; email = "finance.manager@example.com"; department = "finance"; employee_id = "MGR003"; is_active = $true }
)

Write-Host "Seeding categories ..." -ForegroundColor Cyan
foreach ($category in $categories) {
    Ensure-Entity -ListUrl "$apiBase/categories/" -Payload $category -Match {
        param($existing, $payload)
        $existing.name -eq $payload.name
    } | Out-Null
}

Write-Host "Seeding books ..." -ForegroundColor Cyan
$bookIndex = @{}
foreach ($book in $books) {
    $created = Ensure-Entity -ListUrl "$apiBase/books/" -Payload $book -Match {
        param($existing, $payload)
        $existing.title -eq $payload.title -and $existing.author -eq $payload.author
    }
    $bookIndex[$created.title] = $created
}

Write-Host "Seeding customers ..." -ForegroundColor Cyan
$customerIndex = @{}
foreach ($customer in $customers) {
    $created = Ensure-Entity -ListUrl "$apiBase/customers/" -Payload $customer -Match {
        param($existing, $payload)
        $existing.email -eq $payload.email
    }
    $customerIndex[$created.email] = $created
}

Write-Host "Seeding staff ..." -ForegroundColor Cyan
foreach ($staff in $staffMembers) {
    Ensure-Entity -ListUrl "$apiBase/staff/" -Payload $staff -Match {
        param($existing, $payload)
        $existing.employee_id -eq $payload.employee_id
    } | Out-Null
}

Write-Host "Seeding managers ..." -ForegroundColor Cyan
foreach ($manager in $managers) {
    Ensure-Entity -ListUrl "$apiBase/managers/" -Payload $manager -Match {
        param($existing, $payload)
        $existing.employee_id -eq $payload.employee_id
    } | Out-Null
}

$reviews = @(
    @{
        customer_id = $customerIndex["nguyenvanan@example.com"].id
        book_id = $bookIndex["Python Crash Course"].id
        rating = 5
        comment = "Sách nhập môn rất dễ theo dõi và thực hành."
    },
    @{
        customer_id = $customerIndex["nguyenvanan@example.com"].id
        book_id = $bookIndex["Clean Code"].id
        rating = 5
        comment = "Nội dung thực tế, hữu ích khi review code."
    },
    @{
        customer_id = $customerIndex["tranminhchau@example.com"].id
        book_id = $bookIndex["Fluent Python"].id
        rating = 4
        comment = "Phù hợp khi đã có nền tảng Python."
    },
    @{
        customer_id = $customerIndex["lehoangduc@example.com"].id
        book_id = $bookIndex["The Pragmatic Programmer"].id
        rating = 5
        comment = "Rất đáng đọc cho mọi lập trình viên."
    }
)

Write-Host "Seeding reviews ..." -ForegroundColor Cyan
foreach ($review in $reviews) {
    Ensure-Entity -ListUrl "$apiBase/reviews/" -Payload $review -Match {
        param($existing, $payload)
        $existing.customer_id -eq $payload.customer_id -and $existing.book_id -eq $payload.book_id
    } | Out-Null
}

$existingOrders = Get-Json -Url "$apiBase/orders/"
if ($null -eq $existingOrders) {
    $existingOrders = @()
}
$orders = @(
    @{
        customer_id = $customerIndex["nguyenvanan@example.com"].id
        shipping_address = "123 Nguyen Hue, Quan 1, TP.HCM"
        payment_method = "credit_card"
        items = @(
            @{ book_id = $bookIndex["Python Crash Course"].id; quantity = 1; unit_price = $bookIndex["Python Crash Course"].price },
            @{ book_id = $bookIndex["Clean Code"].id; quantity = 1; unit_price = $bookIndex["Clean Code"].price }
        )
    },
    @{
        customer_id = $customerIndex["tranminhchau@example.com"].id
        shipping_address = "45 Le Loi, Hai Chau, Da Nang"
        payment_method = "e_wallet"
        items = @(
            @{ book_id = $bookIndex["Fluent Python"].id; quantity = 1; unit_price = $bookIndex["Fluent Python"].price }
        )
    }
)

Write-Host "Seeding orders, payments and shipments ..." -ForegroundColor Cyan
foreach ($order in $orders) {
    $matched = $existingOrders | Where-Object {
        $_.customer_id -eq $order.customer_id -and $_.shipping_address -eq $order.shipping_address
    } | Select-Object -First 1

    if (-not $matched) {
        $matched = Post-Json -Url "$apiBase/orders/" -Body $order
        $existingOrders += $matched
    }
}

Write-Host "Generating recommendations ..." -ForegroundColor Cyan
foreach ($customer in $customerIndex.Values) {
    Get-Json -Url "$apiBase/recommendations/$($customer.id)/" | Out-Null
}

$summary = [ordered]@{
    books = Get-CollectionCount (Get-Json -Url "$apiBase/books/")
    customers = Get-CollectionCount (Get-Json -Url "$apiBase/customers/")
    staff = Get-CollectionCount (Get-Json -Url "$apiBase/staff/")
    managers = Get-CollectionCount (Get-Json -Url "$apiBase/managers/")
    categories = Get-CollectionCount (Get-Json -Url "$apiBase/categories/")
    orders = Get-CollectionCount (Get-Json -Url "$apiBase/orders/")
    payments = Get-CollectionCount (Get-Json -Url "$apiBase/payments/")
    shipments = Get-CollectionCount (Get-Json -Url "$apiBase/shipments/")
    reviews = Get-CollectionCount (Get-Json -Url "$apiBase/reviews/")
}

Write-Host "Seed complete." -ForegroundColor Green
$summary.GetEnumerator() | ForEach-Object {
    Write-Host ("{0}: {1}" -f $_.Key, $_.Value)
}