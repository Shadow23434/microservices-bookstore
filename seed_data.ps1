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

$bookHasImageUrlColumn = [bool](Invoke-SqliteScalar -DbPath $db.books -Sql "SELECT 1 FROM pragma_table_info('app_book') WHERE name = 'image' LIMIT 1;")

$categories = @(
    @{ name = "Fiction"; description = "" },
    @{ name = "Self-Help"; description = "" },
    @{ name = "Sci-Fi"; description = "" },
    @{ name = "Mystery"; description = "" },
    @{ name = "Non-Fiction"; description = "" },
    @{ name = "Biography"; description = "" }
)

$books = @(
    @{
        title = "The Midnight Library"
        author = "Matt Haig"
        price = "24.99"
        stock = 15
        image = "https://picsum.photos/seed/book1/300/450"
        category = "Fiction"
        format = "Hardcover"
        pages = 304
        language = "English"
        publisher = "Viking"
        publicationDate = "Sept 29, 2020"
        isbn = "978-0525559474"
        description = ""
    },
    @{
        title = "Atomic Habits"
        author = "James Clear"
        price = "19.99"
        stock = 42
        image = "https://picsum.photos/seed/book2/300/450"
        category = "Self-Help"
        format = "Paperback"
        pages = 320
        language = "English"
        publisher = "Avery"
        publicationDate = "Oct 16, 2018"
        isbn = "978-0735211292"
        description = ""
    },
    @{
        title = "Project Hail Mary"
        author = "Andy Weir"
        price = "22.50"
        stock = 8
        image = "https://picsum.photos/seed/book3/300/450"
        category = "Sci-Fi"
        format = "Hardcover"
        pages = 496
        language = "English"
        publisher = "Ballantine Books"
        publicationDate = "May 4, 2021"
        isbn = "978-0593135204"
        description = ""
    },
    @{
        title = "Dune"
        author = "Frank Herbert"
        price = "21.00"
        stock = 25
        image = "https://picsum.photos/seed/book4/300/450"
        category = "Sci-Fi"
        format = "Paperback"
        pages = 896
        language = "English"
        publisher = "Ace Books"
        publicationDate = "Oct 1, 1990"
        isbn = "978-0441172719"
        description = ""
    },
    @{
        title = "The Silent Patient"
        author = "Alex Michaelides"
        price = "18.50"
        stock = 12
        image = "https://picsum.photos/seed/book5/300/450"
        category = "Mystery"
        format = "Paperback"
        pages = 336
        language = "English"
        publisher = "Celadon Books"
        publicationDate = "Feb 5, 2019"
        isbn = "978-1250301697"
        description = ""
    },
    @{
        title = "Sapiens: A Brief History of Humankind"
        author = "Yuval Noah Harari"
        price = "25.00"
        stock = 30
        image = "https://picsum.photos/seed/book6/300/450"
        category = "Non-Fiction"
        format = "Paperback"
        pages = 464
        language = "English"
        publisher = "Harper"
        publicationDate = "Feb 10, 2015"
        isbn = "978-0062316097"
        description = ""
    },
    @{
        title = "Thinking, Fast and Slow"
        author = "Daniel Kahneman"
        price = "20.00"
        stock = 18
        image = "https://picsum.photos/seed/book7/300/450"
        category = "Non-Fiction"
        format = "Paperback"
        pages = 499
        language = "English"
        publisher = "Farrar, Straus and Giroux"
        publicationDate = "Apr 2, 2013"
        isbn = "978-0374533557"
        description = ""
    },
    @{
        title = "1984"
        author = "George Orwell"
        price = "15.99"
        stock = 50
        image = "https://picsum.photos/seed/book8/300/450"
        category = "Fiction"
        format = "Paperback"
        pages = 328
        language = "English"
        publisher = "Signet Classic"
        publicationDate = "Jan 1, 1950"
        isbn = "978-0451524935"
        description = ""
    },
    @{
        title = "The Alchemist"
        author = "Paulo Coelho"
        price = "16.99"
        stock = 35
        image = "https://picsum.photos/seed/book9/300/450"
        category = "Fiction"
        format = "Paperback"
        pages = 208
        language = "English"
        publisher = "HarperOne"
        publicationDate = "Apr 15, 2014"
        isbn = "978-0062315007"
        description = ""
    },
    @{
        title = "Becoming"
        author = "Michelle Obama"
        price = "22.00"
        stock = 22
        image = "https://picsum.photos/seed/book10/300/450"
        category = "Biography"
        format = "Hardcover"
        pages = 448
        language = "English"
        publisher = "Crown"
        publicationDate = "Nov 13, 2018"
        isbn = "978-1524763138"
        description = ""
    },
    @{
        title = "The Psychology of Money"
        author = "Morgan Housel"
        price = "18.99"
        stock = 40
        image = "https://picsum.photos/seed/book11/300/450"
        category = "Self-Help"
        format = "Paperback"
        pages = 252
        language = "English"
        publisher = "Harriman House"
        publicationDate = "Sep 8, 2020"
        isbn = "978-0857197689"
        description = ""
    },
    @{
        title = "Educated"
        author = "Tara Westover"
        price = "17.99"
        stock = 14
        image = "https://picsum.photos/seed/book12/300/450"
        category = "Biography"
        format = "Paperback"
        pages = 352
        language = "English"
        publisher = "Random House"
        publicationDate = "Feb 20, 2018"
        isbn = "978-0399590504"
        description = ""
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
    $image = Escape-SqlLiteral $book.image
    $category = Escape-SqlLiteral $book.category
    $format = Escape-SqlLiteral $book.format
    $pages = [int]$book.pages
    $language = Escape-SqlLiteral $book.language
    $publisher = Escape-SqlLiteral $book.publisher
    $publicationDate = Escape-SqlLiteral $book.publicationDate
    $isbn = Escape-SqlLiteral $book.isbn
    $description = Escape-SqlLiteral $book.description

    if ($bookHasImageUrlColumn) {
        Invoke-Sqlite -DbPath $db.books -Sql @"
INSERT INTO app_book (title, author, price, stock, image, category, format, pages, language, publisher, publicationDate, isbn, description)
SELECT $title, $author, $price, $stock, $image, $category, $format, $pages, $language, $publisher, $publicationDate, $isbn, $description
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
        book_id = [int]$bookIndex["The Midnight Library"]
        rating = 5
        comment = "SÃ¡ch nháº­p mÃ´n ráº¥t dá»… theo dÃµi vÃ  thá»±c hÃ nh."
    },
    @{
        customer_id = [int]$customerIndex["nguyenvanan@example.com"]
        book_id = [int]$bookIndex["Atomic Habits"]
        rating = 5
        comment = "Ná»™i dung thá»±c táº¿, há»¯u Ã­ch khi review code."
    },
    @{
        customer_id = [int]$customerIndex["tranminhchau@example.com"]
        book_id = [int]$bookIndex["Project Hail Mary"]
        rating = 4
        comment = "PhÃ¹ há»£p khi Ä'Ã£ cÃ³ ná»n táº£ng Python."
    },
    @{
        customer_id = [int]$customerIndex["lehoangduc@example.com"]
        book_id = [int]$bookIndex["Dune"]
        rating = 5
        comment = "Ráº¥t Ä'Ã¡ng Ä'á»c cho má»i láº­p trÃ¬nh viÃªn."
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
            @{ title = "The Midnight Library"; quantity = 1; unit_price = "24.99" },
            @{ title = "Atomic Habits"; quantity = 1; unit_price = "19.99" }
        )
    },
    @{
        customer_id = [int]$customerIndex["tranminhchau@example.com"]
        shipping_address = "45 Le Loi, Hai Chau, Da Nang"
        payment_method = "paypal"
        items = @(
            @{ title = "Project Hail Mary"; quantity = 1; unit_price = "22.50" }
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


