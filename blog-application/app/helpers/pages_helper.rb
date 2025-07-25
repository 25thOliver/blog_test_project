#module PagesHelper

  #end

  # app/helpers/pagination_helper.rb
  module PagesHelper
    def first_page_tag
      link_to "First", url_for(page: 1), class: "px-3 py-2 border rounded-l-md text-blue-600 hover:bg-gray-100"
    end

    def prev_page_tag
      link_to "Previous", url_for(page: current_page - 1), class: "px-3 py-2 border text-blue-600 hover:bg-gray-100" unless current_page == 1
    end

    def next_page_tag
      link_to "Next", url_for(page: current_page + 1), class: "px-3 py-2 border text-blue-600 hover:bg-gray-100" unless current_page == total_pages
    end

    def last_page_tag
      link_to "Last", url_for(page: total_pages), class: "px-3 py-2 border rounded-r-md text-blue-600 hover:bg-gray-100"
    end

    def current_page
      @posts.current_page
    end

    def total_pages
      @posts.total_pages
    end
  end
