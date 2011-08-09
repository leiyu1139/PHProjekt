/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


dojo._hasResource["dojox.layout.RotatorContainer"]||(dojo._hasResource["dojox.layout.RotatorContainer"]=!0,dojo.provide("dojox.layout.RotatorContainer"),dojo.require("dojo.fx"),dojo.require("dijit.layout.StackContainer"),dojo.require("dijit.layout.StackController"),dojo.require("dijit._Widget"),dojo.require("dijit._Templated"),dojo.require("dijit._Contained"),dojo.declare("dojox.layout.RotatorContainer",[dijit.layout.StackContainer,dijit._Templated],{templateString:'<div class="dojoxRotatorContainer"><div dojoAttachPoint="tabNode"></div><div class="dojoxRotatorPager" dojoAttachPoint="pagerNode"></div><div class="dojoxRotatorContent" dojoAttachPoint="containerNode"></div></div>',
showTabs:!0,transitionDelay:5E3,transition:"fade",transitionDuration:1E3,autoStart:!0,suspendOnHover:!1,pauseOnManualChange:null,reverse:!1,pagerId:"",cycles:-1,pagerClass:"dojox.layout.RotatorPager",postCreate:function(){this.inherited(arguments);dojo.style(this.domNode,"position","relative");this.cycles-0==this.cycles&&this.cycles!=-1?this.cycles++:this.cycles=-1;if(this.pauseOnManualChange===null)this.pauseOnManualChange=!this.suspendOnHover;var a=this.id||"rotator"+(new Date).getTime(),a=new dijit.layout.StackController({containerId:a},
this.tabNode);this.tabNode=a.domNode;this._stackController=a;dojo.style(this.tabNode,"display",this.showTabs?"":"none");this.connect(a,"onButtonClick","_manualChange");this._subscriptions=[dojo.subscribe(this.id+"-cycle",this,"_cycle"),dojo.subscribe(this.id+"-state",this,"_state")];a=Math.round(this.transitionDelay*0.75);if(a<this.transitionDuration)this.transitionDuration=a;this.suspendOnHover&&(this.connect(this.domNode,"onmouseover","_onMouseOver"),this.connect(this.domNode,"onmouseout","_onMouseOut"))},
startup:function(){if(!this._started){for(var a=this.getChildren(),b=0,c=a.length;b<c;b++)if(a[b].declaredClass==this.pagerClass){this.pagerNode.appendChild(a[b].domNode);break}this.inherited(arguments);this.autoStart?setTimeout(dojo.hitch(this,"_play"),10):this._updatePager()}},destroy:function(){dojo.forEach(this._subscriptions,dojo.unsubscribe);this.inherited(arguments)},_setShowTabsAttr:function(a){this.showTabs=a;dojo.style(this.tabNode,"display",a?"":"none")},_updatePager:function(){var a=this.getChildren();
dojo.publish(this.id+"-update",[this._playing,dojo.indexOf(a,this.selectedChildWidget)+1,a.length])},_onMouseOver:function(){this._resetTimer();this._over=!0},_onMouseOut:function(){this._over=!1;if(this._playing)clearTimeout(this._timer),this._timer=setTimeout(dojo.hitch(this,"_play",!0),200)},_resetTimer:function(){clearTimeout(this._timer);this._timer=null},_cycle:function(a){(a instanceof Boolean||typeof a=="boolean")&&this._manualChange();var b=this.getChildren(),c=b.length,a=dojo.indexOf(b,
this.selectedChildWidget)+(a===!1||a!==!0&&this.reverse?-1:1);this.selectChild(b[a<c?a<0?c-1:a:0]);this._updatePager()},_manualChange:function(){if(this.pauseOnManualChange)this._playing=!1;this.cycles=-1},_play:function(a){this._playing=!0;this._resetTimer();a!==!0&&this.cycles>0&&this.cycles--;if(this.cycles==0)this._pause();else if((!this.suspendOnHover||!this._over)&&this.transitionDelay)this._timer=setTimeout(dojo.hitch(this,"_cycle"),this.selectedChildWidget.domNode.getAttribute("transitionDelay")||
this.transitionDelay);this._updatePager()},_pause:function(){this._playing=!1;this._resetTimer()},_state:function(a){a?(this.cycles=-1,this._play()):this._pause()},_transition:function(a,b){this._resetTimer();if(b&&this.transitionDuration)switch(this.transition){case "fade":this._fade(a,b);return}this._transitionEnd();this.inherited(arguments)},_transitionEnd:function(){this._playing?this._play():this._updatePager()},_fade:function(a,b){this._styleNode(b.domNode,1,1);this._styleNode(a.domNode,0,2);
this._showChild(a);this.doLayout&&a.resize&&a.resize(this._containerContentBox||this._contentBox);var c={duration:this.transitionDuration},c=dojo.fx.combine([dojo.fadeOut(dojo.mixin({node:b.domNode},c)),dojo.fadeIn(dojo.mixin({node:a.domNode},c))]);this.connect(c,"onEnd",dojo.hitch(this,function(){this._hideChild(b);this._transitionEnd()}));c.play()},_styleNode:function(a,b,c){dojo.style(a,"opacity",b);dojo.style(a,"zIndex",c);dojo.style(a,"position","absolute")}}),dojo.declare("dojox.layout.RotatorPager",
[dijit._Widget,dijit._Templated,dijit._Contained],{widgetsInTemplate:!0,rotatorId:"",postMixInProperties:function(){this.templateString="<div>"+this.srcNodeRef.innerHTML+"</div>"},postCreate:function(){var a=dijit.byId(this.rotatorId)||this.getParent();if(a&&a.declaredClass=="dojox.layout.RotatorContainer")this.previous&&dojo.connect(this.previous,"onClick",function(){dojo.publish(a.id+"-cycle",[!1])}),this.next&&dojo.connect(this.next,"onClick",function(){dojo.publish(a.id+"-cycle",[!0])}),this.playPause&&
dojo.connect(this.playPause,"onClick",function(){this.set("label",this.checked?"Pause":"Play");dojo.publish(a.id+"-state",[this.checked])}),this._subscriptions=[dojo.subscribe(a.id+"-state",this,"_state"),dojo.subscribe(a.id+"-update",this,"_update")]},destroy:function(){dojo.forEach(this._subscriptions,dojo.unsubscribe);this.inherited(arguments)},_state:function(a){this.playPause&&this.playPause.checked!=a&&(this.playPause.set("label",a?"Pause":"Play"),this.playPause.set("checked",a))},_update:function(a,
b,c){this._state(a);if(this.current&&b)this.current.innerHTML=b;if(this.total&&c)this.total.innerHTML=c}}));