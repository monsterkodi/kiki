// koffee 1.4.0
var Camera, Matrix, Quaternion, Vector, clamp,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

clamp = require('kxk').clamp;

Matrix = require('./lib/matrix');

Vector = require('./lib/vector');

Quaternion = require('./lib/quaternion');

Camera = (function(superClass) {
    extend(Camera, superClass);

    Camera.INSIDE = 0;

    Camera.BEHIND = 1;

    Camera.FOLLOW = 2;

    function Camera(player, opt) {
        var ref, ref1, ref2, ref3;
        this.player = player;
        this.fov = (ref = opt != null ? opt.fov : void 0) != null ? ref : 90;
        this.near = (ref1 = opt != null ? opt.near : void 0) != null ? ref1 : 0.01;
        this.eye_distance = this.near;
        this.far = (ref2 = opt != null ? opt.far : void 0) != null ? ref2 : 30;
        this.mode = Camera.BEHIND;
        this.aspect = (ref3 = opt.aspect) != null ? ref3 : -1;
        this.dist = 10;
        this.border = [0, 0, 0, 0];
        Camera.__super__.constructor.apply(this, arguments);
        this.setViewport(0.0, 0.0, 1.0, 1.0);
        this.cam = new THREE.PerspectiveCamera(this.fov, this.aspect, this.near, this.far);
        this.cam.position.z = this.dist;
    }

    Camera.prototype.step = function(step) {
        var camPos, pos;
        switch (this.mode) {
            case Camera.INSIDE:
                this.insideProjection();
                break;
            case Camera.BEHIND:
                this.behindProjection();
                break;
            case Camera.FOLLOW:
                this.followProjection();
        }
        camPos = this.getPosition();
        this.cam.position.copy(camPos);
        this.cam.up.copy(this.getYVector());
        this.cam.lookAt(camPos.plus(this.getZVector()));
        if (this.light != null) {
            pos = this.getPosition().plus(this.light_offset);
            this.light.setDirection(-this.getZVector());
            return this.light.setPosition(new Vector(pos[X], pos[Y], pos[Z], 1.0));
        }
    };

    Camera.prototype.getLookAtPosition = function() {
        return this.getZVector().mul(-this.eye_distance).plus(this.getPosition());
    };

    Camera.prototype.setOrientation = function(o) {
        this.setYVector(o.rotate(Vector.unitY));
        this.setZVector(o.rotate(Vector.unitZ));
        this.setXVector(o.rotate(Vector.minusX));
        this.cam.up.copy(this.getYVector());
        return this.cam.lookAt(this.getPosition().plus(this.getZVector()));
    };

    Camera.prototype.updateViewport = function() {};

    Camera.prototype.setViewportBorder = function(l, b, r, t) {};

    Camera.prototype.setViewport = function(l, b, w, h) {};

    Camera.prototype.setFov = function(fov) {
        return this.fov = Math.max(2.0, Math.min(fov, 175.0));
    };

    Camera.prototype.insideProjection = function() {
        var camPos, lookAngle, lookDelta, newLookVector, playerDir, playerPos, playerUp, posDelta, rot;
        playerPos = this.player.currentPos();
        playerDir = this.player.currentDir();
        playerUp = this.player.currentUp();
        lookAngle = this.player.look_angle;
        posDelta = world.getSpeed() / 10.0;
        camPos = playerPos;
        if (lookAngle < 0) {
            camPos.add(playerUp.mul(-2 * lookAngle / 90));
        }
        this.setPosition(this.getPosition().mul(1.0 - posDelta).plus(camPos.mul(posDelta)));
        if (lookAngle) {
            this.setXVector(playerDir.cross(playerUp).normal());
            rot = Quaternion.rotationAroundVector(lookAngle, this.getXVector());
            this.setYVector(rot.rotate(playerUp));
            this.setZVector(rot.rotate(playerDir));
        } else {
            lookDelta = (2.0 - this.getZVector().dot(playerDir)) * world.getSpeed() / 50.0;
            newLookVector = this.getZVector().mul(1.0 - lookDelta).plus(playerDir.mul(lookDelta));
            newLookVector.normalize();
            this.setXVector(playerUp.cross(newLookVector).normal());
            this.setYVector(playerUp);
            this.setZVector(newLookVector);
        }
        return this.projection;
    };

    Camera.prototype.behindProjection = function() {
        var botToCamera, camPos, lookAngle, lookDelta, min_f, newLookVector, playerDir, playerPos, playerUp, posDelta, rot;
        playerPos = this.player.currentPos();
        playerDir = this.player.currentDir();
        playerUp = this.player.currentUp();
        lookAngle = this.player.look_angle;
        botToCamera = playerUp.minus(playerDir.mul(2));
        min_f = botToCamera.length();
        botToCamera.normalize();
        min_f = Math.min(world.getWallDistanceForRay(playerPos, botToCamera), min_f);
        camPos = playerPos.plus(botToCamera.mul(Math.max(min_f, 0.72) * (1 - Math.abs(lookAngle) / 90)));
        if (lookAngle < 0) {
            camPos.add(playerUp.mul(-2 * lookAngle / 90));
        }
        camPos = world.getInsideWallPosWithDelta(camPos, 0.2);
        posDelta = 0.2;
        this.setPosition(this.getPosition().mul(1.0 - posDelta).plus(camPos.mul(posDelta)));
        if (lookAngle) {
            this.setXVector(playerDir.cross(playerUp).normal());
            rot = Quaternion.rotationAroundVector(lookAngle, this.getXVector());
            this.setYVector(rot.rotate(playerUp));
            return this.setZVector(rot.rotate(playerDir));
        } else {
            lookDelta = 0.3;
            newLookVector = this.getZVector().mul(1.0 - lookDelta).plus((playerDir.minus(playerUp.mul(0.2)).normal()).mul(lookDelta));
            newLookVector.normalize();
            this.setZVector(newLookVector);
            this.setXVector(playerUp.cross(newLookVector).normal());
            return this.setYVector(newLookVector.cross(this.getXVector()).normal());
        }
    };

    Camera.prototype.followProjection = function() {
        var botToCamera, botToCameraNormal, camPos, cameraBotDistance, delta, desiredDistance, difference, horizontalAngle, lookDelta, mappedToXZ, newLeftVector, newLookVector, newUpVector, playerDir, playerLeft, playerPos, playerUp, rotFactor, rotQuat, upDelta, verticalAngle, wall_distance;
        camPos = this.getPosition();
        desiredDistance = 2.0;
        playerPos = this.player.currentPos();
        playerDir = this.player.currentDir();
        playerUp = this.player.currentUp();
        playerLeft = this.player.currentLeft();
        botToCamera = camPos.minus(playerPos);
        cameraBotDistance = botToCamera.length();
        if (cameraBotDistance >= desiredDistance) {
            difference = cameraBotDistance - desiredDistance;
            delta = difference * difference / 400.0;
            camPos = camPos.mul(1.0 - delta).plus(playerPos.mul(delta));
        } else {
            difference = desiredDistance - cameraBotDistance;
            delta = difference / 20.0;
            camPos = camPos.mul(1.0 - delta).plus((playerPos.plus(botToCamera.normal().mul(desiredDistance))).mul(delta));
        }
        botToCamera = camPos.minus(playerPos);
        botToCameraNormal = botToCamera.normal();
        verticalAngle = Vector.RAD2DEG(Math.acos(clamp(-1.0, 1.0, botToCameraNormal.dot(playerUp))));
        if (verticalAngle > 45) {
            rotQuat = Quaternion.rotationAroundVector(verticalAngle / 400.0, botToCameraNormal.cross(playerUp));
            botToCamera = rotQuat.rotate(botToCamera);
            botToCameraNormal = botToCamera.normal();
            camPos = playerPos.plus(botToCamera);
        }
        rotFactor = 1.0;
        wall_distance = world.getWallDistanceForPos(camPos);
        if (wall_distance < 0.5) {
            if (wall_distance < 0.2) {
                camPos = world.getInsideWallPosWithDelta(camPos, 0.2);
                botToCamera = camPos.minus(playerPos);
                botToCameraNormal = botToCamera.normal();
            }
            rotFactor = 0.5 / (wall_distance - 0.2);
        }
        mappedToXZ = (botToCamera.minus(playerUp.mul(botToCamera.dot(playerUp)))).normal();
        horizontalAngle = Vector.RAD2DEG(Math.acos(clamp(-1.0, 1.0, -playerDir.dot(mappedToXZ))));
        if (botToCameraNormal.dot(playerLeft) < 0) {
            horizontalAngle = -horizontalAngle;
        }
        rotQuat = Quaternion.rotationAroundVector(horizontalAngle / (rotFactor * 400.0), playerUp);
        camPos = playerPos.plus(rotQuat.rotate(botToCamera));
        botToCamera = camPos.minus(playerPos);
        botToCameraNormal = botToCamera.normal();
        this.setPosition(camPos);
        lookDelta = this.getZVector().dot(botToCameraNormal);
        lookDelta *= lookDelta / 30.0;
        newLookVector = this.getZVector().mul(1.0 - lookDelta).plus(botToCameraNormal.neg().mul(lookDelta));
        newLookVector.normalize();
        upDelta = 1.5 - this.getYVector().dot(playerUp);
        upDelta *= upDelta / 100.0;
        newUpVector = this.getYVector().mul(1.0 - upDelta).plus(playerUp.mul(upDelta));
        newUpVector.normalize();
        newLeftVector = newUpVector.cross(newLookVector);
        this.setXVector(newLeftVector);
        this.setYVector(newUpVector);
        this.setZVector(newLookVector);
        return this.projection;
    };

    return Camera;

})(Matrix);

module.exports = Camera;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FtZXJhLmpzIiwic291cmNlUm9vdCI6Ii4iLCJzb3VyY2VzIjpbIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBT0EsSUFBQSx5Q0FBQTtJQUFBOzs7QUFBRSxRQUFVLE9BQUEsQ0FBUSxLQUFSOztBQUNaLE1BQUEsR0FBYyxPQUFBLENBQVEsY0FBUjs7QUFDZCxNQUFBLEdBQWMsT0FBQSxDQUFRLGNBQVI7O0FBQ2QsVUFBQSxHQUFjLE9BQUEsQ0FBUSxrQkFBUjs7QUFFUjs7O0lBRUYsTUFBQyxDQUFBLE1BQUQsR0FBVTs7SUFDVixNQUFDLENBQUEsTUFBRCxHQUFVOztJQUNWLE1BQUMsQ0FBQSxNQUFELEdBQVU7O0lBRVAsZ0JBQUMsTUFBRCxFQUFVLEdBQVY7QUFDQyxZQUFBO1FBREEsSUFBQyxDQUFBLFNBQUQ7UUFDQSxJQUFDLENBQUEsR0FBRCwwREFBcUI7UUFDckIsSUFBQyxDQUFBLElBQUQsNkRBQXNCO1FBQ3RCLElBQUMsQ0FBQSxZQUFELEdBQWdCLElBQUMsQ0FBQTtRQUNqQixJQUFDLENBQUEsR0FBRCw0REFBcUI7UUFDckIsSUFBQyxDQUFBLElBQUQsR0FBVSxNQUFNLENBQUM7UUFDakIsSUFBQyxDQUFBLE1BQUQsd0NBQXVCLENBQUM7UUFDeEIsSUFBQyxDQUFBLElBQUQsR0FBVTtRQUNWLElBQUMsQ0FBQSxNQUFELEdBQVUsQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsRUFBTyxDQUFQO1FBRVYseUNBQUEsU0FBQTtRQUVBLElBQUMsQ0FBQSxXQUFELENBQWEsR0FBYixFQUFrQixHQUFsQixFQUF1QixHQUF2QixFQUE0QixHQUE1QjtRQUVBLElBQUMsQ0FBQSxHQUFELEdBQU8sSUFBSSxLQUFLLENBQUMsaUJBQVYsQ0FBNEIsSUFBQyxDQUFBLEdBQTdCLEVBQWtDLElBQUMsQ0FBQSxNQUFuQyxFQUEyQyxJQUFDLENBQUEsSUFBNUMsRUFBa0QsSUFBQyxDQUFBLEdBQW5EO1FBQ1AsSUFBQyxDQUFBLEdBQUcsQ0FBQyxRQUFRLENB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QUQsQ0FBQSxDQUFhLENBQUMsR0FBZCxDQUFrQixHQUFBLEdBQUksT0FBdEIsQ0FBOEIsQ0FBQyxJQUEvQixDQUFvQyxRQUFRLENBQUMsR0FBVCxDQUFhLE9BQWIsQ0FBcEM7UUFDZCxXQUFXLENBQUMsU0FBWixDQUFBO1FBRUEsYUFBQSxHQUFnQixXQUFXLENBQUMsS0FBWixDQUFrQixhQUFsQjtRQUdoQixJQUFDLENBQUEsVUFBRCxDQUFZLGFBQVo7UUFDQSxJQUFDLENBQUEsVUFBRCxDQUFZLFdBQVo7UUFDQSxJQUFDLENBQUEsVUFBRCxDQUFZLGFBQVo7ZUFDQSxJQUFDLENBQUE7SUFoRmE7Ozs7R0F4SkQ7O0FBME9yQixNQUFNLENBQUMsT0FBUCxHQUFpQiIsInNvdXJjZXNDb250ZW50IjpbIlxuIyAgICAwMDAwMDAwICAgMDAwMDAwMCAgIDAwICAgICAwMCAgMDAwMDAwMDAgIDAwMDAwMDAwICAgIDAwMDAwMDAgXG4jICAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAwMDBcbiMgICAwMDAgICAgICAgMDAwMDAwMDAwICAwMDAwMDAwMDAgIDAwMDAwMDAgICAwMDAwMDAwICAgIDAwMDAwMDAwMFxuIyAgIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAwIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwXG4jICAgIDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAwMDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDBcblxueyBjbGFtcCB9ID0gcmVxdWlyZSAna3hrJ1xuTWF0cml4ICAgICAgPSByZXF1aXJlICcuL2xpYi9tYXRyaXgnXG5WZWN0b3IgICAgICA9IHJlcXVpcmUgJy4vbGliL3ZlY3RvcidcblF1YXRlcm5pb24gID0gcmVxdWlyZSAnLi9saWIvcXVhdGVybmlvbidcblxuY2xhc3MgQ2FtZXJhIGV4dGVuZHMgTWF0cml4XG5cbiAgICBASU5TSURFID0gMCBcbiAgICBAQkVISU5EID0gMSBcbiAgICBARk9MTE9XID0gMlxuICAgICAgICBcbiAgICBAOiAoQHBsYXllciwgb3B0KSAtPlxuICAgICAgICBAZm92ICAgID0gb3B0Py5mb3YgPyA5MFxuICAgICAgICBAbmVhciAgID0gb3B0Py5uZWFyID8gMC4wMVxuICAgICAgICBAZXllX2Rpc3RhbmNlID0gQG5lYXJcbiAgICAgICAgQGZhciAgICA9IG9wdD8uZmFyID8gMzBcbiAgICAgICAgQG1vZGUgICA9IENhbWVyYS5CRUhJTkRcbiAgICAgICAgQGFzcGVjdCA9IG9wdC5hc3BlY3QgPyAtMVxuICAgICAgICBAZGlzdCAgID0gMTBcbiAgICAgICAgQGJvcmRlciA9IFswLDAsMCwwXVxuICAgICAgICBcbiAgICAgICAgc3VwZXJcbiAgICAgICAgXG4gICAgICAgIEBzZXRWaWV3cG9ydCAwLjAsIDAuMCwgMS4wLCAxLjAgXG4gICAgICAgIFxuICAgICAgICBAY2FtID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhIEBmb3YsIEBhc3BlY3QsIEBuZWFyLCBAZmFyXG4gICAgICAgIEBjYW0ucG9zaXRpb24ueiA9IEBkaXN0XG4gICAgICAgIFxuICAgIHN0ZXA6IChzdGVwKSAtPlxuICAgICAgICBcbiAgICAgICAgc3dpdGNoIEBtb2RlXG4gICAgICAgICAgICB3aGVuIENhbWVyYS5JTlNJREUgdGhlbiBAaW5zaWRlUHJvamVjdGlvbigpICAgICBcbiAgICAgICAgICAgIHdoZW4gQ2FtZXJhLkJFSElORCB0aGVuIEBiZWhpbmRQcm9qZWN0aW9uKClcbiAgICAgICAgICAgIHdoZW4gQ2FtZXJhLkZPTExPVyB0aGVuIEBmb2xsb3dQcm9qZWN0aW9uKClcbiAgICAgICAgXG4gICAgICAgIGNhbVBvcyA9IEBnZXRQb3NpdGlvbigpXG4gICAgICAgIEBjYW0ucG9zaXRpb24uY29weSBjYW1Qb3NcbiAgICAgICAgQGNhbS51cC5jb3B5IEBnZXRZVmVjdG9yKClcbiAgICAgICAgQGNhbS5sb29rQXQgY2FtUG9zLnBsdXMgQGdldFpWZWN0b3IoKVxuXG4gICAgICAgIGlmIEBsaWdodD9cbiAgICAgICAgICAgIHBvcyA9IEBnZXRQb3NpdGlvbigpLnBsdXMgQGxpZ2h0X29mZnNldFxuICAgICAgICAgICAgQGxpZ2h0LnNldERpcmVjdGlvbiAtQGdldFpWZWN0b3IoKVxuICAgICAgICAgICAgQGxpZ2h0LnNldFBvc2l0aW9uIG5ldyBWZWN0b3IgcG9zW1hdLCBwb3NbWV0sIHBvc1taXSwgMS4wICMgcG9zaXRpb25hbCBsaWdodCBzb3VyY2VcbiAgICBcbiAgICBnZXRMb29rQXRQb3NpdGlvbjogLT4gQGdldFpWZWN0b3IoKS5tdWwoLUBleWVfZGlzdGFuY2UpLnBsdXMgQGdldFBvc2l0aW9uKClcbiAgICBcbiAgICBzZXRPcmllbnRhdGlvbjogKG8pIC0+IFxuICAgICAgICBAc2V0WVZlY3RvciBvLnJvdGF0ZSBWZWN0b3IudW5pdFlcbiAgICAgICAgQHNldFpWZWN0b3Igby5yb3RhdGUgVmVjdG9yLnVuaXRaXG4gICAgICAgIEBzZXRYVmVjdG9yIG8ucm90YXRlIFZlY3Rvci5taW51c1hcbiAgICAgICAgQGNhbS51cC5jb3B5IEBnZXRZVmVjdG9yKClcbiAgICAgICAgQGNhbS5sb29rQXQgQGdldFBvc2l0aW9uKCkucGx1cyBAZ2V0WlZlY3RvcigpXG4gICAgICAgICAgICBcbiAgICB1cGRhdGVWaWV3cG9ydDogLT5cbiAgICAgICAgIyBzcyA9IHdvcmxkLnNjcmVlblNpemVcbiAgICAgICAgIyB2cCA9IFtdXG4gICAgICAgICMgdnBbMF0gPSBAdmlld3BvcnRbMF0gKiBzcy53ICsgQGJvcmRlclswXVxuICAgICAgICAjIHZwWzFdID0gQHZpZXdwb3J0WzFdICogc3MuaCArIEBib3JkZXJbMV1cbiAgICAgICAgIyB2cFsyXSA9IEB2aWV3cG9ydFsyXSAqIHNzLncgLSBAYm9yZGVyWzBdIC0gQGJvcmRlclsyXVxuICAgICAgICAjIHZwWzNdID0gQHZpZXdwb3J0WzNdICogc3MuaCAtIEBib3JkZXJbMV0gLSBAYm9yZGVyWzNdXG4gICAgXG4gICAgc2V0Vmlld3BvcnRCb3JkZXI6IChsLCBiLCByLCB0KSAtPlxuICAgICAgICAjIEBib3JkZXIgPSBbbCxiLHIsdF1cbiAgICAgICAgIyBAdXBkYXRlVmlld3BvcnQoKVxuICAgIFxuICAgIHNldFZpZXdwb3J0OiAobCwgYiwgdywgaCkgLT5cbiAgICAgICAgIyBAdmlld3BvcnQgPSBbbCxiLHcsaF0gXG4gICAgICAgICMgQHVwZGF0ZVZpZXdwb3J0KClcbiMgICAgIFxuICAgIHNldEZvdjogKGZvdikgLT4gQGZvdiA9IE1hdGgubWF4KDIuMCwgTWF0aC5taW4gZm92LCAxNzUuMClcbiAgICAgICAgICAgIFxuICAgICMgICAwMDAwMDAwMCAgIDAwMDAwMDAwICAgIDAwMDAwMDAgICAgICAgICAwMDAgIDAwMDAwMDAwICAgMDAwMDAwMCAgMDAwMDAwMDAwICAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwXG4gICAgIyAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgICAgIDAwMCAgMDAwICAgICAgIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgMDAwICAgMDAwICAwMDAwICAwMDBcbiAgICAjICAgMDAwMDAwMDAgICAwMDAwMDAwICAgIDAwMCAgIDAwMCAgICAgICAgMDAwICAwMDAwMDAwICAgMDAwICAgICAgICAgIDAwMCAgICAgMDAwICAwMDAgICAwMDAgIDAwMCAwIDAwMFxuICAgICMgICAwMDAgICAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgICAgICAwMDAgICAgICAgICAgMDAwICAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAwMDAwXG4gICAgIyAgIDAwMCAgICAgICAgMDAwICAgMDAwICAgMDAwMDAwMCAgICAwMDAwMDAwICAgMDAwMDAwMDAgICAwMDAwMDAwICAgICAwMDAgICAgIDAwMCAgIDAwMDAwMDAgICAwMDAgICAwMDBcbiAgICBcbiAgICBpbnNpZGVQcm9qZWN0aW9uOiAoKSAtPlxuICAgICAgICBcbiAgICAgICAgcGxheWVyUG9zID0gQHBsYXllci5jdXJyZW50UG9zKClcbiAgICAgICAgcGxheWVyRGlyID0gQHBsYXllci5jdXJyZW50RGlyKClcbiAgICAgICAgcGxheWVyVXAgID0gQHBsYXllci5jdXJyZW50VXAoKVxuICAgICAgICBsb29rQW5nbGUgPSBAcGxheWVyLmxvb2tfYW5nbGVcbiAgICAgICAgXG4gICAgICAgIHBvc0RlbHRhID0gd29ybGQuZ2V0U3BlZWQoKSAvIDEwLjAgIyBzbW9vdGggY2FtZXJhIG1vdmVtZW50IGEgbGl0dGxlIGJpdFxuICAgICAgICBjYW1Qb3MgPSBwbGF5ZXJQb3NcbiAgICAgICAgaWYgbG9va0FuZ2xlIDwgMFxuICAgICAgICAgICAgY2FtUG9zLmFkZCBwbGF5ZXJVcC5tdWwgLTIqbG9va0FuZ2xlLzkwXG4gICAgICAgIEBzZXRQb3NpdGlvbiBAZ2V0UG9zaXRpb24oKS5tdWwoMS4wLXBvc0RlbHRhKS5wbHVzIGNhbVBvcy5tdWwgcG9zRGVsdGFcbiAgICAgICAgICAgIFxuICAgICAgICBpZiBsb29rQW5nbGUgIyBwbGF5ZXIgaXMgbG9va2luZyB1cCBvciBkb3duXG4gICAgICAgICAgICBAc2V0WFZlY3RvciBwbGF5ZXJEaXIuY3Jvc3MocGxheWVyVXApLm5vcm1hbCgpXG4gICAgICAgICAgICByb3QgPSBRdWF0ZXJuaW9uLnJvdGF0aW9uQXJvdW5kVmVjdG9yIGxvb2tBbmdsZSwgQGdldFhWZWN0b3IoKVxuICAgICAgICAgICAgQHNldFlWZWN0b3Igcm90LnJvdGF0ZSBwbGF5ZXJVcCBcbiAgICAgICAgICAgIEBzZXRaVmVjdG9yIHJvdC5yb3RhdGUgcGxheWVyRGlyICMubmVnKClcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgIyBzbW9vdGggY2FtZXJhIHJvdGF0aW9uIGEgbGl0dGxlIGJpdFxuICAgICAgICAgICAgbG9va0RlbHRhID0gKDIuMCAtIEBnZXRaVmVjdG9yKCkuZG90IHBsYXllckRpcikgKiB3b3JsZC5nZXRTcGVlZCgpIC8gNTAuMFxuICAgICAgICAgICAgbmV3TG9va1ZlY3RvciA9IEBnZXRaVmVjdG9yKCkubXVsKDEuMCAtIGxvb2tEZWx0YSkucGx1cyBwbGF5ZXJEaXIubXVsIGxvb2tEZWx0YVxuICAgICAgICAgICAgbmV3TG9va1ZlY3Rvci5ub3JtYWxpemUoKVxuICAgICAgICAgICAgQHNldFhWZWN0b3IgcGxheWVyVXAuY3Jvc3MobmV3TG9va1ZlY3Rvcikubm9ybWFsKClcbiAgICAgICAgICAgIEBzZXRZVmVjdG9yIHBsYXllclVwXG4gICAgICAgICAgICBAc2V0WlZlY3RvciBuZXdMb29rVmVjdG9yXG4gICAgICAgICAgICBcbiAgICAgICAgQHByb2plY3Rpb25cbiAgICBcbiAgICAjICAgMDAwMDAwMCAgICAwMDAwMDAwMCAgMDAwICAgMDAwICAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgXG4gICAgIyAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAwMDAwICAwMDAgIDAwMCAgIDAwMFxuICAgICMgICAwMDAwMDAwICAgIDAwMDAwMDAgICAwMDAwMDAwMDAgIDAwMCAgMDAwIDAgMDAwICAwMDAgICAwMDBcbiAgICAjICAgMDAwICAgMDAwICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgIDAwMCAgMDAwMCAgMDAwICAgMDAwXG4gICAgIyAgIDAwMDAwMDAgICAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwICAwMDAgICAwMDAgIDAwMDAwMDAgIFxuICAgIFxuICAgIGJlaGluZFByb2plY3Rpb246ICgpIC0+XG4gICAgICAgIHBsYXllclBvcyA9IEBwbGF5ZXIuY3VycmVudFBvcygpXG4gICAgICAgIHBsYXllckRpciA9IEBwbGF5ZXIuY3VycmVudERpcigpXG4gICAgICAgIHBsYXllclVwICA9IEBwbGF5ZXIuY3VycmVudFVwKClcbiAgICAgICAgbG9va0FuZ2xlID0gQHBsYXllci5sb29rX2FuZ2xlXG4gICAgICAgIFxuICAgICAgICAjIGZpbmQgYSB2YWxpZCBjYW1lcmEgcG9zaXRpb25cbiAgICAgICAgYm90VG9DYW1lcmEgPSBwbGF5ZXJVcC5taW51cyBwbGF5ZXJEaXIubXVsIDJcbiAgICAgICAgbWluX2YgPSBib3RUb0NhbWVyYS5sZW5ndGgoKVxuICAgICAgICBib3RUb0NhbWVyYS5ub3JtYWxpemUoKVxuICAgICAgICBcbiAgICAgICAgbWluX2YgPSBNYXRoLm1pbiB3b3JsZC5nZXRXYWxsRGlzdGFuY2VGb3JSYXkocGxheWVyUG9zLCBib3RUb0NhbWVyYSksIG1pbl9mXG4gICAgICAgIGNhbVBvcyA9IHBsYXllclBvcy5wbHVzIGJvdFRvQ2FtZXJhLm11bCBNYXRoLm1heChtaW5fZiwgMC43MikgKiAoMS1NYXRoLmFicyhsb29rQW5nbGUpLzkwKVxuICAgICAgICBpZiBsb29rQW5nbGUgPCAwXG4gICAgICAgICAgICBjYW1Qb3MuYWRkIHBsYXllclVwLm11bCAtMipsb29rQW5nbGUvOTBcbiAgICAgICAgXG4gICAgICAgIGNhbVBvcyA9IHdvcmxkLmdldEluc2lkZVdhbGxQb3NXaXRoRGVsdGEgY2FtUG9zLCAwLjJcbiAgICAgICAgICAgIFxuICAgICAgICAjIHNtb290aCBjYW1lcmEgbW92ZW1lbnQgYSBsaXR0bGUgYml0XG4gICAgICAgIHBvc0RlbHRhID0gMC4yXG4gICAgICAgIEBzZXRQb3NpdGlvbiBAZ2V0UG9zaXRpb24oKS5tdWwoMS4wIC0gcG9zRGVsdGEpLnBsdXMgY2FtUG9zLm11bCBwb3NEZWx0YVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgaWYgbG9va0FuZ2xlXG4gICAgICAgICAgICAjIGtsb2cgXCJsb29rX2FuZ2xlICN7bG9va0FuZ2xlfVwiXG4gICAgICAgICAgICBAc2V0WFZlY3RvciBwbGF5ZXJEaXIuY3Jvc3MocGxheWVyVXApLm5vcm1hbCgpIFxuICAgICAgICAgICAgcm90ID0gUXVhdGVybmlvbi5yb3RhdGlvbkFyb3VuZFZlY3RvciBsb29rQW5nbGUsIEBnZXRYVmVjdG9yKCkgXG4gICAgICAgICAgICBAc2V0WVZlY3RvciByb3Qucm90YXRlIHBsYXllclVwICBcbiAgICAgICAgICAgIEBzZXRaVmVjdG9yIHJvdC5yb3RhdGUgcGxheWVyRGlyICMubmVnKCkgIFxuICAgICAgICBlbHNlXG4gICAgICAgICAgICAjIHNtb290aCBjYW1lcmEgcm90YXRpb24gYSBsaXR0bGUgYml0XG4gICAgICAgICAgICBsb29rRGVsdGEgPSAwLjNcbiAgICAgICAgICAgIG5ld0xvb2tWZWN0b3IgPSBAZ2V0WlZlY3RvcigpLm11bCgxLjAgLSBsb29rRGVsdGEpLnBsdXMgKHBsYXllckRpci5taW51cyhwbGF5ZXJVcC5tdWwoMC4yKSkubm9ybWFsKCkpLm11bCBsb29rRGVsdGFcbiAgICAgICAgICAgIG5ld0xvb2tWZWN0b3Iubm9ybWFsaXplKClcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgQHNldFpWZWN0b3IgbmV3TG9va1ZlY3RvciAgXG4gICAgICAgICAgICBAc2V0WFZlY3RvciBwbGF5ZXJVcC5jcm9zcyhuZXdMb29rVmVjdG9yKS5ub3JtYWwoKSBcbiAgICAgICAgICAgIEBzZXRZVmVjdG9yIG5ld0xvb2tWZWN0b3IuY3Jvc3MoQGdldFhWZWN0b3IoKSkubm9ybWFsKCkgXG4gICAgICAgIFxuICAgICMgICAwMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAgICAgICAwMDAgICAgICAgMDAwMDAwMCAgIDAwMCAgIDAwMFxuICAgICMgICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAgICAwMDAgICAgICAwMDAgICAwMDAgIDAwMCAwIDAwMFxuICAgICMgICAwMDAwMDAgICAgMDAwICAgMDAwICAwMDAgICAgICAwMDAgICAgICAwMDAgICAwMDAgIDAwMDAwMDAwMFxuICAgICMgICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAgICAwMDAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMFxuICAgICMgICAwMDAgICAgICAgIDAwMDAwMDAgICAwMDAwMDAwICAwMDAwMDAwICAgMDAwMDAwMCAgIDAwICAgICAwMFxuXG4gICAgZm9sbG93UHJvamVjdGlvbjogKCkgLT5cbiAgICAgICAgXG4gICAgICAgIGNhbVBvcyA9IEBnZXRQb3NpdGlvbigpXG4gICAgICAgIGRlc2lyZWREaXN0YW5jZSA9IDIuMCAjIGRlc2lyZWQgZGlzdGFuY2UgZnJvbSBjYW1lcmEgdG8gYm90XG4gICAgXG4gICAgICAgIHBsYXllclBvcyAgID0gQHBsYXllci5jdXJyZW50UG9zKClcbiAgICAgICAgcGxheWVyRGlyICAgPSBAcGxheWVyLmN1cnJlbnREaXIoKVxuICAgICAgICBwbGF5ZXJVcCAgICA9IEBwbGF5ZXIuY3VycmVudFVwKClcbiAgICAgICAgcGxheWVyTGVmdCAgPSBAcGxheWVyLmN1cnJlbnRMZWZ0KClcbiAgICBcbiAgICAgICAgIyBmaXJzdCwgYWRqdXN0IGRpc3RhbmNlIGZyb20gY2FtZXJhIHRvIGJvdFxuICAgICAgICAgXG4gICAgICAgIGJvdFRvQ2FtZXJhID0gY2FtUG9zLm1pbnVzIHBsYXllclBvcyAgICAgIyB2ZWN0b3IgZnJvbSBib3QgdG8gY3VycmVudCBwb3NcbiAgICAgICAgY2FtZXJhQm90RGlzdGFuY2UgPSBib3RUb0NhbWVyYS5sZW5ndGgoKSAjIGRpc3RhbmNlIGZyb20gY2FtZXJhIHRvIGJvdFxuICAgICAgICBcbiAgICAgICAgaWYgY2FtZXJhQm90RGlzdGFuY2UgPj0gZGVzaXJlZERpc3RhbmNlXG4gICAgICAgICAgICBkaWZmZXJlbmNlID0gY2FtZXJhQm90RGlzdGFuY2UgLSBkZXNpcmVkRGlzdGFuY2VcbiAgICAgICAgICAgIGRlbHRhID0gZGlmZmVyZW5jZSpkaWZmZXJlbmNlLzQwMC4wICAjIHdlaWdodCBmb3IgZm9sbG93aW5nIHNwZWVkXG4gICAgICAgICAgICBjYW1Qb3MgPSBjYW1Qb3MubXVsKDEuMC1kZWx0YSkucGx1cyBwbGF5ZXJQb3MubXVsIGRlbHRhXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGRpZmZlcmVuY2UgPSBkZXNpcmVkRGlzdGFuY2UgLSBjYW1lcmFCb3REaXN0YW5jZVxuICAgICAgICAgICAgZGVsdGEgPSBkaWZmZXJlbmNlLzIwLjAgIyB3ZWlnaHQgZm9yIG5lZ2F0aXZlIGZvbGxvd2luZyBzcGVlZFxuICAgICAgICAgICAgY2FtUG9zID0gY2FtUG9zLm11bCgxLjAtZGVsdGEpLnBsdXMgKHBsYXllclBvcy5wbHVzIGJvdFRvQ2FtZXJhLm5vcm1hbCgpLm11bCBkZXNpcmVkRGlzdGFuY2UpLm11bCBkZWx0YVxuICAgIFxuICAgICAgICAjIHNlY29uZCwgcm90YXRlIGFyb3VuZCBib3RcbiAgICBcbiAgICAgICAgYm90VG9DYW1lcmEgPSBjYW1Qb3MubWludXMgcGxheWVyUG9zXG4gICAgICAgIGJvdFRvQ2FtZXJhTm9ybWFsID0gYm90VG9DYW1lcmEubm9ybWFsKClcbiAgICAgXG4gICAgICAgICMgcm90YXRlIGNhbWVyYSB2ZXJ0aWNhbGx5XG4gICAgICAgIHZlcnRpY2FsQW5nbGUgPSBWZWN0b3IuUkFEMkRFRyBNYXRoLmFjb3MoY2xhbXAoLTEuMCwgMS4wLCBib3RUb0NhbWVyYU5vcm1hbC5kb3QgcGxheWVyVXApKVxuICAgICAgICBpZiB2ZXJ0aWNhbEFuZ2xlID4gNDVcbiAgICAgICAgICAgICMga2xvZyBcInZlcnRpY2FsQW5nbGUgI3t2ZXJ0aWNhbEFuZ2xlfVwiXG4gICAgICAgICAgICByb3RRdWF0ICAgICA9IFF1YXRlcm5pb24ucm90YXRpb25Bcm91bmRWZWN0b3IodmVydGljYWxBbmdsZS80MDAuMCwgYm90VG9DYW1lcmFOb3JtYWwuY3Jvc3MocGxheWVyVXApKVxuICAgICAgICAgICAgYm90VG9DYW1lcmEgPSByb3RRdWF0LnJvdGF0ZSBib3RUb0NhbWVyYSBcbiAgICAgICAgICAgIGJvdFRvQ2FtZXJhTm9ybWFsID0gYm90VG9DYW1lcmEubm9ybWFsKClcbiAgICAgICAgICAgIGNhbVBvcyAgICAgID0gcGxheWVyUG9zLnBsdXMgYm90VG9DYW1lcmFcblxuICAgICAgICByb3RGYWN0b3IgPSAxLjBcblxuICAgICAgICB3YWxsX2Rpc3RhbmNlID0gd29ybGQuZ2V0V2FsbERpc3RhbmNlRm9yUG9zIGNhbVBvc1xuICAgICAgICBpZiB3YWxsX2Rpc3RhbmNlIDwgMC41ICMgdHJ5IGF2b2lkIHBpZXJjaW5nIHdhbGxzXG4gICAgICAgICAgICBpZiB3YWxsX2Rpc3RhbmNlIDwgMC4yXG4gICAgICAgICAgICAgICAgY2FtUG9zID0gd29ybGQuZ2V0SW5zaWRlV2FsbFBvc1dpdGhEZWx0YSBjYW1Qb3MsIDAuMlxuICAgICAgICAgICAgICAgIGJvdFRvQ2FtZXJhID0gY2FtUG9zLm1pbnVzIHBsYXllclBvc1xuICAgICAgICAgICAgICAgIGJvdFRvQ2FtZXJhTm9ybWFsID0gYm90VG9DYW1lcmEubm9ybWFsKClcbiAgICAgICAgICAgIHJvdEZhY3RvciA9IDAuNSAvICh3YWxsX2Rpc3RhbmNlLTAuMilcbiAgICAgXG4gICAgICAgICMgdHJ5IHZpZXcgYm90IGZyb20gYmVoaW5kXG4gICAgICAgICMgY2FsY3VsYXRlIGhvcml6b250YWwgYW5nbGUgYmV0d2VlbiBib3Qgb3JpZW50YXRpb24gYW5kIHZlY3RvciB0byBjYW1lcmFcbiAgICAgICAgbWFwcGVkVG9YWiA9IChib3RUb0NhbWVyYS5taW51cyBwbGF5ZXJVcC5tdWwoYm90VG9DYW1lcmEuZG90IHBsYXllclVwKSkubm9ybWFsKClcbiAgICAgICAgaG9yaXpvbnRhbEFuZ2xlID0gVmVjdG9yLlJBRDJERUcgTWF0aC5hY29zKGNsYW1wKC0xLjAsIDEuMCwgLXBsYXllckRpci5kb3QgbWFwcGVkVG9YWikpXG4gICAgICAgIGlmIGJvdFRvQ2FtZXJhTm9ybWFsLmRvdChwbGF5ZXJMZWZ0KSA8IDBcbiAgICAgICAgICAgIGhvcml6b250YWxBbmdsZSA9IC1ob3Jpem9udGFsQW5nbGVcbiAgICAgICAgcm90UXVhdCA9IFF1YXRlcm5pb24ucm90YXRpb25Bcm91bmRWZWN0b3IgaG9yaXpvbnRhbEFuZ2xlLyhyb3RGYWN0b3IqNDAwLjApLCBwbGF5ZXJVcCBcbiAgICAgICAgY2FtUG9zID0gcGxheWVyUG9zLnBsdXMgcm90UXVhdC5yb3RhdGUgYm90VG9DYW1lcmFcblxuICAgICAgICBib3RUb0NhbWVyYSA9IGNhbVBvcy5taW51cyBwbGF5ZXJQb3NcbiAgICAgICAgYm90VG9DYW1lcmFOb3JtYWwgPSBib3RUb0NhbWVyYS5ub3JtYWwoKVxuICAgIFxuICAgICAgICBAc2V0UG9zaXRpb24gY2FtUG9zICMgZmluYWxseSwgc2V0IHRoZSBwb3NpdGlvblxuICAgICAgICBcbiAgICAgICAgIyBzbG93bHkgYWRqdXN0IGxvb2sgZGlyZWN0aW9uIGJ5IGludGVycG9sYXRpbmcgY3VycmVudCBhbmQgZGVzaXJlZCBkaXJlY3Rpb25zXG4gICAgICAgIGxvb2tEZWx0YSA9IEBnZXRaVmVjdG9yKCkuZG90IGJvdFRvQ2FtZXJhTm9ybWFsXG4gICAgICAgIGxvb2tEZWx0YSAqPSBsb29rRGVsdGEgLyAzMC4wICAgIFxuICAgICAgICBuZXdMb29rVmVjdG9yID0gQGdldFpWZWN0b3IoKS5tdWwoMS4wLWxvb2tEZWx0YSkucGx1cyBib3RUb0NhbWVyYU5vcm1hbC5uZWcoKS5tdWwobG9va0RlbHRhKVxuICAgICAgICBuZXdMb29rVmVjdG9yLm5vcm1hbGl6ZSgpXG4gICAgICAgIFxuICAgICAgICAjIHNsb3dseSBhZGp1c3QgdXAgdmVjdG9yIGJ5IGludGVycG9sYXRpbmcgY3VycmVudCBhbmQgZGVzaXJlZCB1cCB2ZWN0b3JzXG4gICAgICAgIHVwRGVsdGEgPSAxLjUtQGdldFlWZWN0b3IoKS5kb3QgcGxheWVyVXBcbiAgICAgICAgdXBEZWx0YSAqPSB1cERlbHRhIC8gMTAwLjAgICAgXG4gICAgICAgIG5ld1VwVmVjdG9yID0gQGdldFlWZWN0b3IoKS5tdWwoMS4wLXVwRGVsdGEpLnBsdXMgcGxheWVyVXAubXVsKHVwRGVsdGEpXG4gICAgICAgIG5ld1VwVmVjdG9yLm5vcm1hbGl6ZSgpXG4gICAgICAgIFxuICAgICAgICBuZXdMZWZ0VmVjdG9yID0gbmV3VXBWZWN0b3IuY3Jvc3MgbmV3TG9va1ZlY3RvclxuICAgIFxuICAgICAgICAjIGZpbmlzaGVkIGludGVycG9sYXRpb25zLCB1cGRhdGUgY2FtZXJhIG1hdHJpeFxuICAgICAgICBAc2V0WFZlY3RvciBuZXdMZWZ0VmVjdG9yXG4gICAgICAgIEBzZXRZVmVjdG9yIG5ld1VwVmVjdG9yXG4gICAgICAgIEBzZXRaVmVjdG9yIG5ld0xvb2tWZWN0b3JcbiAgICAgICAgQHByb2plY3Rpb25cbiAgICAgICAgXG5tb2R1bGUuZXhwb3J0cyA9IENhbWVyYSJdfQ==
//# sourceURL=../coffee/camera.coffee