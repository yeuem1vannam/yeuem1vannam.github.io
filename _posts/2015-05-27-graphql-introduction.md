---
layout: post
title: GraphQL Introduction
description: Một cái nhìn sơ khai về GraphQL của Facebook
modified: 2015-08-26 16:09:49 +0700
tags: [graphql, facebook, react]
category: posts
# type: status
# headline: "AADWAD"
image:
  feature:
  credit:
  creditlink:
comments: true
share: true
---
*Được viết lại từ bài viết trên [Viblo](https://viblo.asia/yeuem1vannam/posts/3OEqGjJQG9bL) của chính tác giả*

Có một sự thật về sự khác biệt giữa lập trình viên **backend** với lập trình viên **frontend** đó là:
- Anh **backend** lúc nào cũng là cu-ly
- Anh **frontend** lại đóng vai trò là khách hàng, muốn dùng gì đều có thể đặt hàng anh **backend** trả ra cho đúng loại đó.

<!-- more -->

Anh **frontend** muốn dữ liệu kiểu gì thì cứ việc miêu tả, việc còn lại cứ để anh **backend** lo.
![frontend vs backend.jpeg](/images/graphql-front-end-vs-backend.jpeg)  
Làm thế nào để đỡ cho anh **backend**? Câu trả lời bây giờ là `RESTful`, anh **frontend** muốn gì thì cứ theo `REST` mà lấy, tuy nhiên anh **backend** vẫn phải thường xuyên nhúng tay vào.  
Vậy tương lai sẽ là gì? Tất nhiên là **tôi không thể trả lời vào thời điểm hiện tại**, nhưng có thể là ==GraphQL==[^1]  
## GraphQL là gì?
Được *Facebook* giới thiệu cùng với `Relay` tại [React.js Conf 2015](https://facebook.github.io/react/blog/2015/02/20/introducing-relay-and-graphql.html)[^4], `GraphQL` là một ngôn ngữ truy vấn được tạo ra với mục đích hướng tới những dạng dữ liệu phức tạp, nhiều lớp với nhiều thành phần phụ thuộc được sử dụng ngày càng phổ biến trong các application hiện đại. Trên thực tế `GraphQL` đã được sử dụng từ vài năm trước trong ứng dụng trên mobile của *Facebook*.  
`GraphQL` cho phép người lập trình **frontend** miêu tả dạng dữ liệu mong muốn một cách chủ động trong code, sau khi thực hiện query, `GraphQL` sẽ trả ra theo đúng dạng đã miêu tả.[^2]  
Như vậy ở đây, ít nhất câu hỏi "Làm thế nào để đỡ cho anh **backend**?" đã có thể trả lời một cách rõ ràng hơn so với `RESTful`
> Anh frontend muốn dữ liệu kiểu gì thì cứ việc miêu tả, việc còn lại cứ để ~~anh backend~~ GraphQL lo.
  
## GraphQL hoạt động như thế nào?
Cho tới thời điểm hiện tại, *Facebook* mới chỉ đang lên kế hoạch để mở mã nguồn cho một phiên bản tham khảo từ `GraphQL` nên chúng ta sẽ vẫn chưa thể biết được thực sự bên trong `GraphQL` hoạt động như thế nào. Tuy nhiên, ta có thể hình dung bề nổi của tảng băng, giúp `GraphQL` hoạt động gồm 2 phần chính[^3]:

- `Schema` Bản đồ chi tiết: mô tả của tất cả các trường, các mối quan hệ, các kiểu mà có thể sử dụng trong các truy vấn
- `Executor` Một tay hướng đạo sinh: nhận mô tả ( truy vấn ) và sử dụng các bản đồ (`schema`) ở trên để dẫn đường tới đích (tới các data node ) và thu gom dữ liệu luôn, tất nhiên rồi.

## Làm thế nào để vận hành GraphQL?
Để dễ hình dung, tôi sẽ lấy ví dụ bằng cấu trúc dữ liệu của `GithubAPI`. Đây không phải là một mô tả hoàn toàn chính xác, chỉ là 1 ví dụ  
Ở đây tôi chỉ dùng `DataMapper` để mô tả các mảnh bản đồ kèm theo các mối quan hệ một cách đơn giản.[^5]  
```ruby
class Author
    include DataMapper::Resource

    property :username,     String
    property :id,           Integer
    property :name,         String
    property :avatar_url,   String

    has n, :commits
    has n, :repositories, though: :commits
end

class Repository
    include DataMapper::Resource

    property :id,           Integer
    property :name,         String
    property :full_name,    String
    property :description,  String
    property :language,     String

    has n, :commits
    has n, :authors, through: :commits
end

class Commit
    include DataMapper::Resource

    property :sha,          String
    property :message,      String

    belongs_to :author
end
```

Như vậy, với vai trò là người làm **backend**, tôi đã xong việc của mình. Việc anh **frontend** muốn lấy cái gì, tôi không cần quan tâm nữa, anh ta nên tự yêu cầu.  
Với `GraphQL`, người làm **frontend** chỉ cần yêu cầu theo một format nào đó anh ta mong muốn, server sẽ gửi lại dữ liệu theo đúng dạng format đó.  

```ruby
# Request
{
    commit(sha: "c3b4dc2"){
        sha,
        message,
        author: {
            username,
            name,
            avatar_url
        }
    }
}

# Response
{
    sha: "c3b4dc2",
    message: "Query with GraphQL",
    author: {
        login: "yeuem1vannam",
        name: "Phuong 'J' Le H.",
        avatar_url: "https://avatars0.githubusercontent.com/u/2409560?v=3&s=40"
    }
}
```
Ở đây tôi không nhắc tới `Executor`, tuy nhiên các bạn có thể thấy sự hiện diện của nó một cách rõ ràng, khi mà anh **backend** chỉ dừng lại ở việc định nghĩa các mảnh bản đồ, nhưng anh **frontend** vẫn có thể nhận được dữ liệu theo ý muốn.  
Như vậy, để vận hành `GraphQL`, chỉ cần định nghĩa được `schema`, sau đó muốn lấy data gì, chỉ cần gửi request theo đúng dạng mong muốn.
## Vì sao phải là GraphQL mà không phải là các dạng SQL khác?
Bản thân `GraphQL` cũng có những mối liên kết (relationship), nên việc sử dụng các dạng SQL khác thế chỗ `GraphQL` là điểu hiển nhiên có thể. Tuy nhiên, khi các mối quan hệ trở nên phức tạp, ví dụ như mối quan hệ của các pixel với màu  trong bức ảnh, mối quan hệ của một mạng xã hội, mối quan hệ của các nguyên tử có trong phân tử của một chất nào đó, thì với các hệ SQL thông thường:

- Việc lưu trữ và biểu diễn trở nên không hiệu quả.
- Việc truy vấn trở nên lộn xộn, không dễ gì để giữ được format theo đúng chuẩn.
- Khi các mối quan hệ trở nên trừu tượng, việc giữ các mối quan hệ đúng sẽ cần rất nhiều điều kiện.

Chính những hình mẫu kể trên đã dẫn tới yêu cầu của một hệ cơ sở dữ liệu có khả năng quản trị theo phương pháp hình học. `GraphQL` là một trong số đó.[^6]  
![graph database](/images/graph-database.png) 
## Vì sao phải là GraphQL mà không phải RESTful?
`RESTful` thực sự rất tuyệt vời! Tôi có thể *khẳng định* như vậy.  
Nhưng khi sự phát triển của mobile apps và web one-page-application ngày càng trở nên mạnh mẽ, `RESTful` bộc lộ những điểm yếu của nó:

- Việc chia nhỏ theo `resource` khiến ta phải khởi tạo nhiều request cùng lúc để có thể lấy hết lượng data mong muốn hiển thị.
- Khi dữ liệu có nhiều lớp, việc truy vấn trong database trở nên khó khăn, việc xuất dữ liệu ra trở nên kém hiệu quả bởi khả năng lặp lại dữ liệu cao.
- Logic backend trở nên phức tạp và phình to nhanh chóng khi một API phục vụ cho nhiều application khác nhau.
- Việc phát triển riêng biệt các component trong hệ thống vẫn còn khó khăn, bởi bất cứ thay đổi nào của một component, đều dẫn tới có thể ảnh hưởng tới các component còn lại. Ví dụ của tôi về mối quan hệ giữa **backend** dev và **frontend** dev là một minh chứng đơn giản.

Trong khi đó, với `GraphQL`

- Tất cả data mong muốn có thể gộp chung vào **một** truy vấn, tới một `endpoint` duy nhất
- Với phương pháp duyệt cây, mỗi data node chỉ cần duyệt qua một lần duy nhất là đã có thể dùng cho mọi nơi trong data set, không phụ thuộc vào độ phức tạp của format dữ liệu.
- Việc thay đổi phạm vi truy cập tới một trường nào đó cũng trở nên đơn giản, khả năng ảnh hưởng tới các phần khác thấp
- Việc phát triển riêng biệt các component trở nên hiện thực hơn bao giờ hết.  

## Tương lai của GraphQL
Trên thực tế `GraphQL` được công bố bởi nó được dùng trong `Relay` - framework mới của *Facebook*, và ý tưởng của `GraphQL` không phải là một ý tưởng mới, thậm chí vẫn còn tồn đọng những vấn đề về bảo mật.  
Tuy nhiên, dựa trên những gì chúng ta vừa phân tích, tôi nghĩ rằng `GraphQL` có khả năng phát triển và ứng dụng rất lớn, không chỉ với `Replay` mà có thể là một hệ quản trị độc lập. Sự thành công khi áp dụng nó không chỉ phụ thuộc vào bản thân `GraphQL` mà còn phụ thuộc vào phương pháp tiếp cận của chúng ta.  
*Facebook* đã chứng minh được khả năng của `GraphQL` khi có một cách tiếp cận đúng đắn.  
## TL;DR
Khi các app hiện đại ngày càng trở nên phát triển, `GraphQL` thực sự là một công nghệ đáng chú ý, không chỉ có khả năng thay thế các công nghệ cũ nhằm đáp ứng được yêu cầu mới, mà còn có khả năng thay đổi cả phương pháp phát triển. Ngay lúc này, chúng ta đã và đang được trải nghiệm sức mạnh của `GraphQL` trên *Facebook* mobile app, sau đó sẽ là trên `Relay`, và những nền tảng khác nữa.  
`GraphQL` thực sự có thể trở thành một *công nghệ thay đổi thế giới.*
## Tham khảo
[^1]: [GraphQL Introduction](https://facebook.github.io/react/blog/2015/05/01/graphql-introduction.html)
[^2]: [How Facebook’s GraphQL Will Change Backend Development](http://www.reindex.io/blog/how-facebooks-graphql-will-change-backend-development/)
[^3]: [Unofficial Relay FAQ](https://gist.github.com/wincent/598fa75e22bdfa44cf47#What_is_GraphQL)
[^4]: [React with GraphQL for Architecting Apps](http://thenewstack.io/react-with-graphql-for-architecting-apps/)
[^5]: [First Thoughts on GraphQL](http://hueypetersen.com/posts/2015/02/02/first-thoughts-on-graph-ql/)
[^6]: [Facebook just taught us all how to build websites](https://medium.com/gyroscope-innovations/facebook-just-taught-us-all-how-to-build-websites-51f1e7e996f2)
[^7]: [Modeling Queries in a GraphQL Like Way](http://hueypetersen.com/posts/2015/02/08/modeling-queries-graph-ql-like/)
[^8]: [GraphQL Presentation - Krzysztof Stefaniak](https://prezi.com/uikaypr9zezh/graphql-presentation/)
