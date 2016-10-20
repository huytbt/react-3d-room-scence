'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Tile = require('./Tile');

var _Tile2 = _interopRequireDefault(_Tile);

var _three = require('three');

var Three = _interopRequireWildcard(_three);

var _Wall = require('./Wall');

var _Wall2 = _interopRequireDefault(_Wall);

var _async = require('async');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RoomScene = function (_Component) {
  _inherits(RoomScene, _Component);

  function RoomScene(props) {
    _classCallCheck(this, RoomScene);

    var _this = _possibleConstructorReturn(this, (RoomScene.__proto__ || Object.getPrototypeOf(RoomScene)).call(this, props));

    _this.renderer = null;
    _this.scene = null;
    _this.room = null;
    _this.walls = [];
    _this.layerImages = [];
    _this.tiles = [];
    return _this;
  }

  _createClass(RoomScene, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      this.initScene();
      this.loadWalls();
      this.loadTilesTextures(function () {
        _this2.loadLayerImages(function () {
          _this2.layerImages.map(function (layer) {
            _this2.renderImage(layer);
          });

          _this2.renderScene();
        });
      });
    }
  }, {
    key: 'initScene',
    value: function initScene() {
      this.room = new Three.Object3D();
      if (this.props.debug) {
        this.room.add(new Three.GridHelper(100, 50));
      }

      this.scene = new Three.Scene();
      this.scene.add(this.room);

      this.camera = new Three.PerspectiveCamera(this.props.perspective.fov, this.width / this.height, 1, 100000);
      this.camera.position.set(this.props.camera.position.x, this.props.camera.position.y, this.props.camera.position.z);
      this.camera.setViewOffset(this.width, this.height, this.props.perspective.viewOffset.x, this.props.perspective.viewOffset.y, this.width, this.height);

      this.renderer = new Three.WebGLRenderer();
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(this.width, this.height);
      this.renderer.setClearColor(0xffffff, 1);

      this.refs.threeContainer.appendChild(this.renderer.domElement);
    }
  }, {
    key: 'loadWalls',
    value: function loadWalls() {
      var _this3 = this;

      this.props.walls.map(function (element) {
        var wall = new _Wall2.default(element.position, element.plan, element.direction, element.width, element.height, element.ratio, element.tileRatio, element.tiles, element.options);
        _this3.walls.push(wall);
      });
    }
  }, {
    key: 'loadTilesTextures',
    value: function loadTilesTextures(callback) {
      (0, _async.eachSeries)(this.walls, function (wall, callback) {
        var tiles = [];
        (0, _async.eachSeries)(wall.tiles, function (info, callback) {
          var texture = new Three.TextureLoader().load(info.image, function (texture) {
            texture.minFilter = texture.magFilter = Three.LinearFilter;
            texture.mapping = Three.UVMapping;

            var tile = new _Tile2.default(info.width, info.height, wall.plan, wall.tileRatio, texture);
            tiles.push(tile);

            callback();
          });
        }, function () {
          wall.tiles = tiles;
          callback();
        });
      }, callback);
    }
  }, {
    key: 'loadLayerImages',
    value: function loadLayerImages(callback) {
      var _this4 = this;

      (0, _async.eachSeries)(this.props.layerImages, function (element, callback) {
        var texture = new Three.TextureLoader().load(element.image, function (texture) {
          _this4.layerImages.push({
            texture: texture,
            meta: element
          });
          callback();
        });
      }, callback);
    }
  }, {
    key: 'renderScene',
    value: function renderScene() {
      var _this5 = this;

      this.walls.map(function (wall) {
        wall.mount();
        wall.mountedTiles.map(function (tile) {
          _this5.room.add(tile);
        });
      });

      this.renderer.render(this.scene, this.camera);
    }
  }, {
    key: 'renderImage',
    value: function renderImage(layer) {
      var meta = layer.meta;
      var texture = layer.texture;
      var transparent = false;
      if (meta.opacity >= 0) {
        transparent = true;
      }

      var image = new Three.Mesh(new Three.BoxGeometry(meta.width * meta.ratio, meta.height * meta.ratio, 0), new Three.MeshBasicMaterial({ map: texture, transparent: transparent, opacity: meta.opacity }));
      image.position.set(meta.position.x * meta.ratio, meta.position.y * meta.ratio, meta.position.z * meta.ratio);
      this.scene.add(image);
    }
  }, {
    key: 'changeWallTile',
    value: function changeWallTile(wallIndex, tileIndex) {
      this.walls[wallIndex].mountedTiles = [];
      this.walls[wallIndex].options.selectedTile = tileIndex;
      this.room.children = [];
      this.renderScene();
    }
  }, {
    key: 'referesh',
    value: function referesh() {
      this.renderer.render(this.scene, this.camera);
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement('div', { className: 'room-scene-container', ref: 'threeContainer' });
    }
  }, {
    key: 'width',
    get: function get() {
      return this.props.size;
    }
  }, {
    key: 'height',
    get: function get() {
      return this.width / (16 / 9);
    }
  }]);

  return RoomScene;
}(_react.Component);

RoomScene.propTypes = {
  size: _react2.default.PropTypes.number,
  camera: _react2.default.PropTypes.object.isRequired,
  debug: _react2.default.PropTypes.bool,
  perspective: _react2.default.PropTypes.object.isRequired,
  walls: _react2.default.PropTypes.array.isRequired,
  layerImages: _react2.default.PropTypes.array.isRequired
};

RoomScene.defaultProps = {
  size: 1600,
  debug: false
};

exports.default = RoomScene;