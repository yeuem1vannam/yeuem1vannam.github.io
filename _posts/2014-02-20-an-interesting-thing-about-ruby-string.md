---
layout: post
title: "Một điều thú vị về String trong Ruby"
description: "ruby on rails, ruby, string, 23 characters, interesting, benchmark"
category: posts
tags: [ruby on rails, ruby]
tagline: "Ruby"
comments: true
image:
  feature: ruby-strings.png
  credit: yeuem1vannam
  creditlink: http://yeuem1vannam.github.io
---

- - -

## `Ruby String` và giới hạn 23 ký tự
  Một bài test đơn giản về `Benchmark` với `String` của `Ruby` (v 1.9 +)

<!-- more -->

  ```ruby
    require "benchmark"

    ITERATIONS = 1000000

    def run(str, bench)
      bench.report("#{str.length + 1} chars") do
        ITERATIONS.times do
          new_string = str + "x"
        end
      end
    end

    Benchmark.bm do |bench|
     for i in 20...30 do
        run("a" * i, bench)
      end
    end
  ```
  ta nhận được kết quả

  ```bash
              user       system     total    real
    21 chars  0.300000   0.010000   0.310000 (  0.309594)
    22 chars  0.300000   0.000000   0.300000 (  0.302840)
    23 chars  0.310000   0.000000   0.310000 (  0.307644)
    24 chars  0.450000   0.000000   0.450000 (  0.453039)
    25 chars  0.450000   0.000000   0.450000 (  0.456379)
    26 chars  0.460000   0.000000   0.460000 (  0.458442)
    27 chars  0.460000   0.000000   0.460000 (  0.461652)
    28 chars  0.490000   0.000000   0.490000 (  0.490977)
    29 chars  0.590000   0.000000   0.590000 (  0.597655)
    30 chars  0.500000   0.010000   0.510000 (  0.499965)
  ```
  Dễ dàng nhận thấy là với `string` dưới 23 ký tự và trên 23 ký tự có sự khác biệt lớn khi khởi tạo.

### Vì sao?

- - -
## Tham khảo

  1.  [http://www.ruby-doc.org/](http://www.ruby-doc.org/stdlib-2.1.0/libdoc/bigdecimal/rdoc/String.html)
  2.  [http://patshaughnessy.net/](http://patshaughnessy.net/2012/1/4/never-create-ruby-strings-longer-than-23-characters)

- - -
### Note

  *Bài viết chỉ để chia sẻ những điều thú vị về Ruby*
