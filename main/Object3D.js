'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _three = require('three');

var Three = _interopRequireWildcard(_three);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Object3D = function () {
  function Object3D(width, height, plan, ratio) {
    _classCallCheck(this, Object3D);

    this.width = width;
    this.height = height;
    this.ratio = ratio;
    this.plan = plan;

    this.width *= this.ratio;
    this.height *= this.ratio;

    this.material = null;
  }

  _createClass(Object3D, [{
    key: 'clippingByWall',


    /**
     * Clipping around by wall
     * @param Wall wall
     */
    value: function clippingByWall(wall) {
      if (!this.material.clippingPlanes) {
        this.material.clippingPlanes = [];
      }

      var localPlane = null;

      switch (this.plan) {
        case 'x':
          localPlane = new Three.Plane(new Three.Vector3(0, 0, -1), wall.width / 2 + wall.position.z);
          this.material.clippingPlanes.push(localPlane);
          localPlane = new Three.Plane(new Three.Vector3(0, 0, 1), wall.width / 2 - wall.position.z);
          this.material.clippingPlanes.push(localPlane);

          localPlane = new Three.Plane(new Three.Vector3(0, -1, 0), wall.height / 2 + wall.position.y);
          this.material.clippingPlanes.push(localPlane);
          localPlane = new Three.Plane(new Three.Vector3(0, 1, 0), wall.height / 2 - wall.position.y);
          this.material.clippingPlanes.push(localPlane);
          break;
        case 'y':
          localPlane = new Three.Plane(new Three.Vector3(1, 0, 0), wall.width / 2 - wall.position.x);
          this.material.clippingPlanes.push(localPlane);
          localPlane = new Three.Plane(new Three.Vector3(-1, 0, 0), wall.width / 2 + wall.position.x);
          this.material.clippingPlanes.push(localPlane);

          localPlane = new Three.Plane(new Three.Vector3(0, 0, -1), wall.height / 2 + wall.position.z);
          this.material.clippingPlanes.push(localPlane);
          localPlane = new Three.Plane(new Three.Vector3(0, 0, 1), wall.height / 2 - wall.position.z);
          this.material.clippingPlanes.push(localPlane);
          break;
        case 'z':
          localPlane = new Three.Plane(new Three.Vector3(1, 0, 0), wall.width / 2 - wall.position.x);
          this.material.clippingPlanes.push(localPlane);
          localPlane = new Three.Plane(new Three.Vector3(-1, 0, 0), wall.width / 2 + wall.position.x);
          this.material.clippingPlanes.push(localPlane);

          localPlane = new Three.Plane(new Three.Vector3(0, -1, 0), wall.height / 2 + wall.position.y);
          this.material.clippingPlanes.push(localPlane);
          localPlane = new Three.Plane(new Three.Vector3(0, 1, 0), wall.height / 2 - wall.position.y);
          this.material.clippingPlanes.push(localPlane);
          break;
      }
    }
  }, {
    key: 'points',
    get: function get() {
      var points = [];

      switch (this.plan) {
        case 'x':
          points = [{ z: 0 * this.width + this.position.z, y: 0 * this.height + this.position.y, x: this.position.x }, // bottom - left
          { z: 0 * this.width + this.position.z, y: 1 * this.height + this.position.y, x: this.position.x }, // top - left
          { z: 1 * this.width + this.position.z, y: 1 * this.height + this.position.y, x: this.position.x }, // top - right
          { z: 1 * this.width + this.position.z, y: 0 * this.height + this.position.y, x: this.position.x // bottom - right
          }];
          break;
        case 'y':
          points = [{ x: 0 * this.width + this.position.x, z: 0 * this.height + this.position.z, y: this.position.y }, // bottom - left
          { x: 0 * this.width + this.position.x, z: 1 * this.height + this.position.z, y: this.position.y }, // top - left
          { x: 1 * this.width + this.position.x, z: 1 * this.height + this.position.z, y: this.position.y }, // top - right
          { x: 1 * this.width + this.position.x, z: 0 * this.height + this.position.z, y: this.position.y // bottom - right
          }];
          break;
        case 'z':
          points = [{ x: 0 * this.width + this.position.x, y: 0 * this.height + this.position.y, z: this.position.z }, // bottom - left
          { x: 0 * this.width + this.position.x, y: 1 * this.height + this.position.y, z: this.position.z }, // top - left
          { x: 1 * this.width + this.position.x, y: 1 * this.height + this.position.y, z: this.position.z }, // top - right
          { x: 1 * this.width + this.position.x, y: 0 * this.height + this.position.y, z: this.position.z // bottom - right
          }];
          break;
      }

      return points;
    }
  }]);

  return Object3D;
}();

exports.default = Object3D;