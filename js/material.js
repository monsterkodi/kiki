// koffee 1.4.0
module.exports = {
    glow: new THREE.SpriteMaterial({
        map: new THREE.TextureLoader().load(__dirname + "/../img/glow.png"),
        blending: THREE.AdditiveBlending
    }),
    bulb: new THREE.MeshLambertMaterial({
        side: THREE.FrontSide,
        transparent: true,
        opacity: 0.7,
        emissiveIntensity: 0.9
    }),
    player: new THREE.MeshPhongMaterial({
        side: THREE.FrontSide,
        transparent: true,
        opacity: 1,
        shininess: 5
    }),
    tire: new THREE.MeshPhongMaterial({
        side: THREE.FrontSide,
        flatShading: true,
        transparent: true,
        opacity: 1
    }),
    text: new THREE.MeshPhongMaterial({
        side: THREE.FrontSide,
        transparent: true
    }),
    menu: new THREE.MeshPhongMaterial({
        side: THREE.FrontSide,
        transparent: true
    }),
    help: new THREE.MeshPhongMaterial({
        side: THREE.FrontSide,
        transparent: true
    }),
    mutant: new THREE.MeshPhongMaterial({
        color: 0x888888,
        side: THREE.FrontSide,
        transparent: true,
        opacity: 1,
        shininess: 5
    }),
    mutantTire: new THREE.MeshPhongMaterial({
        color: 0x555555,
        specular: 0x222222,
        side: THREE.FrontSide,
        flatShading: true,
        transparent: true,
        opacity: 1,
        shininess: 4
    }),
    bullet: new THREE.MeshPhongMaterial({
        side: THREE.FrontSide,
        transparent: true,
        opacity: 0.8,
        shininess: 50,
        depthWrite: false
    }),
    gear: new THREE.MeshPhongMaterial({
        color: 0xff0000,
        side: THREE.FrontSide,
        shininess: 20
    }),
    wire: new THREE.MeshPhongMaterial({
        color: 0xff0000,
        side: THREE.DoubleSide,
        shininess: 40
    }),
    wirePlate: new THREE.MeshPhongMaterial({
        color: 0x880000,
        side: THREE.DoubleSide,
        shininess: 10
    }),
    bomb: new THREE.MeshPhongMaterial({
        color: 0xff0000,
        side: THREE.FrontSide,
        flatShading: true,
        transparent: true,
        opacity: 0.7,
        shininess: 20
    }),
    "switch": new THREE.MeshPhongMaterial({
        color: 0x0000ff,
        side: THREE.FrontSide,
        shininess: 5
    }),
    gate: new THREE.MeshPhongMaterial({
        color: 0xff0000,
        side: THREE.FrontSide,
        shininess: 5
    }),
    raster: new THREE.MeshPhongMaterial({
        side: THREE.FrontSide
    }),
    wall: new THREE.MeshPhongMaterial({
        side: THREE.FrontSide
    }),
    plate: new THREE.MeshPhongMaterial({
        side: THREE.FrontSide,
        emissiveIntensity: 0.05
    }),
    stone: new THREE.MeshPhongMaterial({
        side: THREE.DoubleSide,
        transparent: true
    })
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0ZXJpYWwuanMiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFPQSxNQUFNLENBQUMsT0FBUCxHQUVJO0lBQUEsSUFBQSxFQUFNLElBQUksS0FBSyxDQUFDLGNBQVYsQ0FDRjtRQUFBLEdBQUEsRUFBZ0IsSUFBSSxLQUFLLENBQUMsYUFBVixDQUFBLENBQXlCLENBQUMsSUFBMUIsQ0FBa0MsU0FBRCxHQUFXLGtCQUE1QyxDQUFoQjtRQUNBLFFBQUEsRUFBZ0IsS0FBSyxDQUFDLGdCQUR0QjtLQURFLENBQU47SUFJQSxJQUFBLEVBQU0sSUFBSSxLQUFLLENBQUMsbUJBQVYsQ0FDRjtRQUFBLElBQUEsRUFBZ0IsS0FBSyxDQUFDLFNBQXRCO1FBQ0EsV0FBQSxFQUFnQixJQURoQjtRQUVBLE9BQUEsRUFBZ0IsR0FGaEI7UUFHQSxpQkFBQSxFQUFtQixHQUhuQjtLQURFLENBSk47SUFVQSxNQUFBLEVBQVEsSUFBSSxLQUFLLENBQUMsaUJBQVYsQ0FDSjtRQUFBLElBQUEsRUFBZ0IsS0FBSyxDQUFDLFNBQXRCO1FBQ0EsV0FBQSxFQUFnQixJQURoQjtRQUVBLE9BQUEsRUFBZ0IsQ0FGaEI7UUFHQSxTQUFBLEVBQWdCLENBSGhCO0tBREksQ0FWUjtJQWdCQSxJQUFBLEVBQU0sSUFBSSxLQUFLLENBQUMsaUJBQVYsQ0FDRjtRQUFBLElBQUEsRUFBZ0IsS0FBSyxDQUFDLFNBQXRCO1FBQ0EsV0FBQSxFQUFnQixJQURoQjtRQUVBLFdBQUEsRUFBZ0IsSUFGaEI7UUFHQSxPQUFBLEVBQWdCLENBSGhCO0tBREUsQ0FoQk47SUFzQkEsSUFBQSxFQUFNLElBQUksS0FBSyxDQUFDLGlCQUFWLENBQ0Y7UUFBQSxJQUFBLEVBQWdCLEtBQUssQ0FBQyxTQUF0QjtRQUNBLFdBQUEsRUFBZ0IsSUFEaEI7S0FERSxDQXRCTjtJQTBCQSxJQUFBLEVBQU0sSUFBSSxLQUFLLENBQUMsaUJBQVYsQ0FDRjtRQUFBLElBQUEsRUFBZ0Is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SyxDQUFDLFNBQXRCO1FBQ0EsaUJBQUEsRUFBbUIsSUFEbkI7S0FERyxDQWhHUDtJQW9HQSxLQUFBLEVBQU8sSUFBSSxLQUFLLENBQUMsaUJBQVYsQ0FDSDtRQUFBLElBQUEsRUFBZ0IsS0FBSyxDQUFDLFVBQXRCO1FBQ0EsV0FBQSxFQUFnQixJQURoQjtLQURHLENBcEdQIiwic291cmNlc0NvbnRlbnQiOlsiXG4jICAgMDAgICAgIDAwICAgMDAwMDAwMCAgIDAwMDAwMDAwMCAgMDAwMDAwMDAgIDAwMDAwMDAwICAgMDAwICAgMDAwMDAwMCAgIDAwMCAgICBcbiMgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgIFxuIyAgIDAwMDAwMDAwMCAgMDAwMDAwMDAwICAgICAwMDAgICAgIDAwMDAwMDAgICAwMDAwMDAwICAgIDAwMCAgMDAwMDAwMDAwICAwMDAgICAgXG4jICAgMDAwIDAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgICAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAwMDAgICAwMDAgIDAwMCAgICBcbiMgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAwMDAwMDAwMCAgMDAwICAgMDAwICAwMDAgIDAwMCAgIDAwMCAgMDAwMDAwMFxuXG5tb2R1bGUuZXhwb3J0cyA9XG5cbiAgICBnbG93OiBuZXcgVEhSRUUuU3ByaXRlTWF0ZXJpYWwgXG4gICAgICAgIG1hcDogICAgICAgICAgICBuZXcgVEhSRUUuVGV4dHVyZUxvYWRlcigpLmxvYWQgXCIje19fZGlybmFtZX0vLi4vaW1nL2dsb3cucG5nXCJcbiAgICAgICAgYmxlbmRpbmc6ICAgICAgIFRIUkVFLkFkZGl0aXZlQmxlbmRpbmdcblxuICAgIGJ1bGI6IG5ldyBUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsXG4gICAgICAgIHNpZGU6ICAgICAgICAgICBUSFJFRS5Gcm9udFNpZGVcbiAgICAgICAgdHJhbnNwYXJlbnQ6ICAgIHRydWVcbiAgICAgICAgb3BhY2l0eTogICAgICAgIDAuN1xuICAgICAgICBlbWlzc2l2ZUludGVuc2l0eTogMC45XG5cbiAgICBwbGF5ZXI6IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbFxuICAgICAgICBzaWRlOiAgICAgICAgICAgVEhSRUUuRnJvbnRTaWRlXG4gICAgICAgIHRyYW5zcGFyZW50OiAgICB0cnVlXG4gICAgICAgIG9wYWNpdHk6ICAgICAgICAxXG4gICAgICAgIHNoaW5pbmVzczogICAgICA1XG4gICAgICAgICAgICAgICAgICAgIFxuICAgIHRpcmU6IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCBcbiAgICAgICAgc2lkZTogICAgICAgICAgIFRIUkVFLkZyb250U2lkZVxuICAgICAgICBmbGF0U2hhZGluZzogICAgdHJ1ZVxuICAgICAgICB0cmFuc3BhcmVudDogICAgdHJ1ZVxuICAgICAgICBvcGFjaXR5OiAgICAgICAgMVxuXG4gICAgdGV4dDogbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsIFxuICAgICAgICBzaWRlOiAgICAgICAgICAgVEhSRUUuRnJvbnRTaWRlXG4gICAgICAgIHRyYW5zcGFyZW50OiAgICB0cnVlXG5cbiAgICBtZW51OiBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwgXG4gICAgICAgIHNpZGU6ICAgICAgICAgICBUSFJFRS5Gcm9udFNpZGVcbiAgICAgICAgdHJhbnNwYXJlbnQ6ICAgIHRydWVcbiAgICAgICAgXG4gICAgaGVscDogbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsIFxuICAgICAgICBzaWRlOiAgICAgICAgICAgVEhSRUUuRnJvbnRTaWRlXG4gICAgICAgIHRyYW5zcGFyZW50OiAgICB0cnVlXG5cbiAgICBtdXRhbnQ6IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbFxuICAgICAgICBjb2xvcjogICAgICAgICAgMHg4ODg4ODhcbiAgICAgICAgc2lkZTogICAgICAgICAgIFRIUkVFLkZyb250U2lkZVxuICAgICAgICB0cmFuc3BhcmVudDogICAgdHJ1ZVxuICAgICAgICBvcGFjaXR5OiAgICAgICAgMVxuICAgICAgICBzaGluaW5lc3M6ICAgICAgNVxuXG4gICAgbXV0YW50VGlyZTogbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsIFxuICAgICAgICBjb2xvcjogICAgICAgICAgMHg1NTU1NTVcbiAgICAgICAgc3BlY3VsYXI6ICAgICAgIDB4MjIyMjIyXG4gICAgICAgIHNpZGU6ICAgICAgICAgICBUSFJFRS5Gcm9udFNpZGVcbiAgICAgICAgZmxhdFNoYWRpbmc6ICAgIHRydWVcbiAgICAgICAgdHJhbnNwYXJlbnQ6ICAgIHRydWVcbiAgICAgICAgb3BhY2l0eTogICAgICAgIDFcbiAgICAgICAgc2hpbmluZXNzOiAgICAgIDRcbiAgICAgICAgXG4gICAgYnVsbGV0OiBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwgXG4gICAgICAgIHNpZGU6ICAgICAgICAgICBUSFJFRS5Gcm9udFNpZGVcbiAgICAgICAgdHJhbnNwYXJlbnQ6ICAgIHRydWVcbiAgICAgICAgb3BhY2l0eTogICAgICAgIDAuOFxuICAgICAgICBzaGluaW5lc3M6ICAgICAgNTBcbiAgICAgICAgZGVwdGhXcml0ZTogICAgIGZhbHNlXG4gICAgXG4gICAgZ2VhcjogbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsIFxuICAgICAgICBjb2xvcjogICAgICAgICAgMHhmZjAwMDBcbiAgICAgICAgc2lkZTogICAgICAgICAgIFRIUkVFLkZyb250U2lkZVxuICAgICAgICBzaGluaW5lc3M6ICAgICAgMjBcblxuICAgIHdpcmU6IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCBcbiAgICAgICAgY29sb3I6ICAgICAgICAgIDB4ZmYwMDAwXG4gICAgICAgIHNpZGU6ICAgICAgICAgICBUSFJFRS5Eb3VibGVTaWRlXG4gICAgICAgIHNoaW5pbmVzczogICAgICA0MFxuXG4gICAgd2lyZVBsYXRlOiBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwgXG4gICAgICAgIGNvbG9yOiAgICAgICAgICAweDg4MDAwMFxuICAgICAgICBzaWRlOiAgICAgICAgICAgVEhSRUUuRG91YmxlU2lkZVxuICAgICAgICBzaGluaW5lc3M6ICAgICAgMTBcblxuICAgIGJvbWI6IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCBcbiAgICAgICAgY29sb3I6ICAgICAgICAgIDB4ZmYwMDAwXG4gICAgICAgIHNpZGU6ICAgICAgICAgICBUSFJFRS5Gcm9udFNpZGVcbiAgICAgICAgZmxhdFNoYWRpbmc6ICAgIHRydWVcbiAgICAgICAgdHJhbnNwYXJlbnQ6ICAgIHRydWVcbiAgICAgICAgb3BhY2l0eTogICAgICAgIDAuN1xuICAgICAgICBzaGluaW5lc3M6ICAgICAgMjBcblxuICAgIHN3aXRjaDogbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsIFxuICAgICAgICBjb2xvcjogICAgICAgICAgMHgwMDAwZmZcbiAgICAgICAgc2lkZTogICAgICAgICAgIFRIUkVFLkZyb250U2lkZVxuICAgICAgICBzaGluaW5lc3M6ICAgICAgNVxuXG4gICAgZ2F0ZTogbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsIFxuICAgICAgICBjb2xvcjogICAgICAgICAgMHhmZjAwMDBcbiAgICAgICAgc2lkZTogICAgICAgICAgIFRIUkVFLkZyb250U2lkZVxuICAgICAgICBzaGluaW5lc3M6ICAgICAgNVxuICAgIFxuICAgIHJhc3RlcjogbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsIFxuICAgICAgICBzaWRlOiAgICAgICAgICAgVEhSRUUuRnJvbnRTaWRlXG5cbiAgICB3YWxsOiBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwgXG4gICAgICAgIHNpZGU6ICAgICAgICAgICBUSFJFRS5Gcm9udFNpZGVcbiAgICAgICAgICBcbiAgICBwbGF0ZTogbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsIFxuICAgICAgICBzaWRlOiAgICAgICAgICAgVEhSRUUuRnJvbnRTaWRlXG4gICAgICAgIGVtaXNzaXZlSW50ZW5zaXR5OiAwLjA1XG5cbiAgICBzdG9uZTogbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsIFxuICAgICAgICBzaWRlOiAgICAgICAgICAgVEhSRUUuRG91YmxlU2lkZVxuICAgICAgICB0cmFuc3BhcmVudDogICAgdHJ1ZVxuICAgICJdfQ==
//# sourceURL=../coffee/material.coffee