# syntax=docker/dockerfile:1
# check=error=true

# This Dockerfile is designed for production, not development. Use with Kamal or build'n'run by hand:
# docker build -t blog_api .
# docker run -d -p 80:80 -e RAILS_MASTER_KEY=<value from config/master.key> --name blog_api blog_api

# For a containerized dev environment, see Dev Containers: https://guides.rubyonrails.org/getting_started_with_devcontainer.html

# Make sure RUBY_VERSION matches the Ruby version in .ruby-version
ARG RUBY_VERSION=3.4.5
ARG RAILS_MASTER_KEY
FROM docker.io/library/ruby:$RUBY_VERSION-slim AS base

# Rails app lives here
WORKDIR /rails

# Install base system packages required by Rails and Node.js tools
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y curl libjemalloc2 libvips postgresql-client && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Set production environment variables for Rails and Bundler
ENV RAILS_ENV="production" \
    BUNDLE_DEPLOYMENT="1" \
    BUNDLE_PATH="/usr/local/bundle" \
    BUNDLE_WITHOUT="development"

# --- Build Stage (to reduce final image size) ---
FROM base AS build

# Install build-time dependencies including compilers, git, and Node.js setup tools
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential git libpq-dev libyaml-dev pkg-config ca-certificates curl gnupg && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Install Node.js using NodeSource setup script (Node 20.x LTS)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get update -qq && apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Install application Ruby gems
COPY Gemfile Gemfile.lock ./
RUN bundle install && \
    rm -rf "${BUNDLE_PATH}"/ruby/*/cache "${BUNDLE_PATH}"/ruby/*/bundler/gems/*/.git && \
    bundle exec bootsnap precompile --gemfile

# Copy all application code (including assets, config files, package.json etc.)
COPY . .

# Install JavaScript dependencies (including Tailwind CSS CLI)
COPY package.json package-lock.json ./
RUN npm install --omit=dev

# Build Tailwind CSS before Rails asset precompilation
RUN SECRET_KEY_BASE=${RAILS_MASTER_KEY} bundle exec rails tailwindcss:build

# Precompile all production assets (CSS, JavaScript, images etc.)
# Use a dummy secret key base here to satisfy Rails requirement during build
RUN SECRET_KEY_BASE=dummy_key bundle exec rails assets:precompile

# Alternative: use real key from build argument if necessary (uncomment below)
# RUN SECRET_KEY_BASE=${RAILS_MASTER_KEY} bundle exec rails assets:precompile

# Precompile Bootsnap code for faster boot times
RUN bundle exec bootsnap precompile app/ lib/

# --- Final Stage for the Production App Image ---
FROM base

# Copy built artifacts from the build stage: Ruby gems and the compiled application
COPY --from=build "${BUNDLE_PATH}" "${BUNDLE_PATH}"
COPY --from=build /rails /rails

# Create a non-root user for security best practices and set ownership
RUN groupadd --system --gid 1000 rails && \
    useradd rails --uid 1000 --gid 1000 --create-home --shell /bin/bash && \
    chown -R rails:rails db log storage tmp

USER 1000:1000

# Entrypoint script prepares the database (e.g., runs migrations)
ENTRYPOINT ["/rails/bin/docker-entrypoint"]

# Default command to start the Rails server via Thruster
EXPOSE 80
CMD ["./bin/thrust", "./bin/rails", "server"]
