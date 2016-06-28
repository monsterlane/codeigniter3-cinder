# CI3-Cinder

This project is designed to provide a single page app like experience for websites, wep apps, or web based mobile apps. By adding the class "cinder" on an anchor link or form, the request will be sent over AJAX and injected into the page. Any required assets (JS/CSS) will be loaded asynchronously. After the inital page load, your visitors will never see a full page change!

#### Current Version
0.8.7 beta

#### Browser Support

Cinder makes use of several HTML5 API's available in modern browsers: [history], [local storage], [file reader]. No support is planned for older browsers.

#### Dependencies
Cinder is built using a number of open source projects.

* [CodeIgniter] - CodeIgniter is a powerful PHP framework with a very small footprint, built for developers who need a simple and elegant toolkit to create full-featured web applications.
* [jQuery] - jQuery is a fast, small, and feature-rich JavaScript library. It makes things like HTML document traversal and manipulation, event handling, animation, and Ajax much simpler with an easy-to-use API that works across a multitude of browsers.
* [RequireJS] - RequireJS is a JavaScript file and module loader. It is optimized for in-browser use, but it can be used in other JavaScript environments, like Rhino and Node. Using a modular script loader like RequireJS will improve the speed and quality of your code.
* [RequireCSS] - A RequireJS CSS loader plugin to allow CSS requires and optimization
* [doT.js] - The fastest + concise javascript template engine for nodejs and browsers. Partials, custom delimiters and more.
* [jclass] - Advanced but lightweight and fast Javascript inheritance model providing class members and prototype conversion.
* [Grunt] - In one word: automation. The less work you have to do when performing repetitive tasks like minification, compilation, unit testing, linting, etc, the easier your job becomes.

### Installation

1. Unpack files to a folder
2. Set your document root to /public
3. Copy /public/.htaccess.example to /public/.htaccess
4. In your .htaccess file set CI_ENV to your desired environment
5. Make /public/files writable by your web user
6. Make /private/logs writable by your web user
7. Make /private/session writable by your web user
8. Run npm install in the root directory

### License

The MIT License (MIT)

Copyright (c) 2016 Jonathan Down

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

[CodeIgniter]:http://www.codeigniter.com/
[RequireJS]:http://requirejs.org/
[RequireCSS]:https://github.com/guybedford/require-css
[doT.js]:https://github.com/olado/doT
[jQuery]:http://jquery.com/
[jclass]:https://github.com/riga/jclass
[history]:https://developer.mozilla.org/en-US/docs/Web/API/History
[local storage]:https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Storage
[file reader]:https://developer.mozilla.org/en-US/docs/Web/API/FileReader
[Grunt]: http://gruntjs.com/
