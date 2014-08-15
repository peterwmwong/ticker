# Ticker

Stay up-to-date with X with minimal effort.

- Group sources of information of X
  - Github
  - Website (blog)
  - Twitter
  - Google+
  - Google Group
- Aggregate/Summarize updates
  - Most active PR/Issue
  - Aggregate PR Activity
    - PR comments as a number
    - PR Closed (Merged or Not)

## Development Setup

    npm install
    npm install -g bower
    bower install
    npm install -g gulp
    gulp dev

- Visit [http://localhost:8081/build/](http://localhost:8081/build/)

### after pulling new code...

    npm install     # Keep up-to-date with deps
    bower install
    gulp dev        # Build all assets
