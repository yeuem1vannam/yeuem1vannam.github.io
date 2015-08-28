---
layout: post
title: "CDN for your assets: Swarmify (Part 1)"
modified: 2015-08-28 08:58:25 +0700
description: Hướng dẫn sử dụng Swarmify làm CDN cho images / videos
headline: CDN cho ảnh / video của bạn. Tại sao không?
category: posts
tags: [cdn, assets, content delivery network, swarmify]
image:
  feature: contentdelivery.jpg
  credit:
  creditlink: https://swarmify.com/
comments: true
share: true
mathjax:
---
*CDN*[^1]  đã trở thành một công cụ được sử dụng ở mọi nơi, với mong muốn tăng
tốc độ chuyển thông tin đến cho người dùng cuối.  
Tuy nhiên, việc cấu hình CDN không phải lúc nào cũng dễ dàng, trong một số
trường hợp còn trở thành một thay đổi lớn với dự án của bạn.  
Trong bài viết này, tôi muốn giới thiệu một dịch vụ CDN mới dành riêng cho hình
ảnh / video: ==Swarmify==[^2] - Với phương pháp cấu hình rất đơn giản

<!-- more -->

## Đặc điểm nổi bật của Swarmify CDN
- Cấu hình đơn giản, không ảnh hưởng nhiều tới kiến trúc cũng như quá trình phát
  triển của [Website]({{ site.baseurl }})
- Tự động thu thập, lấy nội dung và đưa nội dung tới người dùng cuối
  từ website của bạn
- Không nhất thiết phải thay đổi URL hình ảnh / video như các CDN khác
- ==Miễn phí== khá nhiều trong quá trình beta

Ngoài ra còn một vài đặc điểm đáng chú ý nếu các bạn quan tâm tới công nghệ tạo
nên `Swarmify`
- Nội dung sẽ được truyền tải theo dạng `peer-to-peer` tới người dùng cuối, trên
  nền tảng `WebRTC`
- `Swarmify` sẽ thực hiện `lazy loading` cho bạn một cách **mặc định**, không cần
  phải sử dụng thêm plugin khác ( nếu có, bạn sẽ phải bỏ plugin đi )

## Đăng ký beta với Swarmify
Truy cập vào trang [Swarmify](https://swarmify.com/plans/) và chọn `BETA PLAN` -> `TRY NOW`  
![Swarmify beta plan try](/images/swarmify-beta-plan.png)  
Bạn sẽ được điều hướng sang giao diện `ACCOUNT SIGNUP` của Swarmify[^2], khá
là đơn giản  
![Swarmify beta plan signup](/images/swarmify-beta-signup.png)  
Nhấp `CREATE ACCOUNT` và ... TADA, đã xong phần đăng ký

## Cấu hình để `Swarmify` hoạt động trên trang web của bạn
> **Lưu ý**: Nếu website của bạn đang sử dụng một plugin giúp `lazy load` hình
  ảnh / video thì bạn phải bỏ plugin đó đi. `Swarmify` sẽ làm việc đó cho bạn,
  MẶC ĐỊNH

Sau khi đăng ký thành công account, bạn sẽ được điều hướng về trang
`Dashboard`, ở đây bạn có thể vào phần `SETUP`[^3] để xem hướng dẫn  
Có 2 thông tin quan trọng đó là
- *Swarmify API Key* _f0c9e7da-5e98-4f50-80a0-f35686dac640_ (của [tôi]({{ site.baseurl}}))
- Script nhúng vào website

```html
<script>
  var swarmcdnkey = "api-key-website-của-bạn";
  var swarmimagescan = true;
  var swarmvideoscan = true;
</script>
<script src="//assets.swarmcdn.com/swarmdetect.js"></script>
```
> - `swarmcdnkey` là *Swarmify API key* của bạn
> - `swarmimagescan` khi được set `true`, `Swarmify` sẽ tự scan ảnh có trong
  trang của bạn, upload lên CDN để có thể phục vụ người dùng từ lần truy
  cập tiếp theo
> - `swarmvideoscan` tương tự, áp dụng với trang có video

Để đạt được hiệu quả tốt nhất, phần `javascript` nhúng này nên được đặt ở trên
đầu website, ngay sau tag mở `<head>`  


```html
<!DOCTYPE html>
<html>
  <head>
    <script>
      var swarmcdnkey = "api-key-website-của-bạn";
      var swarmimagescan = true;
      var swarmvideoscan = true;
    </script>
    <script src="//assets.swarmcdn.com/swarmdetect.js"></script>
    <!-- các phần khác của website -->
  </head>
```

Như vậy, `Swarmify` đã hoạt động trên website của bạn. **Rất đơn giản** phải
không?  
*Nếu bạn muốn tăng hiệu quả hơn nữa, hãy tham khảo phần CẤU HÌNH NÂNG CAO*

## Cấu hình nâng cao cho `Swarmify`
> **Lưu ý**: `Swarmify` vẫn hoạt động tốt khi bạn không cấu hình nâng cao

### Sử dụng `Swarm Player` cho video của bạn
Để tăng hiệu quả cho việc truyền tải video, bạn có thể dùng `Swarm Player` cho
video của bạn bằng việc thay đổi *player* hiện tại sang dạng:  

```html
<swarmvideo src="path/to/my/video.mp4" width="800" height="592"
poster="path/to/my/poster.jpg" controls="controls" preload="auto"></swarmvideo>
```
với một vài thuộc tính đáng chú ý:
- `src` đường dẫn tới video của bạn
- `poster` đường dẫn tới ảnh cover video
- `preload` load trước video cho người dùng

Ngoài ra còn vài thuộc tính khác, bạn có thể tham khảo trên trang
[Swarmify/Support](https://swarmify.com/support-help/) phần *VIDEO ATTRIBUTES.
HOW DO I CUSTOMIZE VIDEO?*
### Tối ưu hoá trải nghiệm người dùng trong quá trình truyền tải hình ảnh
Với Setup cơ bản, trang web của bạn đã hoàn toàn sẵn sàng cho việc truyền tải
hình ảnh qua `Swarmify` một các trơn tru. Tuy nhiên, trong một số trường hợp,
khi `Swarmify` chưa  kịp hoạt động, hình ảnh sẽ được load trực tiếp từ website
của bạn.  
Vậy để tăng tối ưu hiệu quả, cũng như nâng cao trải nghiệm người dùng, ta có thể
chuyển `<img>` tag từ dạng thường

```html
<!-- dạng thường -->
<img src="/ảnh_của_bạn.jpg" />
```
sang dạng

```html
<!-- dạng tối ưu hơn -->
<img data-cdn-src="/ảnh_của_bạn.jpg" src="http://assets.swarmcdn.com/images/1x1.gif" />
```
Tất cả các thuộc tính khác bạn vẫn có thể sử dụng một cách bình thường. Trong
trường hợp xấu nhất, vấn đề xảy ra ở dịch vụ của `Swarmify`, ảnh của bạn sẽ lại được load trực tiếp
từ website của bạn một cách bình thường  

That's it!

## TL;DR
`Swarmify` là một dịch vụ CDN mới, với công nghệ hoàn toàn khác so với phần còn
lại của thế giới CDN, rất đáng để trải nghiệm.  
Cấu hình đơn giản, không yêu cầu nhiều việc thay đổi website, hoạt động rất tốt
cho dù ở cấu hình đơn giản nhất. Có thể tóm lược lại về `Swarmify` như vậy.  

*Ở bài viết tiếp theo, tôi sẽ hướng dẫn việc sử dụng `Swarmify` trên
[WordPress](https://wordpress.com/)*
[^1]: Content Delivery Network
[^2]: [Swarmify website](https://swarmify.com/)
[^3]: [Swarmify Setup Guide](https://dash.swarmcdn.com/dashboard#info)
