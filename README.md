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

## Ideas

### Inputs

  - chromium codereview
  - github
  - twitter
  - google group

### Filtering

  - github
    - starred/watching
    - certain comments
      - "Please sign CLA"
      - Mary poppins
    - certain commits
      - Angular release commits

### Summarization

  - github
    - multiple commits around the same time
    - multiple PR comments


### Details

  - github
    - commit diff/comments
    - PR
