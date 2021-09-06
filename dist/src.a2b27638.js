// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"src/cell.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Cell = /*#__PURE__*/function () {
  function Cell(game, valIndex) {
    _classCallCheck(this, Cell);

    this.gameWidth = game.gameWidth;
    this.gameHeight = game.gameHeight; //

    this.game = game;
    this.valIndex = valIndex; //indentity by goal location

    this.inSize = game.inSize; //game's inner size

    this.outSize = game.outSize; //game's outer size

    this.inCap = game.inCap; //total # of inner cells

    this.outCap = game.outCap; //total # of outer cells

    this.offset = game.offset; //offset of puzzle in grid
    //

    this.iy = Math.floor(valIndex / this.inSize); //inner x

    this.ix = valIndex - this.inSize * this.iy; //inner y
    //

    this.y = this.iy + this.offset; //current x

    this.x = this.ix + this.offset; //current y

    this.locIndex = this.outSize * this.y + this.x; //location index on entire grid

    this.orx = this.x; //starting x

    this.ory = this.y; //starting y
    //

    switch (game.pattern) {
      case 0:
        this.state = Math.floor(this.iy / 2) - game.colors * Math.floor(this.iy / (2 * game.colors));
        break;

      case 1:
        this.state = this.iy - game.colors * Math.floor(this.iy / game.colors);
        break;

      case 2:
        this.state = Math.floor(this.ix / 2) - game.colors * Math.floor(this.ix / (2 * game.colors));
        break;

      case 3:
        this.state = this.ix - game.colors * Math.floor(this.ix / game.colors);
        break;

      case 4:
        this.state = this.valIndex - game.colors * Math.floor(this.valIndex / game.colors);
        break;

      case 5:
        this.state = valIndex - 2 * Math.floor(valIndex / 2) + 2 * (this.iy - 2 * Math.floor(this.iy / 2));
        break;
    } //

  } //


  _createClass(Cell, [{
    key: "move",
    value: function move(cx, cy) {
      this.y = this.ory + cy; //calc new y (move origin y plus change y)

      this.x = this.orx + cx; //calc new x (move origin x plus change x)
      //

      if (this.game.map[this.locIndex] == this.valIndex) {
        //check that old map location hasn't already been changed
        this.game.map[this.locIndex] = this.inCap; //set old map location as default

        console.log("Deleting cell at ".concat(this.locIndex));
      }

      this.locIndex = this.outSize * this.y + this.x; //find new location index

      this.game.map[this.locIndex] = this.valIndex; //set new map location as cell value

      console.log("Moving cell ".concat(this.valIndex, " to ").concat(this.locIndex, ", from (").concat(this.orx, ", ").concat(this.ory, ") to (").concat(this.x, ", ").concat(this.y, ")")); //new location index calculation is sometimes wrong
    } //

  }, {
    key: "resetOrigin",
    value: function resetOrigin() {
      this.ory = this.y; //reset starting location for y group shift

      this.orx = this.x; //reset starting location for x group shift
    } //

  }, {
    key: "setLocation",
    value: function setLocation(locIndex) {
      this.locIndex = locIndex; //

      this.y = Math.floor(locIndex / this.outSize);
      this.x = locIndex - this.outSize * this.y;
      this.resetOrigin();
    }
  }]);

  return Cell;
}();

exports.default = Cell;
},{}],"src/artist.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Artist = /*#__PURE__*/function () {
  function Artist(game) {
    _classCallCheck(this, Artist);

    this.gameWidth = game.gameWidth;
    this.gameHeight = game.gameHeight; //

    this.game = game;
    this.inSize = this.game.inSize;
    this.outSize = game.outSize;
    this.inCap = game.inCap;
    this.outCap = game.outCap;
    this.offset = game.offset; //

    this.xStart = 0;
    this.yStart = 0;
    this.width = this.gameWidth; //

    if (this.gameWidth > this.gameHeight) {
      this.xStart = (this.gameWidth - this.gameHeight) / 2;
      this.width = this.gameHeight;
    } else {
      this.yStart = (this.gameHeight - this.gameWidth) / 2;
    } //


    this.unit = this.width / this.outSize;
    console.log("outsize: " + this.outSize + ", unit: " + this.unit); //
  } //


  _createClass(Artist, [{
    key: "draw",
    value: function draw(ctx) {
      var _this = this;

      ctx.lineWidth = 1;
      ctx.strokeStyle = "#000000"; //

      this.game.cells.forEach(function (element) {
        ctx.beginPath();
        ctx.rect(_this.xStart + element.x * _this.unit, _this.yStart + element.y * _this.unit, _this.unit, _this.unit);

        switch (element.state) {
          case 0:
            ctx.fillStyle = "gray";
            break;

          case 1:
            ctx.fillStyle = "blue";
            break;

          case 2:
            ctx.fillStyle = "red";
            break;

          case 3:
            ctx.fillStyle = "purple";
            break;
        }

        ctx.fill(); //ctx.font = '20px "Arial"';
        //ctx.fillStyle = "black";
        //ctx.fillText(`${element.valIndex.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}, ${element.locIndex}`, this.xStart + (element.x * this.unit) + 10, this.yStart + ((element.y + 1) * this.unit) - 20);
      }); //

      ctx.beginPath();
      ctx.moveTo(this.xStart, this.yStart);
      ctx.lineTo(this.xStart, this.yStart + this.width);
      ctx.stroke(); //

      ctx.beginPath();
      ctx.moveTo(this.xStart + this.width, this.yStart);
      ctx.lineTo(this.xStart + this.width, this.yStart + this.width);
      ctx.stroke(); //

      ctx.beginPath();
      ctx.moveTo(this.xStart, this.yStart);
      ctx.lineTo(this.xStart + this.width, this.yStart);
      ctx.stroke(); //

      ctx.beginPath();
      ctx.moveTo(this.xStart, this.yStart + this.width);
      ctx.lineTo(this.xStart + this.width, this.yStart + this.width);
      ctx.stroke(); //

      var i;

      for (i = 1; i < this.outSize; i++) {
        ctx.beginPath();
        ctx.moveTo(this.xStart + i * this.unit, this.yStart);
        ctx.lineTo(this.xStart + i * this.unit, this.yStart + this.width);
        ctx.stroke();
      } //


      for (i = 1; i < this.outSize; i++) {
        ctx.beginPath();
        ctx.moveTo(this.xStart, this.yStart + i * this.unit);
        ctx.lineTo(this.xStart + this.width, this.yStart + i * this.unit);
        ctx.stroke();
      } //


      ctx.lineWidth = this.offset; //

      ctx.beginPath();
      ctx.rect(this.xStart + this.offset * this.unit, this.yStart + this.offset * this.unit, this.inSize * this.unit, this.inSize * this.unit);
      ctx.stroke(); //
    } //

  }, {
    key: "update",
    value: function update(deltaTime) {//
    }
  }]);

  return Artist;
}();

exports.default = Artist;
},{}],"src/grouper.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Grouper = /*#__PURE__*/function () {
  function Grouper(game) {
    _classCallCheck(this, Grouper);

    this.gameWidth = game.gameWidth;
    this.gameHeight = game.gameHeight; //

    this.game = game;
    this.inSize = this.game.inSize;
    this.outSize = this.game.outSize;
    this.inCap = this.game.inCap;
    this.outCap = this.game.outCap; //

    this.unit = this.game.artist.unit;
    this.xStart = this.game.artist.xStart;
    this.yStart = this.game.artist.yStart; //

    this.groups = new Array(); //

    this.selectedGroup = this.inSize;
    this.groupStart = 0; //the cell where the selected group starts
  } //


  _createClass(Grouper, [{
    key: "draw",
    value: function draw(ctx) {
      var _this = this;

      //console.log(this.groups);
      //
      ctx.lineWidth = 5;
      ctx.strokeStyle = "#000000"; //
      //this.identify();
      //

      if (this.game.viewMode == 0) {
        //rows
        this.groups.forEach(function (element, i) {
          if (i != _this.selectedGroup) {
            ctx.beginPath();
            ctx.rect(_this.xStart + element[1] * _this.unit, _this.yStart + [element[0]] * _this.unit, _this.inSize * _this.unit, 1 * _this.unit);
            ctx.stroke();
          }
        }); //

        if (this.selectedGroup != this.inSize) {
          //console.log("selected: " + this.selectedGroup + ", groups: " + this.groups);
          var selec = this.groups[this.selectedGroup];
          ctx.strokeStyle = "#F0FC03";
          ctx.lineWidth = 7;
          ctx.beginPath();
          ctx.rect(this.xStart + selec[1] * this.unit, this.yStart + selec[0] * this.unit, this.inSize * this.unit, 1 * this.unit);
          ctx.stroke();
        }
      } else {
        //columns
        this.groups.forEach(function (element, i) {
          if (i != _this.selectedGroup) {
            ctx.beginPath();
            ctx.rect(_this.xStart + element[0] * _this.unit, _this.yStart + [element[1]] * _this.unit, 1 * _this.unit, _this.inSize * _this.unit);
            ctx.stroke();
          }
        }); //

        if (this.selectedGroup != this.inSize) {
          var selec = this.groups[this.selectedGroup];
          ctx.strokeStyle = "#F0FC03";
          ctx.lineWidth = 7;
          ctx.beginPath();
          ctx.rect(this.xStart + selec[0] * this.unit, this.yStart + selec[1] * this.unit, 1 * this.unit, this.inSize * this.unit);
          ctx.stroke();
        }
      } //

    } //

  }, {
    key: "update",
    value: function update(deltaTime) {//
    } //

  }, {
    key: "identify",
    value: function identify() {
      //find the groups of cells (rows and columns)
      if (this.game.moving == this.inSize) {
        this.groups = []; //

        var i;

        if (this.game.viewMode == 0) {
          //rows
          for (i = 0; i < this.outSize; i++) {
            //cycle rows (change y axis)
            var line = false;
            var build = 0;
            var grStart = 0;
            var cellList = [];

            for (var n = 0; n < this.outSize; n++) {
              //cycle cells in row (change x axis)
              if (this.game.map[this.outSize * i + n] != this.inCap) {
                if (line == false) {
                  //new group started
                  line = true;
                  grStart = n; //set group start
                }

                cellList.push(this.game.map[this.outSize * i + n]);
                build++;
              } else if (line == true) {
                //line finished
                if (build == this.inSize) {
                  //full 6 cell group
                  this.groups.push([i, grStart].concat(cellList)); //add group to list [row, cell start, cells]

                  build = 0;
                  break;
                } else {
                  //more or less than 6, move on
                  break;
                }
              }
            }

            if (build == this.inSize) {
              //full 6 cell group
              this.groups.push([i, grStart].concat(cellList)); //add group to list [row, cell start, cells]
            }
          }
        } else {
          //columns
          for (i = 0; i < this.outSize; i++) {
            //cycle columns (change x axis)
            var line = false;
            var build = 0;
            var grStart = 0;
            var cellList = [];

            for (var n = 0; n < this.outSize; n++) {
              //cycle cells in column (change y axis)
              if (this.game.map[this.outSize * n + i] != this.inCap) {
                if (line == false) {
                  //new group started
                  line = true;
                  grStart = n; //set group start
                }

                build++;
                cellList.push(this.game.map[this.outSize * n + i]);
              } else if (line == true) {
                //line finished
                if (build == this.inSize) {
                  //full 6 cell group
                  this.groups.push([i, grStart].concat(cellList)); //add group to list [column, cell start]

                  build = 0;
                  break;
                } else {
                  //more or less than 6, move on
                  break;
                }
              }
            }

            if (build == this.inSize) {
              //full 6 cell group
              this.groups.push([i, grStart].concat(cellList)); //add group to list [row, cell start]
            }
          }
        }
      }
    } //

  }, {
    key: "selectGroup",
    value: function selectGroup(event) {
      var _this2 = this;

      //identify group beneath cursor
      //console.log("Reselecting group, viewmode: " + this.game.viewMode);
      //console.log("y input: " + event.offsetY);
      this.selectedGroup = this.inSize;

      if (this.game.viewMode == 0) {
        //rows
        this.groups.some(function (element, i) {
          var left = element[1] * _this2.unit + _this2.xStart;
          var right = left + _this2.inSize * _this2.unit;
          var top = element[0] * _this2.unit + _this2.yStart;
          var bottom = top + _this2.unit;

          if (event.offsetX > left && event.offsetX < right && event.offsetY > top && event.offsetY < bottom) {
            _this2.selectedGroup = i;
            return true;
          }
        });
      } else {
        //columns
        this.groups.some(function (element, i) {
          var left = element[0] * _this2.unit + _this2.xStart;
          var right = left + _this2.unit;
          var top = element[1] * _this2.unit + _this2.yStart;
          var bottom = top + _this2.inSize * _this2.unit;

          if (event.offsetX > left && event.offsetX < right && event.offsetY > top && event.offsetY < bottom) {
            _this2.selectedGroup = i; //console.log("Successful: " + i);

            return true;
          }
        });
      } //

    }
  }]);

  return Grouper;
}();

exports.default = Grouper;
},{}],"src/input.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

//need to rebuild this
var InputHandler = /*#__PURE__*/function () {
  function InputHandler(game) {
    var _this = this;

    _classCallCheck(this, InputHandler);

    this.game = game;
    this.lastMouseEvent = null; //

    this.touched = false;
    this.reverb = false; //prevent second click on touch release
    //

    document.body.addEventListener('touchmove', function (event) {
      //remove rubber banding
      event.preventDefault();
    }, {
      passive: false,
      useCapture: false
    }); //

    document.getElementById("play").addEventListener("click", function (event) {
      document.getElementById("menu").style.visibility = "hidden";
      _this.game.level = 0;
      _this.game.gameMode = 0; //set to generated mode

      _this.game.loadLevel(_this.game.level);

      _this.game.grouper.identify();

      _this.game.grouper.selectGroup(_this.lastMouseEvent);
    }); //

    document.getElementById("continue").addEventListener("click", function (event) {
      document.getElementById("menu").style.visibility = "hidden";
      console.log("level: ".concat(_this.game.level));

      if (_this.game.level == -1) {
        _this.game.level = _this.game.savedLevel;
        console.log("Recalling level ".concat(_this.game.level));
      } //this.game.gameMode = 1;//set to crafted mode


      _this.game.loadLevel(_this.game.level);

      _this.game.grouper.identify();

      _this.game.grouper.selectGroup(_this.lastMouseEvent);
    }); //

    document.getElementById("startOver").addEventListener("click", function (event) {
      document.getElementById("menu").style.visibility = "hidden";
      _this.game.level = 0;
      _this.game.gameMode = 1; //set to crafted mode

      _this.game.loadLevel(0);

      _this.game.grouper.identify();

      _this.game.grouper.selectGroup(_this.lastMouseEvent);
    }); //

    document.getElementById("next").addEventListener("click", function (event) {
      document.getElementById("won").style.visibility = "hidden";

      _this.game.loadLevel(_this.game.level);

      _this.game.grouper.identify();

      _this.game.grouper.selectGroup(_this.lastMouseEvent);

      _this.game.confi = [];
    }); //

    document.getElementById("quit").addEventListener("click", function (event) {
      document.getElementById("won").style.visibility = "hidden";
      document.getElementById("menu").style.visibility = "visible";
      _this.game.confi = [];
    }); //

    document.addEventListener("mousemove", function (event) {
      if (_this.game.gamestate == 0) {
        if (_this.game.moving == _this.game.inSize) {
          if (!_this.touched) {
            _this.game.grouper.selectGroup(event); //console.log("Selecting group");

          }
        } else {
          _this.game.moveGroup(event);
        }
      } //this.game.grouper.identify();
      //console.log("offset x: " + event.offsetX);


      _this.lastMouseEvent = event;
      _this.touched = false;
    }); //

    document.addEventListener("mousedown", function (event) {
      if (!_this.reverb) {
        if (_this.game.gamestate == 1 || _this.game.gamestate == 2) {
          /*this.game.menu.checkNext(event);
          //console.log("Identifying");
          this.game.grouper.identify();
          this.game.grouper.selectGroup(event);*/
        } else if (_this.game.grouper.selectedGroup != _this.game.inSize) {
          _this.game.startGroupMove(event);
        }
      } else {
        _this.reverb = false;
      }
    }); //

    document.addEventListener("keydown", function (event) {
      switch (event.key) {
        case " ":
          if (_this.game.gamestate == 0) {
            _this.game.viewMode = _this.game.viewMode * -1 + 1; //console.log(`Command registered, viewMode: ${this.game.viewMode}`);
            //console.log("offset x: " + this.lastMouseEvent.offsetX);

            _this.game.grouper.identify();

            _this.game.grouper.selectGroup(_this.lastMouseEvent);
          }

          break;

        case "Enter":
          switch (_this.game.gamestate) {
            case 0:
              _this.game.logInfo();

              break;

            case 1:
              _this.game.level++;

              _this.game.loadLevel(_this.game.level);

              _this.game.grouper.identify();

              _this.game.grouper.selectGroup(_this.lastMouseEvent);

              break;

            case 2:
              _this.game.gamestate = 1;
              break;

            case 3:
              _this.game.level++;
              document.getElementById("menu").style.visibility = "hidden";
              _this.game.gameMode = 0;

              _this.game.loadLevel(_this.game.level);

              _this.game.grouper.identify();

              if (_this.lastMouseEvent != null) {
                _this.game.grouper.selectGroup(_this.lastMouseEvent);
              }

              break;
          }

          break;

        case "Backspace":
          _this.game.loadLevel(_this.game.level);

          break;
      }
    }); //

    document.addEventListener("mouseup", function (event) {
      if (_this.game.moving != _this.game.inSize) {
        _this.game.moveGroup(event);

        _this.game.stopGroupMove();
      }
    }); //

    document.addEventListener("touchstart", function (event) {
      event.offsetX = event.touches[0].pageX;
      event.offsetY = event.touches[0].pageY;

      if (_this.game.gamestate > 0) {
        _this.game.menu.checkNext(event);

        _this.game.grouper.identify();
      } else {
        _this.game.grouper.selectGroup(event);

        if (_this.game.grouper.selectedGroup != _this.game.inSize) {
          //console.log("selected group: " + this.game.grouper.selectedGroup);
          _this.game.startGroupMove(event);
        } else {
          _this.game.viewMode = _this.game.viewMode * -1 + 1;

          _this.game.grouper.identify(); //this.game.grouper.selectGroup(this.lastMouseEvent);

        }
      } //console.log(`Touch, y:${event.offsetY}`);


      _this.touched = true;
    }); //

    document.addEventListener("touchmove", function (event) {
      event.offsetX = event.touches[event.touches.length - 1].pageX;
      event.offsetY = event.touches[event.touches.length - 1].pageY;

      if (_this.game.gamestate == 0) {
        if (_this.game.moving == _this.game.inSize) {
          _this.game.grouper.selectGroup(event);
        } else {
          _this.game.moveGroup(event);
        }
      } //console.log("offset x: " + event.offsetX);


      _this.lastMouseEvent = event; //console.log("touch moving");
    }); //

    document.addEventListener("touchend", function (event) {
      if (_this.game.moving != _this.game.inSize) {
        _this.game.stopGroupMove();
      }

      event.offsetX = 0;
      event.offsetY = 0;

      _this.game.grouper.selectGroup(event); //console.log("group cleared");


      _this.reverb = true;
    });
  } //


  _createClass(InputHandler, [{
    key: "buttonDet",
    value: function buttonDet(event, rect1) {
      if (event.offsetX > rect1.left && event.offsetX < rect1.right && event.offsetY > rect1.top && event.offsetY < rect1.bottom) {
        return true;
      } else {
        return false;
      }
    }
  }]);

  return InputHandler;
}();

exports.default = InputHandler;
},{}],"src/menu.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Menu = /*#__PURE__*/function () {
  function Menu(game) {
    _classCallCheck(this, Menu);

    this.gameWidth = game.gameWidth;
    this.gameHeight = game.gameHeight; //

    this.game = game; //

    this.fontSize = this.game.artist.width / 10; //

    this.boundLeft = 0;
    this.boundRight = 0;
    this.boundTop = 0;
    this.boundBottom = 0;
  } //


  _createClass(Menu, [{
    key: "drawWon",
    value: function drawWon(ctx) {
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.rect(this.gameWidth / 3, this.gameHeight / 3, this.gameWidth / 3, this.gameHeight / 3);
      ctx.fill(); //

      ctx.font = "bold 25px 'Verdana'";
      var txt = "Congratulations!"; //

      var x0 = this.gameWidth / 2 - ctx.measureText(txt).width / 2;
      var x1 = this.gameWidth / 2 + ctx.measureText(txt).width / 2;
      var gradient = ctx.createLinearGradient(x0, 0, x1, 0);
      gradient.addColorStop("0", "blue");
      gradient.addColorStop("1", "red");
      ctx.fillStyle = gradient;
      ctx.fillText(txt, x0, this.gameHeight / 2 - 20); //

      txt = "You Won!";
      x0 = this.gameWidth / 2 - ctx.measureText(txt).width / 2;
      x1 = this.gameWidth / 2 + ctx.measureText(txt).width / 2;
      gradient = ctx.createLinearGradient(x0, 0, x1, 0);
      gradient.addColorStop("0", "blue");
      gradient.addColorStop("1", "red");
      ctx.fillStyle = gradient;
      ctx.fillText(txt, this.gameWidth / 2 - ctx.measureText(txt).width / 2, this.gameHeight / 2 + 20);
    } //

  }, {
    key: "drawMenu",
    value: function drawMenu(ctx) {
      ctx.font = "bold 25px 'Verdana'";
      ctx.fillStyle = "black";
      var txt = "Next Level";
      this.boundLeft = this.gameWidth / 2 - ctx.measureText(txt).width / 2;
      this.boundRight = this.boundLeft + ctx.measureText(txt).width;
      this.boundTop = this.gameHeight / 2 - this.fontSize / 2;
      this.boundBottom = this.boundTop + this.fontSize;
      ctx.fillText(txt, this.boundLeft, this.gameHeight / 2);
    } //

  }, {
    key: "drawStart",
    value: function drawStart(ctx) {
      ctx.font = "bold ".concat(this.fontSize, "px 'Verdana'");
      ctx.fillStyle = "black";
      var txt = "Start!";
      this.boundLeft = this.gameWidth / 2 - ctx.measureText(txt).width / 2;
      this.boundRight = this.boundLeft + ctx.measureText(txt).width;
      this.boundTop = this.gameHeight / 2 - this.fontSize / 2;
      this.boundBottom = this.boundTop + this.fontSize;
      ctx.fillText(txt, this.boundLeft, this.gameHeight / 2);
    } //

  }, {
    key: "update",
    value: function update(deltaTime) {//
    } //

  }, {
    key: "checkNext",
    value: function checkNext(event) {
      var bounds = {};
      bounds.left = this.boundLeft;
      bounds.right = this.boundRight;
      bounds.top = this.boundTop;
      bounds.bottom = this.boundBottom; //console.table(bounds);
      //console.log(`X: ${event.offsetX}, Y: ${event.offsetY}`);

      if (event.offsetX > this.boundLeft && event.offsetX < this.boundRight && event.offsetY > this.boundTop && event.offsetY < this.boundBottom || this.game.gamestate > 1) {
        this.game.level++;
        console.log("Bounds successful, level: ".concat(this.game.level));
        this.game.loadLevel(this.game.level);
      }
    }
  }]);

  return Menu;
}();

exports.default = Menu;
},{}],"src/confetti.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Confetto = /*#__PURE__*/function () {
  function Confetto(game, mode) {
    _classCallCheck(this, Confetto);

    this.gameWidth = game.gameWidth;
    this.gameHeight = game.gameHeight; //

    this.game = game; //

    this.size = {
      width: 30,
      height: 10
    }; //dimensions of the confetto

    this.hs = {
      w: this.size.width / 2,
      h: this.size.height / 2
    }; //half the dimension (for offsetting to the center)
    //

    this.spin = getRandom(-180, 180); //

    if (mode == 0) {
      this.position = {
        x: this.gameWidth / 2,
        y: this.gameHeight / 2
      };
      this.direction = getRandom(-this.game.confAng, this.game.confAng); //

      this.speed = {
        d: getRandom(700, 900),
        angle: getRandom(-100, 100)
      }; //pixels per second

      this.accel = 0; //-250;//pixels per second per second (angle doesn't accelerate)
    } else {
      this.position = {
        x: getRandom(0, this.gameWidth),
        y: -this.size.width
      };
      this.direction = 180; //

      this.speed = {
        d: getRandom(20, 80),
        angle: getRandom(-100, 100)
      };
      this.accel = 0;
    } //


    this.toBeDeleted = false; //

    this.cN = Math.floor(getRandom(0, 4.5));

    switch (this.cN) {
      case 0:
        this.color = "red";
        break;

      case 1:
        this.color = "blue";
        break;

      case 2:
        this.color = "green";
        break;

      case 3:
        this.color = "orange";
        break;

      case 4:
        this.color = "purple";
        break;
    } //
    //console.log(`Confetto init at ${this.position.x}, ${this.position.y}`);

  } //


  _createClass(Confetto, [{
    key: "draw",
    value: function draw(ctx) {
      //
      ctx.translate(this.position.x, this.position.y);
      ctx.rotate(toRadians(this.spin));
      ctx.translate(-this.position.x, -this.position.y);
      ctx.beginPath();
      ctx.rect(this.position.x - this.hs.w, this.position.y - this.hs.h, this.size.width, this.size.height);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.translate(this.position.x, this.position.y);
      ctx.rotate(-toRadians(this.spin));
      ctx.translate(-this.position.x, -this.position.y); //
    } //

  }, {
    key: "update",
    value: function update(deltaTime) {
      if (this.position.y > this.gameHeight + this.hs.w || this.mode == 0 && this.position.y < -this.hs.w) {
        this.toBeDeleted = true;
      } //


      this.speed.d += this.accel * deltaTime / 1000;
      this.spin += this.speed.angle * deltaTime / 1000; //

      this.position.x += this.speed.d * Math.sin(toRadians(this.direction)) * deltaTime / 1000;
      this.position.y -= this.speed.d * Math.cos(toRadians(this.direction)) * deltaTime / 1000;
    }
  }]);

  return Confetto;
}();

exports.default = Confetto;

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

function toRadians(deg) {
  return deg * Math.PI / 180;
}

function fixAngle(angle) {
  if (angle > 180) {
    angle -= 360;
  } else if (angle < -180) {
    angle += 360;
  }

  return angle;
}
},{}],"src/levels.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lvs = exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Levels = function Levels() {
  _classCallCheck(this, Levels);
};

exports.default = Levels;
var lvs = [//layout = [inSize, outSize, colors, pattern, locIndex]
[6, 12, 3, 0, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 0, 1, 2, 3, 4, 5, 36, 36, 36, 36, 36, 6, 7, 8, 9, 10, 11, 36, 36, 36, 36, 36, 36, 36, 12, 13, 14, 15, 16, 17, 36, 36, 36, 36, 36, 36, 36, 18, 19, 20, 21, 22, 23, 36, 36, 36, 36, 36, 24, 25, 26, 27, 28, 29, 36, 36, 36, 36, 36, 30, 31, 32, 33, 34, 35, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36], [6, 12, 3, 0, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 1, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 0, 8, 2, 3, 4, 5, 36, 36, 36, 36, 36, 6, 7, 15, 9, 10, 11, 36, 36, 36, 36, 36, 12, 13, 14, 22, 16, 17, 36, 36, 36, 36, 36, 18, 19, 20, 21, 27, 23, 36, 36, 36, 36, 36, 36, 36, 24, 25, 26, 32, 28, 29, 36, 36, 36, 36, 36, 36, 36, 30, 31, 36, 33, 34, 35, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36], [6, 12, 3, 0, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 3, 36, 36, 36, 36, 36, 36, 36, 36, 0, 1, 36, 9, 4, 5, 36, 36, 36, 36, 36, 36, 6, 7, 2, 15, 10, 11, 36, 36, 36, 36, 36, 12, 13, 8, 21, 16, 17, 36, 36, 36, 36, 36, 36, 36, 18, 19, 14, 27, 22, 23, 36, 36, 36, 36, 36, 36, 24, 25, 20, 33, 28, 29, 36, 36, 36, 36, 36, 36, 30, 31, 26, 36, 34, 35, 36, 36, 36, 36, 36, 36, 36, 36, 32, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36], [6, 12, 3, 0, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 2, 36, 36, 36, 36, 36, 36, 36, 36, 36, 0, 1, 10, 36, 4, 5, 36, 36, 36, 36, 6, 7, 8, 9, 14, 3, 36, 36, 36, 36, 36, 36, 36, 36, 12, 13, 18, 11, 16, 17, 36, 36, 36, 36, 36, 36, 36, 36, 26, 15, 20, 21, 22, 23, 36, 36, 36, 36, 24, 25, 32, 19, 28, 29, 36, 36, 36, 36, 36, 36, 30, 31, 36, 27, 34, 35, 36, 36, 36, 36, 36, 36, 36, 36, 36, 33, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36], [6, 12, 3, 0, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 13, 1, 2, 3, 4, 5, 36, 36, 36, 36, 36, 36, 6, 0, 8, 9, 10, 11, 36, 36, 36, 36, 36, 36, 12, 7, 15, 16, 17, 35, 36, 36, 36, 36, 36, 36, 18, 19, 20, 14, 22, 23, 36, 36, 36, 36, 36, 36, 24, 25, 26, 27, 21, 29, 36, 36, 36, 36, 36, 36, 30, 31, 32, 33, 34, 28, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36], [6, 12, 3, 0, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 3, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 9, 36, 36, 36, 36, 36, 36, 36, 36, 1, 7, 36, 21, 4, 5, 36, 36, 36, 36, 36, 36, 6, 0, 2, 20, 10, 11, 36, 36, 36, 36, 36, 12, 13, 15, 8, 29, 17, 36, 36, 36, 36, 36, 36, 36, 36, 18, 16, 19, 14, 22, 23, 36, 36, 36, 36, 24, 25, 26, 27, 36, 31, 36, 36, 36, 36, 36, 36, 36, 36, 36, 35, 36, 32, 33, 34, 28, 36, 36, 36, 36, 36, 36, 30, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36], []];
exports.lvs = lvs;
},{}],"src/game.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _cell = _interopRequireDefault(require("./cell"));

var _artist = _interopRequireDefault(require("./artist"));

var _grouper = _interopRequireDefault(require("./grouper"));

var _input = _interopRequireDefault(require("./input"));

var _menu = _interopRequireDefault(require("./menu"));

var _confetti = _interopRequireDefault(require("./confetti"));

var _levels = require("./levels");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var GAMESTATE = {
  RUNNING: 0,
  MENU: 1,
  WON: 2,
  START: 3,
  CREATE: 4
};

var Game = /*#__PURE__*/function () {
  function Game(gameWidth, gameHeight) {
    _classCallCheck(this, Game);

    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
  } //


  _createClass(Game, [{
    key: "start",
    value: function start() {
      this.gamestate = GAMESTATE.START;
      console.log("Gamestate intialized at: 'RUNNING'"); //

      this.inSize = 6; //puzzle size

      this.outSize = 12; //grid size, don't go within 2 cells

      this.offset = Math.floor((this.outSize - this.inSize) / 2); //offset of puzzle in grid, calculate by default

      this.colors = 3; //number of colors in puzzle

      this.pattern = 0; //0 = double row, 1 = single row, 2 = double column, 3 = single column, 4 = alternating, 5 = squares

      this.inCap = this.inSize * this.inSize; //number of tiles in the puzzle

      this.outCap = this.outSize * this.outSize; //number of cells in the grid
      //

      this.moving = this.inSize; //keep track of which group is moving, inSize if none

      this.mouseStartX = 0; //remember mouse starting position for group move, x

      this.mouseStartY = 0; //remember mouse starting position for group move, y
      //

      this.timer = 0; //timer to determine gamestate change from WON to MENU
      //

      var cookieList = document.cookie.split("="); //decode cookie

      this.savedLevel = cookieList[1]; //get level value

      this.gameMode = cookieList[2];
      console.log("Cookie: ".concat(document.cookie, ", saved level: ").concat(this.savedLevel, ", gamemode: ").concat(this.gameMode)); //

      this.level = -1; //current level
      //this.gameMode = 0;//0 = generated, 1 = crafted
      //

      var i;
      this.map = new Array(); //map of every cell in the grid

      this.goalMap = new Array(); //map of the state of every cell in a winning scenario

      for (i = 0; i < this.outCap; i++) {
        //generate default map states
        this.map.push(this.inCap);
        this.goalMap.push(this.colors);
      } //


      this.cells = new Array(); //list of every puzzle tile with a unique identity and state

      for (i = 0; i < this.inCap; i++) {
        //give every tile an identity and a location on the map
        this.cells.push(new _cell.default(this, i));
        var temp = this.cells[i];
        this.map[temp.locIndex] = i;
        this.goalMap[temp.locIndex] = temp.state; //this is fine, since the puzzle is generated in a win state by default
      } //


      this.artist = new _artist.default(this); //draw grid and tiles

      this.grouper = new _grouper.default(this); //draw and select groups

      this.gameObjects = [this.artist, this.grouper]; //

      this.unit = this.artist.unit; //px length for each cell
      //

      this.inputer = new _input.default(this); //handle key and mouse inputs

      this.menu = new _menu.default(this); //draw for WON and MENU gamestates
      //

      this.smallFont = this.menu.fontSize / 2; //

      this.viewMode = 0; //group selection mode, 0 = rows, 1 = columns (space to switch)
      //

      this.grouper.identify(); //indentify tile groups
      //

      this.confAng = Math.tanh(this.gameWidth / this.gameHeight) * 180 / Math.PI;
      this.confi = [];
    } //

  }, {
    key: "draw",
    value: function draw(ctx) {
      //draw objects
      switch (this.gamestate) {
        case GAMESTATE.RUNNING:
          this.gameObjects.forEach(function (object) {
            return object.draw(ctx);
          });
          ctx.font = '20px "Pixeled"';
          ctx.fillStyle = "black";
          ctx.fillText("level: " + (parseInt(this.level) + 1), 10, 20);
          break;
        //

        case GAMESTATE.WON:
          //this.gameObjects.forEach(object => object.draw(ctx));
          //this.menu.drawWon(ctx);
          break;
        //

        case GAMESTATE.MENU:
          //this.menu.drawMenu(ctx);
          if (Math.random() > 0.8) {
            this.confi.push(new _confetti.default(this, 1));
          }

          this.confi.forEach(function (confetto) {
            return confetto.draw(ctx);
          });
          this.confi = this.confi.filter(function (confetto) {
            return !confetto.toBeDeleted;
          });
          break;
        //

        case GAMESTATE.START:
          //this.menu.drawStart(ctx);
          break;

        case GAMESTATE.CREATE:
          this.gameObjects.forEach(function (object) {
            return object.draw(ctx);
          });
          break;
      } //

    } //

  }, {
    key: "update",
    value: function update(deltaTime) {
      //update objects
      if (this.gamestate == GAMESTATE.RUNNING || this.gamestate == GAMESTATE.CREATE) {
        this.gameObjects.forEach(function (object) {
          return object.update(deltaTime);
        });
        this.timer = 0;
      } else {
        this.menu.update(deltaTime);
        this.confi.forEach(function (confetto) {
          return confetto.update(deltaTime);
        });
      } //

    } //

  }, {
    key: "startGroupMove",
    value: function startGroupMove(event) {
      //start moving a group, remember mouse start
      var cellCoords = "Cells at ";
      var group = this.grouper.groups[this.grouper.selectedGroup];

      for (var i = 2; i < group.length; i++) {
        var curCell = this.cells[group[i]];
        cellCoords += "(".concat(curCell.x, ", ").concat(curCell.y, ")-(").concat(curCell.orx, ", ").concat(curCell.ory, "), ");
      }

      console.log(cellCoords); //

      this.grouper.identify();
      this.grouper.selectGroup(event);
      this.moving = this.grouper.selectedGroup;
      this.mouseStartX = event.offsetX;
      this.mouseStartY = event.offsetY;
      this.grouper.groupStart = this.grouper.groups[this.grouper.selectedGroup][1];
      console.log("Start move, mode ".concat(this.viewMode));
    } //

  }, {
    key: "stopGroupMove",
    value: function stopGroupMove() {
      //stop moving a group, check for completion
      this.moving = this.inSize;
      var group = this.grouper.groups[this.grouper.selectedGroup];
      var i;

      for (i = 2; i < group.length; i++) {
        this.cells[group[i]].resetOrigin();
      }

      if (this.checkCompletion() && this.gamestate != GAMESTATE.CREATE) {
        this.gamestate = GAMESTATE.MENU;
        this.grouper.selectedGroup = this.inSize;
        document.getElementById("won").style.visibility = "visible";
        console.log("Gamestate changed to: 'MENU'"); //

        for (var n = 0; n < 50; n++) {
          this.confi.push(new _confetti.default(this, 0));
        } //


        this.level++;
        document.cookie = "level=".concat(this.level, "=").concat(this.gameMode);
        console.log("Cookie set, level: ".concat(this.level));
      }
    } //

  }, {
    key: "moveGroup",
    value: function moveGroup(event) {
      //move a selected group with the cursor's x or y
      var cx = Math.floor((event.offsetX - this.mouseStartX + this.unit / 2) / this.unit);
      var cy = Math.floor((event.offsetY - this.mouseStartY + this.unit / 2) / this.unit); //

      var group = this.grouper.groups[this.grouper.selectedGroup]; //correct group selected

      console.log(group);
      var i;
      var grStart = this.grouper.groupStart; //console.log(grStart);

      if (this.viewMode == 0) {
        //rows
        //console.log(`cx, cy: ${cx}, 0`);
        if (grStart + cx + this.inSize > this.outSize) {
          cx = this.outSize - this.inSize - grStart;
        } else if (grStart + cx < 0) {
          cx = 0 - grStart;
        } //console.log(`Moving: ${group}`);


        for (i = 2; i < group.length; i++) {
          this.cells[group[i]].move(cx, 0);
        }

        this.grouper.groups[this.grouper.selectedGroup][1] = grStart + cx;
      } else {
        //columns
        //console.log(`cx, cy: 0, ${cy}`);
        if (grStart + cy + this.inSize > this.outSize) {
          cy = this.outSize - this.inSize - grStart;
        } else if (grStart + cy < 0) {
          cy = 0 - grStart;
        }

        for (i = 2; i < group.length; i++) {
          this.cells[group[i]].move(0, cy);
        }

        this.grouper.groups[this.grouper.selectedGroup][1] = grStart + cy;
      } //
      //this.grouper.identify();

    } //

  }, {
    key: "logInfo",
    value: function logInfo() {
      //log level info for level creation
      console.log("[" + this.inSize + ", " + this.outSize + ", " + this.colors + ", " + this.pattern + ", " + this.map + "],");
    } //

  }, {
    key: "loadLevel",
    value: function loadLevel(key) {
      var _this = this;

      //load level into grid based on level index (key)
      //
      this.moving = this.inSize; //

      if (this.gameMode == 1) {
        //crafted mode
        //
        if (key >= _levels.lvs.length) {
          //check level exists
          console.log("Load command failed, level does not exist"); //this.level--;

          this.level = 0;
          this.gameMode = 0; //set to generated mode

          this.loadLevel(this.level);
          this.grouper.identify();
          this.grouper.selectGroup(this.inputer.lastMouseEvent);
        } else if (_levels.lvs[key].length < 4) {
          //check that a map exists
          console.log("Load command failed, level is corrupted"); //this.level--;

          this.level = 0;
          this.gameMode = 0; //set to generated mode

          this.loadLevel(this.level);
          this.grouper.identify();
          this.grouper.selectGroup(this.inputer.lastMouseEvent);
        } else {
          var level = _levels.lvs[key]; //reset variables

          console.log("Load command registered, level index: " + key);
          this.inSize = level[0]; //goal grid size

          this.outSize = level[1]; //total grid size

          this.offset = Math.floor((this.outSize - this.inSize) / 2); //goal grid offset from top left

          this.colors = level[2]; //# of colors used

          this.pattern = level[3]; //pattern of colors used (passed into cell, which determines own color)

          this.inCap = this.inSize * this.inSize;
          this.outCap = this.outSize * this.outSize; //

          this.gamestate = GAMESTATE.RUNNING;
          console.log("Gamestate changed to: 'RUNNING'"); //

          this.cells = [];
          this.goalMap = Array(this.outCap).fill(this.colors); //reset goal map to default values

          var i;

          for (i = 0; i < this.inCap; i++) {
            //fill in goal values for every generated cell in the goal map
            this.cells.push(new _cell.default(this, i));
            this.goalMap[this.cells[i].locIndex] = this.cells[i].state;
          } //console.log(this.goalMap);
          //


          this.map = level.slice(4, level.length - 1); //set the current map to the saved level input

          this.map.forEach(function (element, i) {
            //loop through map
            if (element != _this.inCap) {
              //when cell is filled it carries the index of its filler cell
              _this.cells[element].setLocation(i); //update cell object's location

            }
          });
        }
      } else {
        //generated mode
        //var level = lvs[key];//reset variables
        console.log("Load command registered, generating level");
        this.inSize = 6; //goal grid size

        this.outSize = 12; //total grid size

        this.offset = Math.floor((this.outSize - this.inSize) / 2); //goal grid offset from top left

        this.colors = 3; //# of colors used

        this.pattern = 0; //pattern of colors used (passed into cell, which determines own color)

        this.inCap = this.inSize * this.inSize;
        this.outCap = this.outSize * this.outSize; //

        this.gamestate = GAMESTATE.RUNNING;
        console.log("Gamestate changed to: 'RUNNING'"); //

        this.map = Array(this.outCap).fill(this.inCap); //reset map to default values
        //

        this.cells = [];
        this.goalMap = Array(this.outCap).fill(this.colors); //reset goal map to default values

        console.log("Map values reset, intializing generation loop...");
        var i;

        for (i = 0; i < this.inCap; i++) {
          //fill in goal values for every generated cell in the goal map
          this.cells.push(new _cell.default(this, i));
          this.goalMap[this.cells[i].locIndex] = this.cells[i].state;
          this.map[this.cells[i].locIndex] = this.cells[i].valIndex;
        } //


        console.log("Complete, randomizing switches...");
        this.stopOdds = this.level + 1; //# of loops until chances are 50/50 for stopping

        console.log(0 / (0 + this.stopOdds));

        for (i = 0; Math.random() > i / (i + this.stopOdds); i++) {
          //switch cells for a random number of loops
          var ranCell1 = this.cells[Math.floor(this.inCap * Math.random())];
          var ranCell2 = this.cells[Math.floor(this.inCap * Math.random())];

          while (ranCell1.state == ranCell2.state) {
            ranCell2 = this.cells[Math.floor(this.inCap * Math.random())];
          }

          console.log("Switching (".concat(ranCell1.x, ", ").concat(ranCell1.y, ") and (").concat(ranCell2.x, ", ").concat(ranCell2.y, ")")); //

          this.map[ranCell1.locIndex] = ranCell2.valIndex;
          this.map[ranCell2.locIndex] = ranCell1.valIndex;
          var sVal = ranCell2.valIndex;
          var sLoc = ranCell1.locIndex;
          this.cells[ranCell1.valIndex].setLocation(ranCell2.locIndex);
          this.cells[sVal].setLocation(sLoc); //console.log(this.cells);
        }

        console.log("Complete!");
        this.grouper.identify();
      }
    } //

  }, {
    key: "checkCompletion",
    value: function checkCompletion() {
      var _this2 = this;

      //check if puzzle is solved
      return !this.map.some(function (element, i) {
        //check through all of map
        if (element != _this2.inCap) {
          //only check if cell is occupied
          if (_this2.cells[element].state != _this2.goalMap[i]) {
            //stop loop and return false if cell isn't in the proper state  
            return true; //this is reverse by the ! bang operator
          }
        }
      });
    } //

  }, {
    key: "startCreation",
    value: function startCreation() {
      var level = _levels.lvs[key];
      console.log("Create command registered, entering create mode");
      this.inSize = 6; //puzzle size

      this.outSize = 12; //grid size, don't go within 2 cells

      this.offset = Math.floor((this.outSize - this.inSize) / 2); //offset of puzzle in grid, calculate by default

      this.colors = 3; //number of colors in puzzle

      this.pattern = 0; //0 = double row, 1 = single row, 2 = double column, 3 = single column, 4 = alternating, 5 = squares

      this.inCap = this.inSize * this.inSize; //number of tiles in the puzzle

      this.outCap = this.outSize * this.outSize; //number of cells in the grid
      //

      var i;

      for (i = 0; i < this.outCap; i++) {
        //generate default map states
        this.map.push(this.inCap); //push default cell state

        this.goalMap.push(this.colors); //push goal cell color
      } //


      for (i = 0; i < this.inCap; i++) {
        //give every tile an identity and a location on the map
        this.cells.push(new _cell.default(this, i));
        var temp = this.cells[i];
        this.map[temp.locIndex] = i;
        this.goalMap[temp.locIndex] = temp.state; //this is fine, since the puzzle is generated in a win state by default
      }
    }
  }]);

  return Game;
}();

exports.default = Game;
},{"./cell":"src/cell.js","./artist":"src/artist.js","./grouper":"src/grouper.js","./input":"src/input.js","./menu":"src/menu.js","./confetti":"src/confetti.js","./levels":"src/levels.js"}],"src/index.js":[function(require,module,exports) {
"use strict";

var _game = _interopRequireDefault(require("/src/game"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var canvas = document.getElementById("gameScreen");
var ctx = canvas.getContext("2d");
var GAME_WIDTH = window.innerWidth - 22;
var GAME_HEIGHT = window.innerHeight - 22;
canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;
var game = new _game.default(GAME_WIDTH, GAME_HEIGHT);
game.start();
ctx.clearRect(0, 0, 800, 800);
var lastTime = 0;
var whRatio = GAME_WIDTH / GAME_HEIGHT;
var StartBt = document.getElementById("start");
var title = document.getElementById("title");
var menu = document.getElementById("menu");
var won = document.getElementById("won");
var nice = document.getElementById("nice");
var quit = document.getElementById("quit");
var cookieList = document.cookie.split("="); //decode cookie

if (cookieList[1] < 1 || cookieList[2] == 0) {
  document.getElementById("startOver").innerHTML = "Tutorial";
}

if (whRatio > 1.3) {
  //horizontal
  title.style.top = "-15%";
  nice.style.top = "-10%";
  title.style.fontSize = GAME_WIDTH * .12 + "px";
  nice.style.fontSize = GAME_WIDTH * .10 + "px"; //StartBt.style.fontSize = (GAME_WIDTH * .07) + "px";
} else {
  //vertical
  var divWidth = whRatio * -70 + 135;
  var divLeft = (100 - divWidth) / 2; //

  title.style.top = "-20%";
  nice.style.top = "-10%";
  menu.style.left = divLeft + "%";
  menu.style.width = divWidth + "%";
  won.style.left = divLeft + "%";
  won.style.width = divWidth + "%"; //
  //quit.style.
  //

  title.style.fontSize = GAME_WIDTH * .004 * divWidth + "px";
  nice.style.fontSize = GAME_WIDTH * .003 * divWidth + "px"; //StartBt.style.fontSize = (GAME_WIDTH * .002 * divWidth) + "px";
}

function gameLoop(timeStamp) {
  var deltaTime = timeStamp - lastTime;
  lastTime = timeStamp; //

  game.update(deltaTime);
  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  game.draw(ctx); //

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
},{"/src/game":"src/game.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "64187" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/index.js"], null)
//# sourceMappingURL=/src.a2b27638.js.map