ARG RUBY_VERSION=3.1
FROM ruby:$RUBY_VERSION-slim

# Lets install all dependencies
# including git and Bundler 2.1.4
ENV BUNDLER_VERSION 2.1.4

RUN apt-get update && \
    apt-get install --no-install-recommends -y \
    build-essential \
    git \
    locales \
    nodejs \
    && gem install bundler:2.1.4 \
    && bundle config --global silence_root_warning 1

RUN \
  echo "en_US UTF-8" > /etc/locale.gen && \
  locale-gen en-US.UTF-8
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US.UTF-8
ENV LC_ALL en_US.UTF-8

# This is our entrypoint to our custom scripts
# more about that in a sec
COPY entrypoint.sh /

# Use the entrypoint.sh file as the container entrypoint
# when Github executes our Docker container
ENTRYPOINT ["sh", "/entrypoint.sh"]