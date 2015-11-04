
var TileTessellatorGui = function(){
	
	var _this = this;
	
	_this.init = function () {
		var openSettings = new _this.button("Settings", 0, 0);
		$("#container").append(openSettings.domElement);
		$(openSettings.domElement).click(function(){$('#settingScreen').removeAttr('hidden');});
		
		var openRender = new _this.button("Render", 76, 0);
		$("#container").append(openRender.domElement);
		$(openRender.domElement).click(function(){$('#renderScreen').removeAttr('hidden');});
		
		var exportBtn = new _this.button("Export", 189, 0);
		$("#container").append(exportBtn.domElement);
		$(exportBtn.domElement).click(function(){$('#exportScreen').removeAttr('hidden');});
		
		var Ebound = true;
		
		var openEdit = new _this.button("Edit", 146, 0);
		$("#container").append(openEdit.domElement);
		$(openEdit.domElement).click(function(){
			$('#editScreen').removeAttr('hidden');
			for(var i=0;i<TileTessellator.voxelBounds.length;i++){
				var index = i;
				var b = new _this.button(TileTessellator.voxelBounds[i].name, 5, 5 + (45 * i));
				$(b.domElement).click(function(){
					$('#editScreen').attr("hidden","true");
					$('#editModal').html("");
					$('#editScreen2').removeAttr('hidden');
					$('#EboundToggle').click(function(){
						Ebound = !Ebound;
						if(!Ebound) {
							$('#EboundToggle').attr('active', 'true').html('Box [0-16]');
							$('#EmaxX').attr('placeholder', '16');
							$('#EmaxY').attr('placeholder', '16');
							$('#EmaxZ').attr('placeholder', '16');
							
							var x1 = $('#EminX').val() * 16;
							var y1 = $('#EminY').val() * 16;
							var z1 = $('#EminZ').val() * 16;
							var x2 = $('#EmaxX').val() * 16;
							var y2 = $('#EmaxY').val() * 16;
							var z2 = $('#EmaxZ').val() * 16;
							$('#EminX').val( x1 );
							$('#EminY').val( y1 );
							$('#EminZ').val( z1 );
							$('#EmaxX').val( x2 );
							$('#EmaxY').val( y2 );
							$('#EmaxZ').val( z2 );
						}
						else if(Ebound) {
							$('#EboundToggle').removeAttr('active').html('Bound [0-1]');
							$('#EmaxX').attr('placeholder', '1');
							$('#EmaxY').attr('placeholder', '1');
							$('#EmaxZ').attr('placeholder', '1');
							
							var x1 = $('#EminX').val() / 16;
							var y1 = $('#EminY').val() / 16;
							var z1 = $('#EminZ').val() / 16;
							var x2 = $('#EmaxX').val() / 16;
							var y2 = $('#EmaxY').val() / 16;
							var z2 = $('#EmaxZ').val() / 16;
							$('#EminX').val( x1 );
							$('#EminY').val( y1 );
							$('#EminZ').val( z1 );
							$('#EmaxX').val( x2 );
							$('#EmaxY').val( y2 );
							$('#EmaxZ').val( z2 );
						}
					});
					var div = 1;
					if(Ebound) div = 1;
					if(!Ebound) div = 16;
					$('#EminX').val(TileTessellator.voxelBounds[index].coords[0] * div);
					$('#EminY').val(TileTessellator.voxelBounds[index].coords[1] * div);
					$('#EminZ').val(TileTessellator.voxelBounds[index].coords[2] * div);
					$('#EmaxX').val(TileTessellator.voxelBounds[index].coords[3] * div);
					$('#EmaxY').val(TileTessellator.voxelBounds[index].coords[4] * div);
					$('#EmaxZ').val(TileTessellator.voxelBounds[index].coords[5] * div);
					var tex = "";
					for(var t=0;t<TileTessellator.voxelBounds[index].texture.length;t++){
						if(t !== TileTessellator.voxelBounds[index].texture.length - 1) tex += TileTessellator.voxelBounds[index].texture[t] + ",";
						else tex += TileTessellator.voxelBounds[index].texture[t];
					}
					$('#Etexture').val(tex);
					$('#Ename').val(TileTessellator.voxelBounds[index].name);
					$('#editBound').click(function(){
						var textureArr = $('#Etexture').val().split(',');
						var textureReal;
						if(textureArr.length === 1){
							textureReal = [textureArr[0]];
						}
						if(textureArr.length === 2){
							textureReal = [textureArr[0], parseInt(textureArr[1])];
						}
						if(textureArr.length === 12){
							textureReal = [textureArr[0], parseInt(textureArr[1]), textureArr[2], parseInt(textureArr[3]), textureArr[4], parseInt(textureArr[5]), textureArr[6], parseInt(textureArr[7]), textureArr[8], parseInt(textureArr[9]), textureArr[10], parseInt(textureArr[11]), ];
						}
						editBound(index, parseFloat($('#EminX').val()), parseFloat($('#EminY').val()), parseFloat($('#EminZ').val()), parseFloat($('#EmaxX').val()), parseFloat($('#EmaxY').val()), parseFloat($('#EmaxZ').val()), textureReal, Ebound, $('#Ename').val());
						$('#editScreen2').attr("hidden","true");
					});
				});
				$("#editModal").append(b.domElement);
				var d = new _this.button('Delete', 5 + $(b.domElement).width() * 2, 5 + (45 * i));
				$(d.domElement).css('color','Red').click(function(){
					deleteBound(index);
					$('#editScreen').attr("hidden","true");
					$('#editModal').html("");
				});
				$("#editModal").append(d.domElement);
			}
		});
		
		_this.settingsScreen();
		_this.renderScreen();
		_this.editScreen();
		_this.editScreen2();
		_this.exportScreen();
	};
	
	_this.exportScreen = function(){
		$('#exportScreen').load('js/TileTessellator/exportScreen.xml', function(){
			$('#exportBound').click(function(){
				$('#exportScreen').attr("hidden","true");
				exportBounds($('#exportName').val());
			});
			$('#importBound').click(function(){
				var file = document.getElementById('importFile').files[0];
				if(file){
					var r = new FileReader();
					r.onload = function(e){
						var contents = e.target.result;
						alert(contents);
						importBounds(contents);
					};
					r.readAsText(file);
					$('#exportScreen').attr("hidden","true");
				}
			});
			$('#closeExport').click(function(){
				$('#exportScreen').attr("hidden","true");
			});
		});
	};
	
	_this.settingsScreen = function(){
		$('#settingScreen').load('js/TileTessellator/settingsScreen.xml', function(){
			$('#toggleAxes').change(function(){TileTessellator.toggleHelperAxes();});
			$('#toggleGrid').change(function(){TileTessellator.toggleHelperGrid();});
			$('#toggleBase').change(function(){toggleBaseMesh();});
			$('#toggleCompass').change(function(){toggleCompass();});
			$('#closeSettings').click(function(){
				$('#settingScreen').attr("hidden","true");
			});
		});
	};
	
	var bound = true;
	
	_this.renderScreen = function() {
		$('#renderScreen').load('js/TileTessellator/renderScreen.xml', function(){
			$('#boundToggle').click(function(){
				bound = !bound;
				if(!bound) {
					$('#boundToggle').attr('active', 'true').html('Box [0-16]');
					$('#maxX').attr('placeholder', '16');
					$('#maxY').attr('placeholder', '16');
					$('#maxZ').attr('placeholder', '16');
				}
				else if(bound) {
					$('#boundToggle').removeAttr('active').html('Bound [0-1]');
					$('#maxX').attr('placeholder', '1');
					$('#maxY').attr('placeholder', '1');
					$('#maxZ').attr('placeholder', '1');
				}
			});
			$('#addBound').click(function(){
				var textureArr = $('#texture').val().split(',');
				var textureReal;
				if(textureArr.length === 1){
					textureReal = [textureArr[0]];
				}
				if(textureArr.length === 2){
					textureReal = [textureArr[0], parseInt(textureArr[1])];
				}
				if(textureArr.length === 12){
					textureReal = [textureArr[0], parseInt(textureArr[1]), textureArr[2], parseInt(textureArr[3]), textureArr[4], parseInt(textureArr[5]), textureArr[6], parseInt(textureArr[7]), textureArr[8], parseInt(textureArr[9]), textureArr[10], parseInt(textureArr[11]), ];
				}
				renderBound(parseFloat($('#minX').val()), parseFloat($('#minY').val()), parseFloat($('#minZ').val()), parseFloat($('#maxX').val()), parseFloat($('#maxY').val()), parseFloat($('#maxZ').val()), textureReal, bound, $('#name').val());
				$('#renderScreen').attr("hidden","true");
			});
			$('#closeRender').click(function(){
				$('#renderScreen').attr("hidden","true");
			});
		});
	};
	
	_this.editScreen = function () {
		$('#editScreen').load('js/TileTessellator/editScreen.xml', function(){
			$('#closeEdit').click(function(){
				$('#editScreen').attr("hidden","true");
				$('#editModal').html("");
			});
		});
	};
	
	_this.editScreen2 = function () {
		$('#editScreen2').load('js/TileTessellator/editScreen2.xml', function(){
			$('#closeEdit2').click(function(){
				$('#editScreen2').attr("hidden","true");
			});
		});
	};
	
	_this.button = function(text, x, y) {
		this.domElement = document.createElement('div');
		$(this.domElement).addClass('minecraft-btn').css('z-index', '100').css('position', 'absolute').css('opacity', '0.7').css('left', x + 'px').css('top', y + 'px').css('margin','0').html(text);
	};
};
