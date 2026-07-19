jcalc is a webapp similar to Soulver. It's a natural language notepad calculator. For example, you can have a session that looks like:
```
rate = $5/hour
work time = 10 hours
total cost = rate * work time
```

And the sidebar output for each line would be:
```
$5/hour
10 hours
$50
```

# Project structure
This directory (`webapp`) contains the actual application logic. A sibling directory `webapp` contains a fork of CodeFlask that supports a right sidebar (to display results of computations). 

# Implementation
The implementation is quite simple. It's built on the math.js library, transforming the text into something that math.js can handle.