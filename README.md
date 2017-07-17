# Web Performance Analyzer

## Stack

- NodeJS Server
- Java CLI

## Usage

### Running Server

From the app root, run `node app.js`
This will start the Node app server.

### Running Client

From the app root, first run `javac Client.java` to compile, then run `java Client` to start the CLI.
You will see the following options,

```
Supported commands:
1. testSites <site1>, <site2>,..., <siteN>, number of iterations
2. getStatus <handle>
3. getResults <handle>
4. getAll
5. exit
```

## TODO

- [ ] Add tests
- [ ] Implement JSON support in CLI

## LICENSE

MIT License

Copyright (c) 2017 Sindhu Murthy

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
