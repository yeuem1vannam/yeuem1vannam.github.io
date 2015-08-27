---
layout: post
title: "Sử dụng linh hoạt getter/setter với nested_attributes"
description: Cùng tìm hiểu về Nested Attributes của Rails và vận dụng linh hoạt nó
tagline: "Ruby on Rails"
category: posts
tags: [ruby on rails, nested attributes]
important: true
image:
  feature: nested-attributes.png
  credit: yeuem1vannam
  creditlink: http://yeuem1vannam.github.io
---

* TOC
{:toc}

`nested_attributes` là 1 tính năng rất mạnh của Rails, được bắt đầu build từ 31/01/2009, cho tới nay, nó đã trở nên khá hoàn hảo với Rails.

Tuy nhiên, không phải lúc nào sử dụng `nested_attributes` cũng dễ dàng và đúng với mong muốn của người coder, nhất là khi người coder muốn sử dụng `nested_attributes` với 1 hệ thống đầu vào không hoàn toàn đúng theo chuẩn của `nested_attributes`

<!-- more -->

Bài toán khó đặt ra là việc sửa lại `nested_attributes` mặc định của Rails để phù hợp với mục đích sử dụng của chúng ta, thì việc vận hành, bảo trì và nâng cấp phiên bản cho hệ thống sẽ trở nên nhiều rủi ro hơn, và phức tạp hơn.

Bài viết dưới đây là 1 cách sử dụng những thứ cơ bản có sẵn của Rails để hỗ trợ `nested_attributes` trong 1 trường hợp đặc biệt nhưng rất hay xảy ra trong các dự án Rails: Sử dụng getter/setter một cách mềm dẻo để giải quyết vấn đề đầu vào của `nested_attributes` không theo chuẩn `Parent-Child`.
## Rails Setter/Getter

Một setter của Rails được viết dạng

```ruby
  def xfunction= xvalue
    @xvalue = xvalue
  end
```
và một getter có dạng

```ruby
  def xvalue
    @xvalue
  end
```
Rails sử dụng cặp setter/getter default là `write_attribute` và `read_attribute` kiểu

```ruby
  write_attribute :xattr, xvalue
  # attr= value
  read_attribute :xattr
  # return xattr
```

Cặp setter/getter này được sử dụng trong `attr_accessible`(Rails3) và `attr_accessor`. Tuy nhiên cặp setter/getter này lưu giá trị theo kiểu `Hash`, rất khó cho chúng ta sử dụng

```ruby
  write_attribute :xattr, xvalue
```
thực chất là

```ruby
  self[:xattr] = xvalue
```
và

```ruby
  read_attribute :xattr
```
bản chất là

```ruby
  return self[:xattr]
```
Chính vì thế, đối với `attr_accessor`, Rails sử dụng cặp setter/getter của Ruby, đúng theo `OOP` để chúng ta dễ sử dụng hơn là `attr_writer` và `attr_reader`

Có thể hiểu `attr_writer :xattr` là

```ruby
  def xattr= xvalue
    @xattr = xvalue
  end
```
và `attr_reader :xattr` là

```ruby
  def xattr
    return @xattr
  end
```
Như vậy là có sự khác nhau giữa các cặp setter/getter này. Việc sử dụng chúng hợp lý sẽ giúp chúng ta rất nhiều trong việc custom lại một số feature của Rails mà không phá vỡ kiến trúc của nó.

## nested_attributes

`nested_attributes` là 1 feature mạnh của Rails, nó

>1.  Nhanh
>2.  Mạnh trong việc quản lý đồng bộ objects (set of objects)

nhưng nó

>1.  Khó trong việc quản lý giá trị nhập vào
>2.  Khó trong hình dung phương thức giới hạn, call_backs, validates cho các trường

Vì thế, thay vì phải sử dụng 1 loạt `call_backs` cho `nested_attributes` nằm ở cả 2 phần Cha và Con của bộ objects, chúng ta có thể rewrite lại setter/getter cho `nested_attributes` để thực hiện công việc của mình. Thông thường, ta chỉ nên rewrite lại setter của nó.

```ruby
class XXX < ActiveRecord::Base
  attr_accessible :xattr
  has_many :xattrs
  accepts_nested_attributes_for :xattrs

  def xattrs_attributes= args
    # Do some addition logic here
    # Raise errors, rescue if needed, then call
    # assign_nested_attributes_for_collection_association
    # or
    # assign_nested_attributes_for_one_on_one_association
    # depend on your association type is has_many or has_one
    assign_nested_attributes_for_collection_association :xattrs, args
  end
end
```
Với cách viết này, ta có thể chuyển toàn bộ các call_backs vào block logic bên trong setter của `nested_attributes`. Như vậy sẽ chỉ phải viết 1 block logic, xử lý 1 lần cho toàn bộ association.

## Sử dụng linh hoạt `nested_attributes`

Qua phần 1 và 2, ta có thể hiểu sơ qua được cặp setter/getter và `nested_attributes`. Vậy sử dụng mềm dẻo setter/getter trong `nested_attributes` để làm gì?
>1. Khi project yêu cầu mức độ bảo mật cao hơn, bạn phải đưa việc load/init objects vào trong model ( không load/init objects trong controller giống như Rails document)
>2. Khi bạn phải làm việc với bộ objects không thật sự theo chuẩn `Parent-Child` mà `nested_attributes` yêu cầu, khi đó vấn đề xuất hiện
>  - `nested_attributes` không hoạt động khi `Parent Object` chưa được save
>  - Rất khó để quản lý các association, vì phải làm việc với 3 hoặc hơn các Class liên quan
>  - Rất khó và rất yếu về bảo mật khi bạn chỉ muốn làm việc với 1 lượng hữu hạn được chỉ định các objects

Vì thế, việc rewrite setter của `nested_attributes` là 1 phương thức khả quan hơn cho vấn đề này.

Ex: 1 mối quan hệ được mô tả theo diagram dưới đây

![nested_attributes domain model](/images/nested-attributes.png)

```ruby
  class Team < ActiveRecord::Base
    has_many :members
    has_many :time_tables
  end
```

```ruby
  class Member < ActiveRecord::Base
    belongs_to :team
    has_many :schedules
  end
```

```ruby
  class TimeTable < ActiveRecord::Base
    attr_accessible :schedules
    belongs_to :team
    has_many :schedules
    has_many :members, through: :team
    accepts_nested_attributes_for :schedules
  end
```

```ruby
  class Schedule < ActiveRecord::Base
    belongs_to :time_table
    belongs_to :member
  end
```

với yêu cầu
>  - Một `Member` chỉ có 1 `Schedule` trong 1 `TimeTable`
>  - Có thể tạo mới được `Schedule` ngay cả khi `TimeTable` của nó chưa có
>  - Có thể update/create `Schedule` cho 1 lượng chỉ định các `Member`

Vấn đề trở nên phức tạp khi có mối quan hệ `has_many :members, through: :team` và phải đảm bảo yêu cầu của dự án. Ta có thể đảm bảo security bằng việc validate cho `scope(:member_id, :schedule_id)` trong `TimeTable`, nhưng không đảm bảo được yêu cầu 2. Như thế, 1 loạt `call_backs` và `validates` được tạo ra ở 3 class `Member`, `TimeTable`, `Schedule` và rất khó để kiểm soát tất cả.

Rewrite setter cho `schedules_attributes` là phương án khả quan hơn.

## Custom `nested_attributes`
Có thể mô tả quá trình viết lại `nested_attributes` cho bài toán trên như sau
1. ### `Middle Object`:  object phá vỡ mối quan hệ Parent-child  
> - Viết lại `nested_attributes`
> - Sử dụng một `attr_accessor` làm cầu nối
> - Trong setter của `nested_attributes`, ta lấy ra object cha hoặc tạo mới nó, raise error hoặc bỏ qua cả bộ giá trị nếu quá trình này gặp lỗi

2. `Child Object`: đối tượng chính của `nested_attributes`
> - Sử dụng 1 `attr_writer` đóng vai trò setter cho 1 trường có giá trị tương đương với `Parent Object` -> có khả năng tìm được `Parent Object` thông qua trường này
> - Sử dụng 1 `instance method` như 1 getter cho setter ở trên

3. `Parent Object`:
> - Sử dụng `instance method` làm getter
> - Gọi `Middle Object` thông qua `attr_accessor` của nó nếu cần

Để dễ hiểu hơn về mô hình này, các bạn có thể tham khảo code của bài toán trên tại  
[https://github.com/yeuem1vannam/](https://github.com/yeuem1vannam/nested_attributes)  
Như vậy, những thao tác cần thiết cho việc rewrite lại `nested_attributes` ở trên là  

```ruby
class Member < ActiveRecord::Base
  belongs_to :team
  has_many :schedules
  attr_accessor :schedule_in_table

  def schedules_attributes= attributes
    # Logic block xử lý việc load/create Parent Object
    # Raise errors hoặc next nếu có lỗi khi khởi tạo Parent Object
    assign_nested_attributes_for_collection_association(:schedules, attributes)
  end
end
```
```ruby
class chedule < ActiveRecord::Base
  belongs_to :time_table
  belongs_to :member
  attr_writer :date

  def date
    # Xử lý việc load giá trị trường date của Parent Object
    # @date được tạo ra tự động bởi attr_writer
  end
end
```

```ruby
class TimeTable < ActiveRecord::Base
  attr_accessible :schedules
  belongs_to :team
  has_many :schedules
  has_many :members, through: :team
  accepts_nested_attributes_for :schedules

  def getter_method
    # Load giá trị của attr_accessor của Middle Object
  end
end
```
Với quá trình rewrite này, sẽ chỉ cần 1 block logic để xử lý toàn bộ mối quan hệ phức tạp này, đồng thời `nested_attributes` vẫn có thể làm việc bình thường được.

## Conclusion

Việc rewrite `nested_attributes` chỉ nên dùng khi bài toán phức tạp và khó kiểm soát bởi nhiều `call_backs`. Ta có thể tóm lược các ưu nhược điểm của phương pháp này như sau

* Cons:
  > 1. Phải thao tác đồng bộ 3 class
  > 1. Khó trong việc hình dung logic và luồng dữ liệu

* Pros:
  > 1. Chỉ sử dụng 1 block logic để kiểm soát toàn bộ quan hệ, không cần phải viết thêm các `call_backs` để xử lý riêng cho `nested_attributes`
  > 1. Mạnh trong việc kiểm soát việc sai sót dữ liệu
  > 1. Nhanh, không cần thêm `call_backs`, khi `Parent Object` có lỗi, quá trình lập tức được hủy, chưa cần xử lý gì ở `Child Object`
  > 1. Không phá vỡ kiến trúc mặc định của Rails, chỉ sử dụng những thứ có sẵn trong Rails

- - -
## References

Tài liệu SlideShare của bài viết

### [SlideShare – Dynamically using setter/getter in Rails – PhuongLH](http://www.slideshare.net/Framgia/dynamical-using-gettersetter-on-rails-25333330)


1. [http://api.rubyonrails.org/](http://api.rubyonrails.org/classes/ActiveRecord/Base.html)
2. [http://apidock.com/](http://apidock.com/ruby/Module/attr_writer)
3. [http://stackoverflow.com/](http://stackoverflow.com/questions/15281215/ruby-rails-understanding-ruby-getter-setter-methods-and-instances)
4. [http://doblock.com/](http://doblock.com/articles/how-to-modify-default-setters-and-getters-in-rails-models)
5. [http://www.cowboycoded.com/](http://www.cowboycoded.com/2010/04/20/overriding-rails-activerecord-object-fields)
6. lib/active_record/nested_attributes.rb:333
