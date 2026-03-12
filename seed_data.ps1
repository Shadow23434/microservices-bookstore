param(
    [string]$WorkspaceRoot = $PSScriptRoot
)

$ErrorActionPreference = "Stop"

function Escape-SqlLiteral {
    param([AllowNull()][string]$Value)

    if ($null -eq $Value) {
        return "NULL"
    }

    return "'" + ($Value -replace "'", "''") + "'"
}

function Invoke-Sqlite {
    param(
        [string]$DbPath,
        [string]$Sql
    )

    $output = & sqlite3 $DbPath $Sql 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "SQLite command failed for $DbPath`nSQL: $Sql`nError: $($output -join [Environment]::NewLine)"
    }

    return $output
}

function Invoke-SqliteScalar {
    param(
        [string]$DbPath,
        [string]$Sql
    )

    $rows = Invoke-Sqlite -DbPath $DbPath -Sql $Sql
    if ($null -eq $rows -or $rows.Count -eq 0) {
        return $null
    }

    return "$($rows[0])".Trim()
}

function Ensure-DbFile {
    param([string]$DbPath)

    if (-not (Test-Path -Path $DbPath -PathType Leaf)) {
        throw "Database file not found: $DbPath"
    }
}

if (-not (Get-Command sqlite3 -ErrorAction SilentlyContinue)) {
    throw "sqlite3 command was not found in PATH. Please install sqlite3 or add it to PATH first."
}

$db = @{
    books = Join-Path $WorkspaceRoot "book-service/book_service/db.sqlite3"
    categories = Join-Path $WorkspaceRoot "catalog-service/catalog_service/db.sqlite3"
    customers = Join-Path $WorkspaceRoot "customer-service/customer_service/db.sqlite3"
    carts = Join-Path $WorkspaceRoot "cart-service/cart_service/db.sqlite3"
    staff = Join-Path $WorkspaceRoot "staff-service/staff_service/db.sqlite3"
    managers = Join-Path $WorkspaceRoot "manager-service/manager_service/db.sqlite3"
    reviews = Join-Path $WorkspaceRoot "comment-rate-service/comment_rate_service/db.sqlite3"
    orders = Join-Path $WorkspaceRoot "order-service/order_service/db.sqlite3"
    payments = Join-Path $WorkspaceRoot "pay-service/pay_service/db.sqlite3"
    shipments = Join-Path $WorkspaceRoot "ship-service/ship_service/db.sqlite3"
}

foreach ($entry in $db.GetEnumerator()) {
    Ensure-DbFile -DbPath $entry.Value
}

$bookHasImageUrlColumn = [bool](Invoke-SqliteScalar -DbPath $db.books -Sql "SELECT 1 FROM pragma_table_info('app_book') WHERE name = 'imageUrl' LIMIT 1;")

$categories = @(
    @{ name = "Programming"; description = "Sách lập trình và thực hành phát triển phần mềm" },
    @{ name = "Python"; description = "Sách về Python cho người mới và nâng cao" },
    @{ name = "Software Architecture"; description = "Thiết kế hệ thống và kiến trúc phần mềm" },
    @{ name = "Data Engineering"; description = "Dữ liệu, hạ tầng và hệ thống phân tán" }
)

$books = @(
    @{
        title = "Django REST Framework"
        author = "Tom Christie"
        price = "380000"
        stock = 10
        imageUrl = "https://tse2.mm.bing.net/th/id/OIP.ltQXmHg61bcfaX86yY_bAwAAAA?pid=ImgDet&w=191&h=235&c=7&o=7&rm=3"
    },
    @{
        title = "Microservices Patterns"
        author = "Chris Richardson"
        price = "520000"
        stock = 8
        imageUrl = "https://th.bing.com/th/id/OIP.1C4yVyGkcWqJdnLSR_cLIAHaLH?w=115&h=180&c=7&r=0&o=7&pid=1.7&rm=3"
    },
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
    $name = Escape-SqlLiteral $category.name
    $description = Escape-SqlLiteral $category.description
    Invoke-Sqlite -DbPath $db.categories -Sql @"
INSERT INTO app_category (name, description, created_at, parent_id)
SELECT $name, $description, datetime('now'), NULL
WHERE NOT EXISTS (
    SELECT 1 FROM app_category WHERE name = $name
);
"@ | Out-Null
}

Write-Host "Seeding books ..." -ForegroundColor Cyan
$bookIndex = @{}
foreach ($book in $books) {
    $title = Escape-SqlLiteral $book.title
    $author = Escape-SqlLiteral $book.author
    $price = [double]$book.price
    $stock = [int]$book.stock
    $imageUrl = Escape-SqlLiteral $book.imageUrl

    if ($bookHasImageUrlColumn) {
        Invoke-Sqlite -DbPath $db.books -Sql @"
INSERT INTO app_book (title, author, price, stock, imageUrl)
SELECT $title, $author, $price, $stock, $imageUrl
WHERE NOT EXISTS (
    SELECT 1 FROM app_book WHERE title = $title AND author = $author
);
"@ | Out-Null
    }
    else {
        Invoke-Sqlite -DbPath $db.books -Sql @"
INSERT INTO app_book (title, author, price, stock)
SELECT $title, $author, $price, $stock
WHERE NOT EXISTS (
    SELECT 1 FROM app_book WHERE title = $title AND author = $author
);
"@ | Out-Null
    }

    $bookId = Invoke-SqliteScalar -DbPath $db.books -Sql "SELECT id FROM app_book WHERE title = $title AND author = $author LIMIT 1;"
    if (-not $bookId) {
        throw "Cannot resolve id for seeded book: $($book.title)"
    }

    $bookIndex[$book.title] = [int]$bookId
}

Write-Host "Seeding customers ..." -ForegroundColor Cyan
$customerIndex = @{}
foreach ($customer in $customers) {
    $name = Escape-SqlLiteral $customer.name
    $email = Escape-SqlLiteral $customer.email

    Invoke-Sqlite -DbPath $db.customers -Sql @"
INSERT INTO app_customer (name, email)
SELECT $name, $email
WHERE NOT EXISTS (
    SELECT 1 FROM app_customer WHERE email = $email
);
"@ | Out-Null

    $customerId = Invoke-SqliteScalar -DbPath $db.customers -Sql "SELECT id FROM app_customer WHERE email = $email LIMIT 1;"
    if (-not $customerId) {
        throw "Cannot resolve id for seeded customer: $($customer.email)"
    }

    $customerIndex[$customer.email] = [int]$customerId
}

Write-Host "Seeding carts ..." -ForegroundColor Cyan
foreach ($customer in $customers) {
    $customerId = [int]$customerIndex[$customer.email]

    Invoke-Sqlite -DbPath $db.carts -Sql @"
INSERT INTO app_cart (customer_id, created_at)
SELECT $customerId, datetime('now')
WHERE NOT EXISTS (
    SELECT 1 FROM app_cart WHERE customer_id = $customerId
);
"@ | Out-Null
}

Write-Host "Seeding staff ..." -ForegroundColor Cyan
foreach ($staff in $staffMembers) {
    $name = Escape-SqlLiteral $staff.name
    $email = Escape-SqlLiteral $staff.email
    $role = Escape-SqlLiteral $staff.role
    $employeeId = Escape-SqlLiteral $staff.employee_id
    $isActive = if ($staff.is_active) { 1 } else { 0 }

    Invoke-Sqlite -DbPath $db.staff -Sql @"
INSERT INTO app_staff (name, email, role, employee_id, is_active, created_at)
SELECT $name, $email, $role, $employeeId, $isActive, datetime('now')
WHERE NOT EXISTS (
    SELECT 1 FROM app_staff WHERE employee_id = $employeeId
);
"@ | Out-Null
}

Write-Host "Seeding managers ..." -ForegroundColor Cyan
foreach ($manager in $managers) {
    $name = Escape-SqlLiteral $manager.name
    $email = Escape-SqlLiteral $manager.email
    $department = Escape-SqlLiteral $manager.department
    $employeeId = Escape-SqlLiteral $manager.employee_id
    $isActive = if ($manager.is_active) { 1 } else { 0 }

    Invoke-Sqlite -DbPath $db.managers -Sql @"
INSERT INTO app_manager (name, email, department, employee_id, is_active, created_at)
SELECT $name, $email, $department, $employeeId, $isActive, datetime('now')
WHERE NOT EXISTS (
    SELECT 1 FROM app_manager WHERE employee_id = $employeeId
);
"@ | Out-Null
}

$reviews = @(
    @{
        customer_id = [int]$customerIndex["nguyenvanan@example.com"]
        book_id = [int]$bookIndex["Python Crash Course"]
        rating = 5
        comment = "Sách nhập môn rất dễ theo dõi và thực hành."
    },
    @{
        customer_id = [int]$customerIndex["nguyenvanan@example.com"]
        book_id = [int]$bookIndex["Clean Code"]
        rating = 5
        comment = "Nội dung thực tế, hữu ích khi review code."
    },
    @{
        customer_id = [int]$customerIndex["tranminhchau@example.com"]
        book_id = [int]$bookIndex["Fluent Python"]
        rating = 4
        comment = "Phù hợp khi đã có nền tảng Python."
    },
    @{
        customer_id = [int]$customerIndex["lehoangduc@example.com"]
        book_id = [int]$bookIndex["The Pragmatic Programmer"]
        rating = 5
        comment = "Rất đáng đọc cho mọi lập trình viên."
    }
)

Write-Host "Seeding reviews ..." -ForegroundColor Cyan
foreach ($review in $reviews) {
    $customerId = [int]$review.customer_id
    $bookId = [int]$review.book_id
    $rating = [int]$review.rating
    $comment = Escape-SqlLiteral $review.comment

    Invoke-Sqlite -DbPath $db.reviews -Sql @"
INSERT INTO app_review (customer_id, book_id, rating, comment, created_at, updated_at)
SELECT $customerId, $bookId, $rating, $comment, datetime('now'), datetime('now')
WHERE NOT EXISTS (
    SELECT 1 FROM app_review WHERE customer_id = $customerId AND book_id = $bookId
);
"@ | Out-Null
}

$orders = @(
    @{
        customer_id = [int]$customerIndex["nguyenvanan@example.com"]
        shipping_address = "123 Nguyen Hue, Quan 1, TP.HCM"
        payment_method = "credit_card"
        items = @(
            @{ title = "Python Crash Course"; quantity = 1; unit_price = "320000" },
            @{ title = "Clean Code"; quantity = 1; unit_price = "410000" }
        )
    },
    @{
        customer_id = [int]$customerIndex["tranminhchau@example.com"]
        shipping_address = "45 Le Loi, Hai Chau, Da Nang"
        payment_method = "e_wallet"
        items = @(
            @{ title = "Fluent Python"; quantity = 1; unit_price = "495000" }
        )
    }
)

Write-Host "Seeding orders, payments and shipments ..." -ForegroundColor Cyan
foreach ($order in $orders) {
    $customerId = [int]$order.customer_id
    $address = Escape-SqlLiteral $order.shipping_address
    $paymentMethod = Escape-SqlLiteral $order.payment_method
    $totalAmount = 0.0

    foreach ($item in $order.items) {
        $totalAmount += ([double]$item.unit_price * [int]$item.quantity)
    }

    $totalAmountStr = $totalAmount.ToString("0.00", [System.Globalization.CultureInfo]::InvariantCulture)

    Invoke-Sqlite -DbPath $db.orders -Sql @"
INSERT INTO app_order (customer_id, status, total_amount, shipping_address, created_at, updated_at)
SELECT $customerId, 'pending', $totalAmountStr, $address, datetime('now'), datetime('now')
WHERE NOT EXISTS (
    SELECT 1 FROM app_order WHERE customer_id = $customerId AND shipping_address = $address
);
"@ | Out-Null

    $orderId = Invoke-SqliteScalar -DbPath $db.orders -Sql "SELECT id FROM app_order WHERE customer_id = $customerId AND shipping_address = $address ORDER BY id DESC LIMIT 1;"
    if (-not $orderId) {
        throw "Cannot resolve id for seeded order of customer_id=$customerId"
    }

    foreach ($item in $order.items) {
        $bookTitle = $item.title
        if (-not $bookIndex.ContainsKey($bookTitle)) {
            throw "Book '$bookTitle' was not found in seeded book index."
        }

        $bookId = [int]$bookIndex[$bookTitle]
        $quantity = [int]$item.quantity
        $unitPrice = ([double]$item.unit_price).ToString("0.00", [System.Globalization.CultureInfo]::InvariantCulture)

        Invoke-Sqlite -DbPath $db.orders -Sql @"
INSERT INTO app_orderitem (book_id, quantity, unit_price, order_id)
SELECT $bookId, $quantity, $unitPrice, $orderId
WHERE NOT EXISTS (
    SELECT 1 FROM app_orderitem
    WHERE order_id = $orderId AND book_id = $bookId AND quantity = $quantity AND unit_price = $unitPrice
);
"@ | Out-Null
    }

    Invoke-Sqlite -DbPath $db.payments -Sql @"
INSERT INTO app_payment (order_id, customer_id, amount, method, status, created_at, updated_at)
SELECT $orderId, $customerId, $totalAmountStr, $paymentMethod, 'pending', datetime('now'), datetime('now')
WHERE NOT EXISTS (
    SELECT 1 FROM app_payment WHERE order_id = $orderId
);
"@ | Out-Null

    $trackingNumber = Escape-SqlLiteral ("TRK-{0}" -f $orderId)
    Invoke-Sqlite -DbPath $db.shipments -Sql @"
INSERT INTO app_shipment (order_id, customer_id, address, tracking_number, status, created_at, updated_at)
SELECT $orderId, $customerId, $address, $trackingNumber, 'pending', datetime('now'), datetime('now')
WHERE NOT EXISTS (
    SELECT 1 FROM app_shipment WHERE order_id = $orderId
);
"@ | Out-Null
}

$summary = [ordered]@{
    books = [int](Invoke-SqliteScalar -DbPath $db.books -Sql "SELECT COUNT(1) FROM app_book;")
    customers = [int](Invoke-SqliteScalar -DbPath $db.customers -Sql "SELECT COUNT(1) FROM app_customer;")
    carts = [int](Invoke-SqliteScalar -DbPath $db.carts -Sql "SELECT COUNT(1) FROM app_cart;")
    staff = [int](Invoke-SqliteScalar -DbPath $db.staff -Sql "SELECT COUNT(1) FROM app_staff;")
    managers = [int](Invoke-SqliteScalar -DbPath $db.managers -Sql "SELECT COUNT(1) FROM app_manager;")
    categories = [int](Invoke-SqliteScalar -DbPath $db.categories -Sql "SELECT COUNT(1) FROM app_category;")
    orders = [int](Invoke-SqliteScalar -DbPath $db.orders -Sql "SELECT COUNT(1) FROM app_order;")
    order_items = [int](Invoke-SqliteScalar -DbPath $db.orders -Sql "SELECT COUNT(1) FROM app_orderitem;")
    payments = [int](Invoke-SqliteScalar -DbPath $db.payments -Sql "SELECT COUNT(1) FROM app_payment;")
    shipments = [int](Invoke-SqliteScalar -DbPath $db.shipments -Sql "SELECT COUNT(1) FROM app_shipment;")
    reviews = [int](Invoke-SqliteScalar -DbPath $db.reviews -Sql "SELECT COUNT(1) FROM app_review;")
}

Write-Host "Seed complete (direct SQLite)." -ForegroundColor Green
$summary.GetEnumerator() | ForEach-Object {
    Write-Host ("{0}: {1}" -f $_.Key, $_.Value)
}