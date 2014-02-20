require "uri"
module Liquid
  class RefUrl < Tag
    def initialize(tagName, url, tokens)
      super

      @url = URI(url)
      @sitename = @url.host.gsub(/www\./,"")
    end

    def render(context)
      "<a rel=\"nofollow\" href=\"#{@url}\">#{@sitename}</a>"
    end
  end

  Template.register_tag "ref_url", RefUrl
end
