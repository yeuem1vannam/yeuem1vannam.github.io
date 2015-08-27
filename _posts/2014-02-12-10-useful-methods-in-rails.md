---
layout: post
title: "10 methods hữu dụng trong ActiveRecord::Relation"
category: posts
tags: [ruby on rails, ruby on rails 4, activerecord]
image:
  feature: activerecord-relation.png
  credit: RUBY ON RAILS TUTORIAL (3RD ED.)
  creditlink: https://www.railstutorial.org/
---

Dưới đây là 10 methods hữu dụng nhất trong `ActiveRecord::Relation`

## 1. `merge`
Đây là 1 method rất hữu dụng khi sử dụng trong `ActiveRecord::Relation`. Bạn có thể vừa joins bảng vừa lọc với 1 scope nào đó trong models

```ruby
class Account < ActiveRecord::Base
  # ...
  # Returns all the accounts that have unread messages.
  def self.with_unread_messages
    joins(:messages).merge( Message.unread )
  end
end
```
<!-- more -->
## 2. `pluck`
Khi muốn đưa ra array giá trị 1 cột của các records, thông thường ta hay sử dụng

```ruby
 published_book_titles = Book.published.select(:title).map(&:title)
```
hay là

```ruby
published_book_titles = Book.published.map(&:title)
```
thì ta có thể dùng `pluck` để thay thế

```ruby
published_book_titles = Book.published.pluck(:title)
```

## 3. `scoping`
Bạn có thể viết lại 1 class method riêng cho 1 trường hợp nào đó giống như `scope` với models. Tham khảo ví dụ dưới đây được lấy từ tài liệu của Rails

```ruby
 Comment.where(post_id: 1).scoping do
  Comment.first # SELECT * FROM comments WHERE post_id = 1
end
```

## 4. `find_by`
Trong Rails 4, method `find_by_xxx` không còn được sử dụng nên bạn thường dùng

```ruby
Book.where(title: "Three Day Road", author: "Joseph Boyden").first
```
nhưng bạn có thể thay thế hoàn toàn bằng cách dùng `find_by`

```ruby
Book.find_by(title: "Three Day Road", author: "Joseph Boyden")
```
## 5. `to_sql` và `explain`
Trong khi sử dụng `ActiveRecord`, những methods của nó có thể không thực hiện những query giống như bạn nghĩ. Vì thế nên kiểm tra lại nó bằng `to_sql` và `explain` để có thể chắc chắn rằng query của bạn là 1 query tốt, hoặc chỉ đơn giản là cho bạn thấy sự khác biệt giữa cách bạn viết và thứ bạn nghĩ

```ruby
Library.joins(:book).to_sql
# => SQL query for you database.

Libray.joins(:book).explain
# => Database explain for the query.
```

## 6. `find_each`
Khi bạn muốn thực hiện 1 update cho hàng ngàn records, không nên sử dụng `each` bởi vì:

> - `ActiveRecord` sẽ thực hiện 1 query lấy ra toàn bộ records
> - Đưa toàn bộ số records vào memory
> - Thực hiện update cho toàn bộ số records cùng lúc

Nếu memory của bạn đủ lớn, thì điều này không những không vấn đề gì, mà còn tăng hiệu năng của hệ thống, nhưng ngược lại, nó sẽ là nguyên nhân chính khiến cho hệ thống của bạn bị chậm, hay thậm chí là ngưng hoạt động.
Với `find_each`, nó sẽ thực hiện update cho từng record một, và hệ thống sẽ không phải lưu trữ toàn bộ records trong cùng 1 khoảng thời gian

```ruby
Book.where(published: true).find_each do |book|
  puts "Do something with #{book.title} here!"
end
```
## 7. `none` (Rails4 only)
Khi `ActiveRecord` không trả về kết quả nào, điều này rất không tốt nếu như `API` của bạn mong muốn đầu vào là 1 `ActiveRecord::Relation`. Trong trường hợp này bạn có thể sự dụng `none`

```ruby
def filter(filter_name)
  case filter_name
  when :all
    scoped
  when :published
    where(published: true)
  when :unpublished
    where(published: false)
  else
    none
  end
end
```

## 8. `scoped`
Ngược lại với phần trên, khi bạn muốn `ActiveRecord::Relation` trả về toàn bộ records của class, có thể dùng `scoped`

```ruby
def search(query)
  if query.blank?
    scoped
  else
    q = "%#{query}%"
    where("title like ? or author like ?", q, q)
  end
end
```

## 9. `first_or_initialize`
Muốn lấy ra record nào đó, nếu nó không tồn tại thì tạo mới nó? Sử dụng `first_or_initialize`

```ruby
Book.where(title: "Tale of Two Cities").first_or_initialize
```
## 10. `first_or_create with` với block
Tương tự như `first_or_initialize` nhưng bạn muốn tạo mới 1 record và save luôn vào database thì có thể dùng `first_or_create`

```ruby
Book.where(title: "Tale of Two Cities").first_or_create
```


## Reference
[http://blog.mitchcrowe.com/](http://blog.mitchcrowe.com/blog/2012/04/14/10-most-underused-activerecord-relation-methods/)


