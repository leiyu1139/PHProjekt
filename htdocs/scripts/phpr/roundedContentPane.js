dojo.provide("phpr.roundedContentPane");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit._Templated");
dojo.require("dojox.gfx");
dojo.require("dojo.dnd.TimedMoveable");
			
            
dojo.declare("phpr.roundedContentPane",[dijit.layout.ContentPane,dijit._Templated],{
				// radius: Integer
				//		radius of the corners
				radius:15,
				// moveable: Boolean
				// 		if true, the node is movable by either the containerNode, or an optional node
				//		found by the handle attribute
				moveable:false,
				// handle: String
				// 		a CSS3 selector query to match the handle for this node, scoped to this.domNode
				handle:".handle",
				
				// template:
				templateString:
					'<div><div style="position:relative;">' +
						'<div dojoAttachPoint="surfaceNode"></div>' +
						'<div dojoAttachPoint="containerNode"></div>' +
					'</div></div>',
				
				startup:function(){
					
					this.inherited(arguments);
					this._initSurface();
					dojo.style(this.surfaceNode,{
						position:"absolute",
						top:0,
						left:0
					});
					
					if(this.moveable){
						this._mover = new dojo.dnd.TimedMoveable(this.domNode,{
							handle: dojo.query(this.handle,this.domNode)[0] ||this.containerNode,
							timeout:69
						});
					}
			
				},
				
				_initSurface: function(){
			
					var s = dojo.marginBox(this.domNode);
					var stroke = 2;
					
					this.surface = dojox.gfx.createSurface(this.surfaceNode, s.w + stroke * 2, s.h + stroke * 2);
					this.roundedShape = this.surface.createRect({
							r: this.radius,
							width: s.w,
							height: s.h
						})
						.setFill([0, 0, 0, 0.5]) // black, 50% transparency
						.setStroke({ color:[255,255,255,1], width:stroke }) // solid white
					;
					this.resize(s);
					
				},
				
				resize:function(size){
					
					if(!this.surface){ this._initSurfce(); }
			
					this.surface.setDimensions(size.w,size.h);
					this.roundedShape.setShape({
						width: size.w,
						height: size.h
					});
			
					var _offset = Math.floor(this.radius / 2);		
					dojo.style(this.containerNode,{
						color: "#fff",
						position: "absolute",
						overflow: "auto",
						top: _offset + "px",
						left: _offset + "px",
						height: (size.h - _offset * 2) + "px",
						width: (size.w - _offset * 2) + "px"
					});
					
				}
				
			});