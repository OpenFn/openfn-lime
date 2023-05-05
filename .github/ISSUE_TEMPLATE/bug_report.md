---
name: Bug report
about: Create a report to help us improve
title: ''
labels: bug
assignees: ''

---

## Describe the bug and expected behavior 
A clear and concise description of what the bug is. Include any error messages from the run logs and the expected behavior. 

## To Reproduce
1. Here is a link to a failed run on OpenFn.org which is indicative of the bug: __________

### expression.js
Link to the job itself in Github: _____________  
Adaptor:


### state.json

Either provide state directly, or link to a file. If sensitive information
should be in state, redact it and provide instructions for where it can be
found.

```json
{
  "configuration": ["SEE LAST PASS: 'client cred'"],
  "data": {LINK TO STATE},
  "cursor": "2020-01-19 00:00:00"
}
```

## To test/resolve
1. After the desired output is working locally (from the CLI), please [push commits to master || open a pull request].
2. [Please test the change on OpenFn.org by re-running this run (link) and confirming success.]

## Toggl 
Name of the Toggle project to log work

