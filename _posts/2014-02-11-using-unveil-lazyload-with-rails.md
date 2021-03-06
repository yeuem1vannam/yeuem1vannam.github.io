---
layout: post
title: "Sử dụng plugin Unveil lazy-load với Rails"
description: "Kết hợp Lazy load với Rails rất đơn giản"
tagline: javascript
category: posts
tags: [javascript, ruby on rails]
comments: true
# imagefeature: Images-Lazy-Load.png
image:
  feature: Images-Lazy-Load.png
  credit: External
  creditlink: http://www.wpkube.com/
---

Viết lại `image_tag` của Rails trong `application_helper.rb`

<!-- more -->

```ruby
def image_tag(source, options = {})
  options.symbolize_keys!
  options[:src] = "#"
  src = options["data-src"] = path_to_image(source)
  unless src =~ /^(?:cid|data):/ || src.blank?
    options[:alt] = options.fetch(:alt){ image_alt(src) }
  end

  size = options.delete(:size) and if size =~ %r{^\d+x\d+$}
    options[:width], options[:height] = size.split("x")
  end

  if mouseover = options.delete(:mouseover)
    options[:onmouseover] = "this.src='#{path_to_image(mouseover)}'"
  end

  tag("img", options)
end
```

Việc còn lại rất đơn giản, include `Unveil` vào `application.js`

```javascript
//= require jquery.unveil
```

và chạy plugin

```javascript
$(document).ready(function() {
    // Image lazy load plugin Unveil
    $("img").unveil();
});
```
Enjoy!

## Plugin source
[http://luis-almeida.github.io/unveil/](http://luis-almeida.github.io/unveil/)
