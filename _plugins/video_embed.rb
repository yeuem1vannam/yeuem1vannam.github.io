module Liquid
  module EmbedInitializer
    def initialize(tagName, markup, tokens)
      super

      if markup =~ Syntax then
        @id = $1

        if $2.nil? then
          @width = 560
          @height = 420
        else
          @width = $2.to_i
          @height = $3.to_i
        end
      else
        name = self.name.split("::")[1] and raise "No #{name.capitalize} ID provided in the \"#{name.downcase}\" tag"
      end
    end
  end

  Syntax = /^\s*([^\s]+)(?:\s+(\d+)\s+(\d+)\s*)?/

  class YouTube < Tag
    include EmbedInitializer

    def render(context)
      "<iframe width=\"#{@width}\" height=\"#{@height}\" src=\"http://www.youtube.com/embed/#{@id}?color=white&amp;theme=light\">&nbsp;</iframe>"
    end
  end

  class Vimeo < Tag
    include EmbedInitializer

    def render(context)
      "<div class=\"vimeo\"><iframe src='http://player.vimeo.com/video/#{@id}\" width=\"#{@width}\" height=\"#{@height}\" frameborder=\"0\" webkitAllowFullScreen mozallowfullscreen allowFullScreen> </iframe></div>"
    end
  end

  Template.register_tag "youtube", YouTube
  Template.register_tag "vimeo", Vimeo
end
