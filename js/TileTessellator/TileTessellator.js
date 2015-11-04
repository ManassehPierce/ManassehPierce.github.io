var TileTessellator, terrain, container;
var baseMesh, baseGeometry, baseMaterial, northPlane, southPlane, eastPlane, westPlane;
var metaMapped = [];

$(document).ready(function(){
	var gui = new TileTessellatorGui();
	gui.init();
	init();
});

function init() {
	mapMeta();
	container = document.getElementById('container');
	
	TileTessellator = new EngineRenderer(container, true, false, false);
	TileTessellator.init();
	TileTessellator.render();
	
	TileTessellator.light.castShadow = true;
	TileTessellator.light.shadowDarkness = 0.5;
	TileTessellator.light.needsUpdate = true;
	
	TileTessellator.scene.remove(TileTessellator.ambeintLight);
	
	terrain = TileTessellator.tgaLoader.load('assets/terrain-atlas.tga', function(tex){
		tex.magFilter = THREE.NearestFilter;
		tex.minFilter = THREE.LinearMipMapLinearFilter;
	});
	
	var planeGeometry = new THREE.PlaneGeometry(1, 1);
	
	var nTex = THREE.ImageUtils.loadTexture("assets/north.png");
	nTex.magFilter = THREE.NearestFilter;
	nTex.minFilter = THREE.LinearMipMapLinearFilter;
	var sTex = THREE.ImageUtils.loadTexture("assets/south.png");
	sTex.magFilter = THREE.NearestFilter;
	sTex.minFilter = THREE.LinearMipMapLinearFilter;
	var eTex = THREE.ImageUtils.loadTexture("assets/east.png");
	eTex.magFilter = THREE.NearestFilter;
	eTex.minFilter = THREE.LinearMipMapLinearFilter;
	var wTex = THREE.ImageUtils.loadTexture("assets/west.png");
	wTex.magFilter = THREE.NearestFilter;
	wTex.minFilter = THREE.LinearMipMapLinearFilter;
	
	northPlane = new THREE.Mesh(planeGeometry, new THREE.MeshLambertMaterial({map: nTex, side: THREE.DoubleSide, transparent: true}));
	northPlane.position.z = -0.501;
	northPlane.position.y = -0.5;
	northPlane.rotation.y = Math.PI / - 1;
	TileTessellator.scene.add(northPlane);
	
	southPlane = new THREE.Mesh(planeGeometry, new THREE.MeshLambertMaterial({map: sTex, side: THREE.DoubleSide, transparent: true}));
	southPlane.position.z = +0.501;
	southPlane.position.y = -0.5;
	southPlane.rotation.z = Math.PI / - 1;
	TileTessellator.scene.add(southPlane);
	
	eastPlane = new THREE.Mesh(planeGeometry, new THREE.MeshLambertMaterial({map: eTex, side: THREE.DoubleSide, transparent: true}));
	eastPlane.position.x = +0.501;
	eastPlane.position.y = -0.5;
	eastPlane.rotation.y = Math.PI / 2;
	TileTessellator.scene.add(eastPlane);
	
	westPlane = new THREE.Mesh(planeGeometry, new THREE.MeshLambertMaterial({map: wTex, side: THREE.DoubleSide, transparent: true}));
	westPlane.position.x = -0.501;
	westPlane.position.y = -0.5;
	westPlane.rotation.y = Math.PI / 2;
	TileTessellator.scene.add(westPlane);
	
	baseMaterial = new THREE.MeshLambertMaterial({map: terrain, side: THREE.FrontSide});
	baseGeometry = new THREE.CubeGeometry(1, 1, 1, 1, 1, 1);
	setBoundFaces(baseGeometry, ['planks']);
	baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);
	baseMesh.castShadow = true;
	baseMesh.recieveShadow = true;
	baseMesh.position.set(0, -0.5, 0);
	TileTessellator.scene.add(baseMesh);
}

var showBaseMesh = true;
function toggleBaseMesh() {
	if(showBaseMesh){
		TileTessellator.scene.remove(baseMesh);
	}
	else if(!showBaseMesh){
		TileTessellator.scene.add(baseMesh);
	}
	showBaseMesh = !showBaseMesh;
}

var showCompass = true;
function toggleCompass() {
	if(showCompass){
		TileTessellator.scene.remove(northPlane);
		TileTessellator.scene.remove(southPlane);
		TileTessellator.scene.remove(eastPlane);
		TileTessellator.scene.remove(westPlane);
	}
	else if(!showCompass){
		TileTessellator.scene.add(northPlane);
		TileTessellator.scene.add(southPlane);
		TileTessellator.scene.add(eastPlane);
		TileTessellator.scene.add(westPlane);
	}
	showCompass = !showCompass;
}

var importBounds = function(content){
	alert(content);
	var splitByLines = content.split('\n');
	alert(splitByLines.length);
	for(var i=0;i<splitByLines.length;i++) {
		alert(splitByLines[i]);
		if(splitByLines[i].split('(')[0] == 'setRenderBound') {
			var par = splitByLines[i].split('(')[1].split(')')[0].split(',');
			renderBound(parseFloat(par[0]), parseFloat(par[1]), parseFloat(par[2]), parseFloat(par[3]), parseFloat(par[4]), parseFloat(par[5]), ['stone', 0], true, 'importBound '+i);
		}
	}
};

var renderBound = function(x1, y1, z1, x2, y2, z2, textureArray, isBound, name){
	if(!isBound){
		x1 = x1/16;
		y1 = y1/16;
		z1 = z1/16;
		x2 = x2/16;
		y2 = y2/16;
		z2 = z2/16;
	}
	this.width = x2 - x1;
	this.height = y2 - y1;
	this.depth = z2 - z1;
	
	this.bound = new THREE.CubeGeometry(this.width, this.height, this.depth, 1, 1, 1);
	setBoundFaces(this.bound, textureArray);
	this.material = new THREE.MeshLambertMaterial({map: terrain, transparent: true});
	this.mesh = new THREE.Mesh(this.bound, this.material);
	this.mesh.position.set((this.width/2) + x1 - 0.5, (this.height/2) + y1, (this.depth/2) + z1 - 0.5);
	this.mesh.castShadow = true;
	this.mesh.recieveShadow = true;
	TileTessellator.scene.add(this.mesh);
	
	TileTessellator.voxelBounds.push({mesh: this.mesh, coords: [x1, y1, z1, x2, y2, z2], name: name, texture: textureArray});
};

var deleteBound = function(index){
	TileTessellator.scene.remove(TileTessellator.voxelBounds[index].mesh);
	TileTessellator.voxelBounds.splice(index, 1);
};

var editBound = function(index, x1, y1, z1, x2, y2, z2, textureArray, isBound, name){
	deleteBound(index);
	renderBound(x1, y1, z1, x2, y2, z2, textureArray, isBound, name);
};

var texture = function(tname, data){
	for(var i in metaMapped){
		if(tname == metaMapped[i].name){
			if(metaMapped[i].uvs[data] !== null){
				return textureUV(metaMapped[i].uvs[data][0], metaMapped[i].uvs[data][1], metaMapped[i].uvs[data][2], metaMapped[i].uvs[data][3]);
				break;
			} else {
				return textureUV(metaMapped[i].uvs[0][0], metaMapped[i].uvs[0][1], metaMapped[i].uvs[0][2], metaMapped[i].uvs[0][3]);
				break;
			}
		}
	}
};

var exportBounds = function(name){
	str = "";
	for(var i=0;i<TileTessellator.voxelBounds.length;i++){
		str += "// "+TileTessellator.voxelBounds[i].name+" \nsetRenderBound("+TileTessellator.voxelBounds[i].coords[0]+", "+TileTessellator.voxelBounds[i].coords[1]+", "+TileTessellator.voxelBounds[i].coords[2]+", "+TileTessellator.voxelBounds[i].coords[3]+", "+TileTessellator.voxelBounds[i].coords[4]+", "+TileTessellator.voxelBounds[i].coords[5]+");\n\n";
	}
	download(name+".cpp", str);
};

var textureUV = function(minU, minV, maxU, maxV){
	minU = minU * 16 / 256;
	minV = minV * 16 / 512;
	maxU = maxU * 16 / 256;
	maxV = maxV * 16 / 512;
	var t = [
		new THREE.Vector2(minV, maxU), 
		new THREE.Vector2(minV, minU), 
		new THREE.Vector2(maxV, minU), 
		new THREE.Vector2(maxV, maxU)
	];
	return t;
};

var setBoundFaces = function(bound, tex){
	if(tex.length === 1) tex = [tex[0], 0, tex[0], 0, tex[0], 0, tex[0], 0, tex[0], 0, tex[0], 0];
	if(tex.length === 2) tex = [tex[0], tex[1], tex[0], tex[1], tex[0], tex[1], tex[0], tex[1], tex[0], tex[1], tex[0], tex[1]];
	if(tex.length === 12) tex = [tex[0], tex[1], tex[2], tex[3], tex[4], tex[5], tex[6], tex[7], tex[8], tex[9], tex[10], tex[11]];
	bound.faceVertexUvs[0] = [];
	bound.faceVertexUvs[0][0] = [texture(tex[10],tex[11])[0], texture(tex[10],tex[11])[1], texture(tex[10],tex[11])[3]];
	bound.faceVertexUvs[0][1] = [texture(tex[10],tex[11])[1], texture(tex[10],tex[11])[2], texture(tex[10],tex[11])[3]];
	bound.faceVertexUvs[0][2] = [texture(tex[8],tex[9])[0], texture(tex[8],tex[9])[1], texture(tex[8],tex[9])[3]];
	bound.faceVertexUvs[0][3] = [texture(tex[8],tex[9])[1], texture(tex[8],tex[9])[2], texture(tex[8],tex[9])[3]];
	bound.faceVertexUvs[0][4] = [texture(tex[2],tex[3])[0], texture(tex[2],tex[3])[1], texture(tex[2],tex[3])[3]];
	bound.faceVertexUvs[0][5] = [texture(tex[2],tex[3])[1], texture(tex[2],tex[3])[2], texture(tex[2],tex[3])[3]];
	bound.faceVertexUvs[0][6] = [texture(tex[0],tex[1])[0], texture(tex[0],tex[1])[1], texture(tex[0],tex[1])[3]];
	bound.faceVertexUvs[0][7] = [texture(tex[0],tex[1])[1], texture(tex[0],tex[1])[2], texture(tex[0],tex[1])[3]];
	bound.faceVertexUvs[0][8] = [texture(tex[4],tex[5])[0], texture(tex[4],tex[5])[1], texture(tex[4],tex[5])[3]];
	bound.faceVertexUvs[0][9] = [texture(tex[4],tex[5])[1], texture(tex[4],tex[5])[2], texture(tex[4],tex[5])[3]];
	bound.faceVertexUvs[0][10] = [texture(tex[6],tex[7])[0], texture(tex[6],tex[7])[1], texture(tex[6],tex[7])[3]];
	bound.faceVertexUvs[0][11] = [texture(tex[6],tex[7])[1], texture(tex[6],tex[7])[2], texture(tex[6],tex[7])[3]];
};

var mapMeta = function(){
	for(var i=0;i<META.length;i++){ //152
		metaMapped.push({
			uvs: newUV(META[i].uvs),
			name: META[i].name
		});
	}
};

var opp = function(num, max){
	return max - num;
};

var newUV = function(uvs){
	var arr = [];
	for(var i=0;i<uvs.length;i++){
		arr.push([opp(uvs[i][3]*256/16, 16), uvs[i][0]*512/16, opp(uvs[i][1]*256/16, 16), uvs[i][2]*512/16]);
	}
	return arr;
};

function download(filename, text) {
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);
	element.style.display = 'none';
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
}
