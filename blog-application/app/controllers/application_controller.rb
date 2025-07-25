class ApplicationController < ActionController::Base
  # Protects from CSRF attacks. Required for HTML forms.
  protect_from_forgery with: :exception

  # This line automatically includes all helpers in all controllers.
  # If you inherit from ActionController::Base, many modules for
  # HTML rendering are automatically included.

  rescue_from ActiveRecord::RecordNotFound do
    # This rescue is for API responses for now, if you completely remove API routes
    # you might want to render a custom HTML error page instead.
    render json: { error: "Resource not found" }, status: :not_found
  end

  # The force_json method is no longer needed as we are serving HTML.
  # The ApplicationController now correctly handles HTML requests.
end
