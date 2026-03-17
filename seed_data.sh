#!/usr/bin/env bash
set -euo pipefail

WORKSPACE_ROOT="${1:-$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)}"

escape_sql_literal() {
  local value="${1:-}"
  value=${value//\'/\'\'}
  printf "'%s'" "$value"
}

invoke_sqlite() {
  local db_path="$1"
  local sql="$2"
  sqlite3 "$db_path" "$sql"
}

invoke_sqlite_scalar() {
  local db_path="$1"
  local sql="$2"
  sqlite3 "$db_path" "$sql" | head -n 1 | tr -d '\r'
}

ensure_db_file() {
  local db_path="$1"
  if [[ ! -f "$db_path" ]]; then
    echo "[ERROR] Database file not found: $db_path" >&2
    exit 1
  fi
}

if ! command -v sqlite3 >/dev/null 2>&1; then
  echo "[ERROR] sqlite3 command not found in PATH." >&2
  exit 1
fi

declare -A db
db[books]="$WORKSPACE_ROOT/book-service/book_service/db.sqlite3"
db[categories]="$WORKSPACE_ROOT/catalog-service/catalog_service/db.sqlite3"
db[customers]="$WORKSPACE_ROOT/customer-service/customer_service/db.sqlite3"
db[carts]="$WORKSPACE_ROOT/cart-service/cart_service/db.sqlite3"
db[staff]="$WORKSPACE_ROOT/staff-service/staff_service/db.sqlite3"
db[managers]="$WORKSPACE_ROOT/manager-service/manager_service/db.sqlite3"
db[reviews]="$WORKSPACE_ROOT/comment-rate-service/comment_rate_service/db.sqlite3"
db[orders]="$WORKSPACE_ROOT/order-service/order_service/db.sqlite3"
db[payments]="$WORKSPACE_ROOT/pay-service/pay_service/db.sqlite3"
db[shipments]="$WORKSPACE_ROOT/ship-service/ship_service/db.sqlite3"

for key in "${!db[@]}"; do
  ensure_db_file "${db[$key]}"
done

book_has_image_url_column="$(invoke_sqlite_scalar "${db[books]}" "SELECT 1 FROM pragma_table_info('app_book') WHERE name = 'imageUrl' LIMIT 1;")"

echo "Seeding categories ..."
invoke_sqlite "${db[categories]}" "INSERT INTO app_category (name, description, created_at, parent_id) SELECT 'Programming', 'Sách lập trình và thực hành phát triển phần mềm', datetime('now'), NULL WHERE NOT EXISTS (SELECT 1 FROM app_category WHERE name = 'Programming');"
invoke_sqlite "${db[categories]}" "INSERT INTO app_category (name, description, created_at, parent_id) SELECT 'Python', 'Sách về Python cho người mới và nâng cao', datetime('now'), NULL WHERE NOT EXISTS (SELECT 1 FROM app_category WHERE name = 'Python');"
invoke_sqlite "${db[categories]}" "INSERT INTO app_category (name, description, created_at, parent_id) SELECT 'Software Architecture', 'Thiết kế hệ thống và kiến trúc phần mềm', datetime('now'), NULL WHERE NOT EXISTS (SELECT 1 FROM app_category WHERE name = 'Software Architecture');"
invoke_sqlite "${db[categories]}" "INSERT INTO app_category (name, description, created_at, parent_id) SELECT 'Data Engineering', 'Dữ liệu, hạ tầng và hệ thống phân tán', datetime('now'), NULL WHERE NOT EXISTS (SELECT 1 FROM app_category WHERE name = 'Data Engineering');"

echo "Seeding books ..."
seed_book() {
  local title="$1" author="$2" price="$3" stock="$4" image_url="$5"
  local t a i
  t=$(escape_sql_literal "$title")
  a=$(escape_sql_literal "$author")
  i=$(escape_sql_literal "$image_url")

  if [[ "$book_has_image_url_column" == "1" ]]; then
    invoke_sqlite "${db[books]}" "INSERT INTO app_book (title, author, price, stock, imageUrl) SELECT $t, $a, $price, $stock, $i WHERE NOT EXISTS (SELECT 1 FROM app_book WHERE title = $t AND author = $a);"
  else
    invoke_sqlite "${db[books]}" "INSERT INTO app_book (title, author, price, stock) SELECT $t, $a, $price, $stock WHERE NOT EXISTS (SELECT 1 FROM app_book WHERE title = $t AND author = $a);"
  fi
}

seed_book "Django REST Framework" "Tom Christie" "380000" "10" "https://tse2.mm.bing.net/th/id/OIP.ltQXmHg61bcfaX86yY_bAwAAAA?pid=ImgDet&w=191&h=235&c=7&o=7&rm=3"
seed_book "Microservices Patterns" "Chris Richardson" "520000" "8" "https://th.bing.com/th/id/OIP.1C4yVyGkcWqJdnLSR_cLIAHaLH?w=115&h=180&c=7&r=0&o=7&pid=1.7&rm=3"
seed_book "Python Crash Course" "Eric Matthes" "320000" "15" "https://covers.openlibrary.org/b/isbn/9781593279288-L.jpg"
seed_book "Fluent Python" "Luciano Ramalho" "495000" "9" "https://covers.openlibrary.org/b/isbn/9781492056355-L.jpg"
seed_book "Clean Code" "Robert C. Martin" "410000" "12" "https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg"
seed_book "The Pragmatic Programmer" "Andrew Hunt" "450000" "7" "https://covers.openlibrary.org/b/isbn/9780135957059-L.jpg"
seed_book "Designing Data-Intensive Applications" "Martin Kleppmann" "560000" "6" "https://covers.openlibrary.org/b/isbn/9781449373320-L.jpg"

book_python_crash_course="$(invoke_sqlite_scalar "${db[books]}" "SELECT id FROM app_book WHERE title='Python Crash Course' AND author='Eric Matthes' LIMIT 1;")"
book_clean_code="$(invoke_sqlite_scalar "${db[books]}" "SELECT id FROM app_book WHERE title='Clean Code' AND author='Robert C. Martin' LIMIT 1;")"
book_fluent_python="$(invoke_sqlite_scalar "${db[books]}" "SELECT id FROM app_book WHERE title='Fluent Python' AND author='Luciano Ramalho' LIMIT 1;")"
book_pragmatic="$(invoke_sqlite_scalar "${db[books]}" "SELECT id FROM app_book WHERE title='The Pragmatic Programmer' AND author='Andrew Hunt' LIMIT 1;")"

for v in "$book_python_crash_course" "$book_clean_code" "$book_fluent_python" "$book_pragmatic"; do
  if [[ -z "$v" ]]; then
    echo "[ERROR] Cannot resolve seeded book IDs." >&2
    exit 1
  fi
done

echo "Seeding customers ..."
invoke_sqlite "${db[customers]}" "INSERT INTO app_customer (name, email) SELECT 'Nguyen Van An', 'nguyenvanan@example.com' WHERE NOT EXISTS (SELECT 1 FROM app_customer WHERE email='nguyenvanan@example.com');"
invoke_sqlite "${db[customers]}" "INSERT INTO app_customer (name, email) SELECT 'Tran Minh Chau', 'tranminhchau@example.com' WHERE NOT EXISTS (SELECT 1 FROM app_customer WHERE email='tranminhchau@example.com');"
invoke_sqlite "${db[customers]}" "INSERT INTO app_customer (name, email) SELECT 'Le Hoang Duc', 'lehoangduc@example.com' WHERE NOT EXISTS (SELECT 1 FROM app_customer WHERE email='lehoangduc@example.com');"

customer_an="$(invoke_sqlite_scalar "${db[customers]}" "SELECT id FROM app_customer WHERE email='nguyenvanan@example.com' LIMIT 1;")"
customer_chau="$(invoke_sqlite_scalar "${db[customers]}" "SELECT id FROM app_customer WHERE email='tranminhchau@example.com' LIMIT 1;")"
customer_duc="$(invoke_sqlite_scalar "${db[customers]}" "SELECT id FROM app_customer WHERE email='lehoangduc@example.com' LIMIT 1;")"

for v in "$customer_an" "$customer_chau" "$customer_duc"; do
  if [[ -z "$v" ]]; then
    echo "[ERROR] Cannot resolve seeded customer IDs." >&2
    exit 1
  fi
done

echo "Seeding carts ..."
invoke_sqlite "${db[carts]}" "INSERT INTO app_cart (customer_id, created_at) SELECT $customer_an, datetime('now') WHERE NOT EXISTS (SELECT 1 FROM app_cart WHERE customer_id = $customer_an);"
invoke_sqlite "${db[carts]}" "INSERT INTO app_cart (customer_id, created_at) SELECT $customer_chau, datetime('now') WHERE NOT EXISTS (SELECT 1 FROM app_cart WHERE customer_id = $customer_chau);"
invoke_sqlite "${db[carts]}" "INSERT INTO app_cart (customer_id, created_at) SELECT $customer_duc, datetime('now') WHERE NOT EXISTS (SELECT 1 FROM app_cart WHERE customer_id = $customer_duc);"

echo "Seeding staff ..."
invoke_sqlite "${db[staff]}" "INSERT INTO app_staff (name, email, role, employee_id, is_active, created_at) SELECT 'Pham Thi Kho', 'warehouse.team@example.com', 'warehouse', 'STF001', 1, datetime('now') WHERE NOT EXISTS (SELECT 1 FROM app_staff WHERE employee_id='STF001');"
invoke_sqlite "${db[staff]}" "INSERT INTO app_staff (name, email, role, employee_id, is_active, created_at) SELECT 'Vu Bao Sales', 'sales.team@example.com', 'sales', 'STF002', 1, datetime('now') WHERE NOT EXISTS (SELECT 1 FROM app_staff WHERE employee_id='STF002');"
invoke_sqlite "${db[staff]}" "INSERT INTO app_staff (name, email, role, employee_id, is_active, created_at) SELECT 'Do Support', 'support.team@example.com', 'support', 'STF003', 1, datetime('now') WHERE NOT EXISTS (SELECT 1 FROM app_staff WHERE employee_id='STF003');"

echo "Seeding managers ..."
invoke_sqlite "${db[managers]}" "INSERT INTO app_manager (name, email, department, employee_id, is_active, created_at) SELECT 'Nguyen Operations', 'operations.manager@example.com', 'operations', 'MGR001', 1, datetime('now') WHERE NOT EXISTS (SELECT 1 FROM app_manager WHERE employee_id='MGR001');"
invoke_sqlite "${db[managers]}" "INSERT INTO app_manager (name, email, department, employee_id, is_active, created_at) SELECT 'Tran Inventory', 'inventory.manager@example.com', 'inventory', 'MGR002', 1, datetime('now') WHERE NOT EXISTS (SELECT 1 FROM app_manager WHERE employee_id='MGR002');"
invoke_sqlite "${db[managers]}" "INSERT INTO app_manager (name, email, department, employee_id, is_active, created_at) SELECT 'Le Finance', 'finance.manager@example.com', 'finance', 'MGR003', 1, datetime('now') WHERE NOT EXISTS (SELECT 1 FROM app_manager WHERE employee_id='MGR003');"

echo "Seeding reviews ..."
insert_review() {
  local customer_id="$1" book_id="$2" rating="$3" comment="$4"
  local c
  c=$(escape_sql_literal "$comment")
  invoke_sqlite "${db[reviews]}" "INSERT INTO app_review (customer_id, book_id, rating, comment, created_at, updated_at) SELECT $customer_id, $book_id, $rating, $c, datetime('now'), datetime('now') WHERE NOT EXISTS (SELECT 1 FROM app_review WHERE customer_id = $customer_id AND book_id = $book_id);"
}

insert_review "$customer_an" "$book_python_crash_course" 5 "Sách nhập môn rất dễ theo dõi và thực hành."
insert_review "$customer_an" "$book_clean_code" 5 "Nội dung thực tế, hữu ích khi review code."
insert_review "$customer_chau" "$book_fluent_python" 4 "Phù hợp khi đã có nền tảng Python."
insert_review "$customer_duc" "$book_pragmatic" 5 "Rất đáng đọc cho mọi lập trình viên."

echo "Seeding orders, payments and shipments ..."

address_1="123 Nguyen Hue, Quan 1, TP.HCM"
method_1="credit_card"
total_1="730000.00"
addr1_sql=$(escape_sql_literal "$address_1")
method1_sql=$(escape_sql_literal "$method_1")

invoke_sqlite "${db[orders]}" "INSERT INTO app_order (customer_id, status, total_amount, shipping_address, created_at, updated_at) SELECT $customer_an, 'pending', $total_1, $addr1_sql, datetime('now'), datetime('now') WHERE NOT EXISTS (SELECT 1 FROM app_order WHERE customer_id=$customer_an AND shipping_address=$addr1_sql);"
order_1="$(invoke_sqlite_scalar "${db[orders]}" "SELECT id FROM app_order WHERE customer_id=$customer_an AND shipping_address=$addr1_sql ORDER BY id DESC LIMIT 1;")"
invoke_sqlite "${db[orders]}" "INSERT INTO app_orderitem (book_id, quantity, unit_price, order_id) SELECT $book_python_crash_course, 1, 320000.00, $order_1 WHERE NOT EXISTS (SELECT 1 FROM app_orderitem WHERE order_id=$order_1 AND book_id=$book_python_crash_course AND quantity=1 AND unit_price=320000.00);"
invoke_sqlite "${db[orders]}" "INSERT INTO app_orderitem (book_id, quantity, unit_price, order_id) SELECT $book_clean_code, 1, 410000.00, $order_1 WHERE NOT EXISTS (SELECT 1 FROM app_orderitem WHERE order_id=$order_1 AND book_id=$book_clean_code AND quantity=1 AND unit_price=410000.00);"
invoke_sqlite "${db[payments]}" "INSERT INTO app_payment (order_id, customer_id, amount, method, status, created_at, updated_at) SELECT $order_1, $customer_an, $total_1, $method1_sql, 'pending', datetime('now'), datetime('now') WHERE NOT EXISTS (SELECT 1 FROM app_payment WHERE order_id=$order_1);"
invoke_sqlite "${db[shipments]}" "INSERT INTO app_shipment (order_id, customer_id, address, tracking_number, status, created_at, updated_at) SELECT $order_1, $customer_an, $addr1_sql, 'TRK-' || $order_1, 'pending', datetime('now'), datetime('now') WHERE NOT EXISTS (SELECT 1 FROM app_shipment WHERE order_id=$order_1);"

address_2="45 Le Loi, Hai Chau, Da Nang"
method_2="e_wallet"
total_2="495000.00"
addr2_sql=$(escape_sql_literal "$address_2")
method2_sql=$(escape_sql_literal "$method_2")

invoke_sqlite "${db[orders]}" "INSERT INTO app_order (customer_id, status, total_amount, shipping_address, created_at, updated_at) SELECT $customer_chau, 'pending', $total_2, $addr2_sql, datetime('now'), datetime('now') WHERE NOT EXISTS (SELECT 1 FROM app_order WHERE customer_id=$customer_chau AND shipping_address=$addr2_sql);"
order_2="$(invoke_sqlite_scalar "${db[orders]}" "SELECT id FROM app_order WHERE customer_id=$customer_chau AND shipping_address=$addr2_sql ORDER BY id DESC LIMIT 1;")"
invoke_sqlite "${db[orders]}" "INSERT INTO app_orderitem (book_id, quantity, unit_price, order_id) SELECT $book_fluent_python, 1, 495000.00, $order_2 WHERE NOT EXISTS (SELECT 1 FROM app_orderitem WHERE order_id=$order_2 AND book_id=$book_fluent_python AND quantity=1 AND unit_price=495000.00);"
invoke_sqlite "${db[payments]}" "INSERT INTO app_payment (order_id, customer_id, amount, method, status, created_at, updated_at) SELECT $order_2, $customer_chau, $total_2, $method2_sql, 'pending', datetime('now'), datetime('now') WHERE NOT EXISTS (SELECT 1 FROM app_payment WHERE order_id=$order_2);"
invoke_sqlite "${db[shipments]}" "INSERT INTO app_shipment (order_id, customer_id, address, tracking_number, status, created_at, updated_at) SELECT $order_2, $customer_chau, $addr2_sql, 'TRK-' || $order_2, 'pending', datetime('now'), datetime('now') WHERE NOT EXISTS (SELECT 1 FROM app_shipment WHERE order_id=$order_2);"

books_count="$(invoke_sqlite_scalar "${db[books]}" "SELECT COUNT(1) FROM app_book;")"
customers_count="$(invoke_sqlite_scalar "${db[customers]}" "SELECT COUNT(1) FROM app_customer;")"
carts_count="$(invoke_sqlite_scalar "${db[carts]}" "SELECT COUNT(1) FROM app_cart;")"
staff_count="$(invoke_sqlite_scalar "${db[staff]}" "SELECT COUNT(1) FROM app_staff;")"
managers_count="$(invoke_sqlite_scalar "${db[managers]}" "SELECT COUNT(1) FROM app_manager;")"
categories_count="$(invoke_sqlite_scalar "${db[categories]}" "SELECT COUNT(1) FROM app_category;")"
orders_count="$(invoke_sqlite_scalar "${db[orders]}" "SELECT COUNT(1) FROM app_order;")"
order_items_count="$(invoke_sqlite_scalar "${db[orders]}" "SELECT COUNT(1) FROM app_orderitem;")"
payments_count="$(invoke_sqlite_scalar "${db[payments]}" "SELECT COUNT(1) FROM app_payment;")"
shipments_count="$(invoke_sqlite_scalar "${db[shipments]}" "SELECT COUNT(1) FROM app_shipment;")"
reviews_count="$(invoke_sqlite_scalar "${db[reviews]}" "SELECT COUNT(1) FROM app_review;")"

echo "Seed complete (direct SQLite)."
echo "books: $books_count"
echo "customers: $customers_count"
echo "carts: $carts_count"
echo "staff: $staff_count"
echo "managers: $managers_count"
echo "categories: $categories_count"
echo "orders: $orders_count"
echo "order_items: $order_items_count"
echo "payments: $payments_count"
echo "shipments: $shipments_count"
echo "reviews: $reviews_count"
