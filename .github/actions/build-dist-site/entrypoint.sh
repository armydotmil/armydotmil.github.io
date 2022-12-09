#!/bin/bash

#######################################################################################################
#
# Calls github-pages executable to build the site using whitelisted plugins and supported configuration
#
#######################################################################################################

set -o errexit

SOURCE_DIRECTORY=${GITHUB_WORKSPACE}/$INPUT_SOURCE
DESTINATION_DIRECTORY=${GITHUB_WORKSPACE}/$INPUT_DESTINATION
PAGES_GEM_HOME=$BUNDLE_APP_CONFIG
GITHUB_PAGES=$PAGES_GEM_HOME/bin/github-pages

# Set environment variables required by supported plugins
export JEKYLL_ENV="production"
export JEKYLL_GITHUB_TOKEN=$INPUT_TOKEN
export PAGES_REPO_NWO=$GITHUB_REPOSITORY
export JEKYLL_BUILD_REVISION=$INPUT_BUILD_REVISION

# Set verbose flag
if [ "$INPUT_VERBOSE" = 'true' ]; then
  VERBOSE='--verbose'
else
  VERBOSE=''
fi

# Set future flag
if [ "$INPUT_FUTURE" = 'true' ]; then
  FUTURE='--future'
else
  FUTURE=''
fi

# Install latest version of RubyGems bundler
echo "⚡️ Installing RubyGems bundler..."
gem update --system

# Install all of our dependencies inside the container
# based on the git repository Gemfile
echo "⚡️ Installing project dependencies..."
bundle install

cd "$PAGES_GEM_HOME"

# Build the website using Jekyll
echo "🏋️ Building website..."
$GITHUB_PAGES build "$VERBOSE" "$FUTURE" --source "$SOURCE_DIRECTORY" --destination "$DESTINATION_DIRECTORY"
echo "Jekyll build done"