var metaEmulator=function(e){var t={};function r(s){if(t[s])return t[s].exports;var i=t[s]={i:s,l:!1,exports:{}};return e[s].call(i.exports,i,i.exports,r),i.l=!0,i.exports}return r.m=e,r.c=t,r.d=function(e,t,s){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:s})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var s=Object.create(null);if(r.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)r.d(s,i,function(t){return e[t]}.bind(null,i));return s},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=0)}([function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=r(1),i=r(5),n=r(6),d=5e5,o=function(){function e(e){this.autoStart=!0,this.loading=!1,this._loopCount=d;var t=document.createElement("canvas");t.width=320,t.height=256,document.getElementById(e).appendChild(t),this._ctx=t.getContext("2d")}return e.prototype.loadFromUrl=function(e){var t=this;this.loading=!0;var r=new XMLHttpRequest;r.onload=function(e){t.loadFromBuffer(r.response)},r.open("GET",e),r.responseType="arraybuffer",r.send()},e.prototype.loadFromBuffer=function(e){this._atsamd21=new s.Atsamd21,this._atsamd21.loadFlash(new Uint8Array(e),16384),this.loading=!1,this._screen=new i.St7735(this._atsamd21.sercom4,this._atsamd21.portA,this._atsamd21.portB,this._ctx),this._screen.clear(),this._buttons=new n.Buttons(this._atsamd21.sercom4,this._atsamd21.portA,this._atsamd21.portB),this._customKeymap&&this._buttons.setKeymap(this._customKeymap),this.autoStart&&this.start()},e.prototype.reset=function(){this._screen.clear(),this._atsamd21.reset(16384),this._lastTickCount=this._atsamd21.tickCount},e.prototype.start=function(){var e=this;this._running||(this._running=!0,this.run(),this._lastTickCount=this._atsamd21.tickCount,setTimeout(function(){e.performanceMonitor()},1e3))},e.prototype.stop=function(){this._running=!1},e.prototype.run=function(){var e=this;try{for(var t=0;t<this._loopCount;t++)this._atsamd21.step();this._screen.updateCanvas(),this._running&&setTimeout(function(){e.run()},0)}catch(e){throw this._running=!1,e}},e.prototype.performanceMonitor=function(){var e=this,t=2e7/(this._atsamd21.tickCount-this._lastTickCount);this._loopCount=Math.round(this._loopCount*t),(this._loopCount>d||this._loopCount<0)&&(this._loopCount=d),this._running&&(this._lastTickCount=this._atsamd21.tickCount,setTimeout(function(){e.performanceMonitor()},1e3))},e.prototype.setKeymap=function(e){this._customKeymap=e,this._buttons&&this._buttons.setKeymap(this._customKeymap)},e.prototype.setButtonData=function(e){this._buttons&&this._buttons.customButtonData(e)},e}();t.Emulator=o},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=r(2),i=r(3),n=r(4),d=1090536448,o=1090536576,a=function(){function e(){this._decodedInstructions=[],this._sysTickTrigger=0,this.tickCount=0,this.registers=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],this._peripheralWriteHandlers=[],this._peripheralReadHandlers=[],this.cycleCount=0,this.breakAfter=-1,this.paused=!1,this.spIndex=13,this.lrIndex=14,this.pcIndex=15,this.debug=!0,this._flash=new Uint8Array(262144);for(var e=0;e<this._flash.length;e++)this._flash[e]=255;this._sram=new Uint8Array(32768);for(e=0;e<this._sram.length;e++)this._sram[e]=255;this.portA=new s.PortRegister(d,this),this.portB=new s.PortRegister(o,this),this.sercom4=new i.SercomRegister(4,this),this.sercom5=new i.SercomRegister(5,this),this.dmac=new n.DmacRegisters(this)}return e.prototype.loadFlash=function(e,t){void 0===t&&(t=0);for(var r=0;r<e.length;r++)this._flash[r+t]=e[r];this.reset(t),this._decodedInstructions=[],this.decodeInstructions()},e.prototype.fetchHalfword=function(e){return e<536870912?this._flash[e]|this._flash[e+1]<<8:e<1073741824?(e-=536870912,this._sram[e]|this._sram[e+1]<<8):e<1610612736&&1107312666==e?Math.floor(65535*Math.random()):0},e.prototype.fetchWord=function(e){if(e<536870912)return(this._flash[e]|this._flash[e+1]<<8|this._flash[e+2]<<16|this._flash[e+3]<<24)>>>0;if(e<1073741824)return e-=536870912,(this._sram[e]|this._sram[e+1]<<8|this._sram[e+2]<<16|this._sram[e+3]<<24)>>>0;if(e<1610612736){if(1073743884==e)return 210;var t=this._peripheralReadHandlers[e];if(t)return t(e)}return 0},e.prototype.fetchByte=function(e){if(e<536870912)return this._flash[e];if(e<1073741824)return e-=536870912,this._sram[e];if(e<1610612736){if(1073744896==e)return 0;if(1107312664==e)return 1;var t=this._peripheralReadHandlers[e];if(t)return t(e)}return 0},e.prototype.writeWord=function(e,t){if(e<536870912);else if(e<1073741824)e-=536870912,this._sram[e]=255&t,this._sram[e+1]=t>>8&255,this._sram[e+2]=t>>16&255,this._sram[e+3]=t>>24&255;else if(e<1610612736){var r=this._peripheralWriteHandlers[e];r&&r(e,t)}},e.prototype.writeHalfword=function(e,t){if(e<536870912);else if(e<1073741824)e-=536870912,this._sram[e]=255&t,this._sram[e+1]=t>>8&255;else if(e<1610612736){var r=this._peripheralWriteHandlers[e];r&&r(e,t)}},e.prototype.writeByte=function(e,t){if(e<536870912);else if(e<1073741824)this._sram[e-536870912]=t;else if(e<1610612736){var r=this._peripheralWriteHandlers[e];r&&r(e,t)}},e.prototype.setRegister=function(e,t){this.registers[e]=t},e.prototype.readRegister=function(e){return this.registers[e]},e.prototype.registerPeripheralWriteHandler=function(e,t){this._peripheralWriteHandlers[e]=t},e.prototype.registerPeripheralReadHandler=function(e,t){this._peripheralReadHandlers[e]=t},e.prototype.incrementPc=function(){this._sysTickTrigger++,this.tickCount++,this.registers[this.pcIndex]+=2},e.prototype.pushStack=function(e){this.setRegister(this.spIndex,this.readRegister(this.spIndex)-4),this.writeWord(this.readRegister(this.spIndex),e)},e.prototype.popStack=function(e){this.setRegister(e,this.fetchWord(this.readRegister(this.spIndex))),this.setRegister(this.spIndex,this.readRegister(this.spIndex)+4)},e.prototype.addAndSetCondition=function(e,t,r){var s=(4294967295&e)>>>0,i=(4294967295&t)>>>0,n=s+i+r;return this.condC=n>4294967295,this.condZ=0==(4294967295&n),this.condN=0!=(2147483648&n),this.condV=(2147483648&s)==(2147483648&i)&&(2147483648&s)!=(2147483648&n),4294967295&n},e.prototype.setNZ=function(e){this.condN=0!=(2147483648&e),this.condZ=0==e},e.prototype.log=function(e){this.debug&&console.log(e)},e.prototype.reset=function(e){this.setRegister(this.spIndex,this.fetchWord(0+e)),this.setRegister(this.lrIndex,4294967295),this.setRegister(this.pcIndex,-2&this.fetchWord(4+e)),this.incrementPc(),this._sysTickVector=-2&this.fetchWord(60+e),this._dmacVector=-2&this.fetchWord(88+e)},e.prototype.step=function(){this._dmacInterrupt?(this._dmacInterrupt=!1,this.pushStack((this.condC?1:0)|(this.condN?2:0)|(this.condV?4:0)|(this.condZ?8:0)),this.pushStack(this.readRegister(this.pcIndex)),this.pushStack(this.readRegister(this.lrIndex)),this.pushStack(this.readRegister(12)),this.pushStack(this.readRegister(3)),this.pushStack(this.readRegister(2)),this.pushStack(this.readRegister(1)),this.pushStack(this.readRegister(0)),this.setRegister(this.pcIndex,this._dmacVector),this.setRegister(this.lrIndex,4294967289),this.incrementPc()):this._sysTickTrigger>=2e4&&(this._sysTickTrigger=0,this.pushStack((this.condC?1:0)|(this.condN?2:0)|(this.condV?4:0)|(this.condZ?8:0)),this.pushStack(this.readRegister(this.pcIndex)),this.pushStack(this.readRegister(this.lrIndex)),this.pushStack(this.readRegister(12)),this.pushStack(this.readRegister(3)),this.pushStack(this.readRegister(2)),this.pushStack(this.readRegister(1)),this.pushStack(this.readRegister(0)),this.setRegister(this.pcIndex,this._sysTickVector),this.setRegister(this.lrIndex,4294967289),this.incrementPc());for(var e=this.readRegister(this.pcIndex)-2;-8==(0|e);){this.popStack(0),this.popStack(1),this.popStack(2),this.popStack(3),this.popStack(12),this.popStack(this.lrIndex),this.popStack(this.pcIndex);var t=this.fetchWord(this.readRegister(this.spIndex));this.condC=!!(1&t),this.condN=!!(2&t),this.condV=!!(4&t),this.condZ=!!(8&t),this.setRegister(this.spIndex,this.readRegister(this.spIndex)+4),e=this.readRegister(this.pcIndex)-2}var r=this._decodedInstructions[e];if(!r){if(-2==e)return void this.reset(16384);this.log("NO INSTRUCTIONHANDLER! 0x"+e.toString(16)+": 0x"+this.fetchHalfword(e).toString(16)+"; prev addr: 0x"+(this._tmpAddr?this._tmpAddr.toString(16):"?"))}this._tmpAddr=e,this.incrementPc(),r()},e.prototype.dmacInterrupt=function(){this._dmacInterrupt=!0},e.prototype.speedTestNop=function(e){var t=this._decodedInstructions[e];t&&t()},e.prototype.decodeInstructions=function(){for(var e,t,r=this,s=function(){if(e=i.fetchHalfword(n),t=i.fetchHalfword(n+2),0==(57344&e)){var s=(56&e)>>3,d=7&e;if(6144!=(6144&e)){var o=(1984&e)>>6;switch((6144&e)>>11){case 0:i._decodedInstructions[n]=function(){var e=r.readRegister(s)<<o;r.setRegister(d,e),r.condC=0!=(r.readRegister(s)&1<<o),r.setNZ(e)};break;case 1:i._decodedInstructions[n]=function(){var e=r.readRegister(s)>>>o;r.setRegister(d,e),r.condC=0!=(r.readRegister(s)&1<<32-o),r.setNZ(e)};break;case 2:i._decodedInstructions[n]=function(){var e=r.readRegister(s)>>o;r.setRegister(d,e),r.condC=0!=(r.readRegister(s)&1<<32-o),r.setNZ(e)}}}else{var a=(448&e)>>6;switch((1536&e)>>9){case 0:i._decodedInstructions[n]=function(){r.setRegister(d,r.addAndSetCondition(r.readRegister(s),r.readRegister(a),0))};break;case 2:i._decodedInstructions[n]=function(){r.setRegister(d,r.addAndSetCondition(r.readRegister(s),a,0))};break;case 1:i._decodedInstructions[n]=function(){r.setRegister(d,r.addAndSetCondition(r.readRegister(s),~r.readRegister(a),1))};break;case 3:i._decodedInstructions[n]=function(){r.setRegister(d,r.addAndSetCondition(r.readRegister(s),~a,1))}}}}else if(8192==(57344&e)){var c=(1792&e)>>8,u=255&e;switch((6144&e)>>11){case 0:i._decodedInstructions[n]=function(){r.setRegister(c,u),r.setNZ(u)};break;case 1:i._decodedInstructions[n]=function(){r.addAndSetCondition(r.readRegister(c),~u,1)};break;case 2:i._decodedInstructions[n]=function(){r.setRegister(c,r.addAndSetCondition(r.readRegister(c),u,0))};break;case 3:i._decodedInstructions[n]=function(){r.setRegister(c,r.addAndSetCondition(r.readRegister(c),~u,1))}}}else if(16384==(64512&e)){var h=(56&e)>>3,f=7&e;switch((960&e)>>6){case 0:i._decodedInstructions[n]=function(){var e=r.readRegister(f)&r.readRegister(h);r.setRegister(f,e),r.setNZ(e)};break;case 1:i._decodedInstructions[n]=function(){var e=r.readRegister(f)^r.readRegister(h);r.setRegister(f,e),r.setNZ(e)};break;case 2:i._decodedInstructions[n]=function(){var e=r.readRegister(h),t=r.readRegister(f)<<e;r.setRegister(f,t),r.condC=0!=(r.readRegister(h)&1<<e),r.setNZ(t)};break;case 3:i._decodedInstructions[n]=function(){var e=r.readRegister(h),t=r.readRegister(f)>>>e;r.setRegister(f,t),r.condC=0!=(r.readRegister(h)&1<<32-e),r.setNZ(t)};break;case 4:i._decodedInstructions[n]=function(){var e=r.readRegister(h),t=r.readRegister(f)>>e;r.setRegister(f,t),r.condC=0!=(r.readRegister(h)&1<<32-e),r.setNZ(t)};break;case 5:i._decodedInstructions[n]=function(){r.setRegister(f,r.addAndSetCondition(r.readRegister(f),r.readRegister(h),r.condC?1:0))};break;case 6:i._decodedInstructions[n]=function(){r.setRegister(f,r.addAndSetCondition(r.readRegister(f),~r.readRegister(h),r.condC?1:0))};break;case 8:i._decodedInstructions[n]=function(){var e=r.readRegister(f)&r.readRegister(h);r.setNZ(e)};break;case 9:i._decodedInstructions[n]=function(){r.setRegister(f,r.addAndSetCondition(0,~r.readRegister(h),1))};break;case 10:i._decodedInstructions[n]=function(){r.addAndSetCondition(r.readRegister(f),~r.readRegister(h),1)};break;case 11:i._decodedInstructions[n]=function(){r.addAndSetCondition(r.readRegister(f),r.readRegister(h),0)};break;case 12:i._decodedInstructions[n]=function(){var e=r.readRegister(f)|r.readRegister(h);r.setRegister(f,e),r.setNZ(e)};break;case 13:i._decodedInstructions[n]=function(){var e=r.readRegister(f)*r.readRegister(h);r.setRegister(f,e),r.setNZ(e)};break;case 14:i._decodedInstructions[n]=function(){var e=r.readRegister(f)&~r.readRegister(h);r.setRegister(f,e),r.setNZ(e)};break;case 15:i._decodedInstructions[n]=function(){var e=~r.readRegister(h);r.setRegister(f,e),r.setNZ(e)}}}else if(17408==(64512&e)){var g=(56&e)>>3,p=7&e,_=(120&e)>>3;switch((960&e)>>6){case 1:i._decodedInstructions[n]=function(){r.setRegister(p,r.addAndSetCondition(r.readRegister(p),r.readRegister(g+8),0))};break;case 2:i._decodedInstructions[n]=function(){r.setRegister(p+8,r.addAndSetCondition(r.readRegister(p+8),r.readRegister(g),0))};break;case 3:i._decodedInstructions[n]=function(){r.setRegister(p+8,r.addAndSetCondition(r.readRegister(p+8),r.readRegister(g+8),0))};break;case 5:i._decodedInstructions[n]=function(){r.addAndSetCondition(r.readRegister(p),~r.readRegister(g+8),1)};break;case 6:i._decodedInstructions[n]=function(){r.addAndSetCondition(r.readRegister(p+8),~r.readRegister(g),1)};break;case 7:i._decodedInstructions[n]=function(){r.addAndSetCondition(r.readRegister(p+8),~r.readRegister(g+8),1)};break;case 9:i._decodedInstructions[n]=function(){r.setRegister(p,r.readRegister(g+8))};break;case 10:i._decodedInstructions[n]=function(){p+8==15?(r.setRegister(p+8,-2&r.readRegister(g)),r.incrementPc()):r.setRegister(p+8,r.readRegister(g))};break;case 11:i._decodedInstructions[n]=function(){p+8==15?(r.setRegister(p+8,-2&r.readRegister(g+8)),r.incrementPc()):r.setRegister(p+8,r.readRegister(g+8))};break;case 12:i._decodedInstructions[n]=function(){r.setRegister(r.pcIndex,-2&r.readRegister(g)),r.incrementPc()};break;case 13:i._decodedInstructions[n]=function(){r.setRegister(r.pcIndex,-2&r.readRegister(g+8)),r.incrementPc()};break;case 14:case 15:i._decodedInstructions[n]=function(){r.setRegister(r.lrIndex,r.readRegister(r.pcIndex)-2|1),r.setRegister(r.pcIndex,-2&r.readRegister(_)),r.incrementPc()}}}else if(18432==(63488&e)){var R=(1792&e)>>8,l=(255&e)<<2;i._decodedInstructions[n]=function(){var e=r.fetchWord((-3&r.readRegister(r.pcIndex))+l);r.setRegister(R,e)}}else if(20480==(61952&e)){var I=(448&e)>>6,m=(56&e)>>3,v=7&e;switch((3072&e)>>10){case 0:i._decodedInstructions[n]=function(){r.writeWord(r.readRegister(m)+r.readRegister(I),r.readRegister(v))};break;case 1:i._decodedInstructions[n]=function(){r.writeByte(r.readRegister(m)+r.readRegister(I),r.readRegister(v))};break;case 2:i._decodedInstructions[n]=function(){r.setRegister(v,r.fetchWord(r.readRegister(m)+r.readRegister(I)))};break;case 3:i._decodedInstructions[n]=function(){r.setRegister(v,r.fetchByte(r.readRegister(m)+r.readRegister(I)))}}}else if(20992==(61952&e)){var k=(448&e)>>6,y=(56&e)>>3,b=7&e;switch((3072&e)>>10){case 0:i._decodedInstructions[n]=function(){r.writeHalfword(r.readRegister(y)+r.readRegister(k),65535&r.readRegister(b))};break;case 1:i._decodedInstructions[n]=function(){var e=r.fetchByte(r.readRegister(y)+r.readRegister(k));128&e&&(e|=-256),r.setRegister(b,e)};break;case 2:i._decodedInstructions[n]=function(){var e=r.fetchHalfword(r.readRegister(y)+r.readRegister(k));r.setRegister(b,e)};break;case 3:i._decodedInstructions[n]=function(){var e=r.fetchHalfword(r.readRegister(y)+r.readRegister(k));32768&e&&(e|=-65536),r.setRegister(b,e)}}}else if(24576==(57344&e)){var x=(1984&e)>>6,S=(56&e)>>3,P=7&e;switch((6144&e)>>11){case 0:i._decodedInstructions[n]=function(){r.writeWord(r.readRegister(S)+(x<<2),r.readRegister(P))};break;case 1:i._decodedInstructions[n]=function(){r.setRegister(P,r.fetchWord(r.readRegister(S)+(x<<2)))};break;case 2:i._decodedInstructions[n]=function(){r.writeByte(r.readRegister(S)+x,255&r.readRegister(P))};break;case 3:i._decodedInstructions[n]=function(){r.setRegister(P,r.fetchByte(r.readRegister(S)+x))}}}else if(32768==(61440&e)){var C=!!(2048&e),w=(1984&e)>>6,H=(56&e)>>3,W=7&e;i._decodedInstructions[n]=C?function(){r.setRegister(W,65535&r.fetchHalfword(r.readRegister(H)+(w<<1)))}:function(){r.writeHalfword(r.readRegister(H)+(w<<1),r.readRegister(W))}}else if(36864==(61440&e)){C=!!(2048&e);var A=(1792&e)>>8,N=(255&e)<<2;i._decodedInstructions[n]=C?function(){r.setRegister(A,r.fetchWord(r.readRegister(r.spIndex)+N))}:function(){r.writeWord(r.readRegister(r.spIndex)+N,r.readRegister(A))}}else if(40960==(61440&e)){var B=!!(2048&e),D=(1792&e)>>8,O=(255&e)<<2;i._decodedInstructions[n]=B?function(){r.setRegister(D,r.readRegister(r.spIndex)+O)}:function(){r.setRegister(D,(-4&r.readRegister(r.pcIndex))+O)}}else if(45056==(65280&e)){var Z=(0!=(128&e)?-1:1)*(127&e)<<2;i._decodedInstructions[n]=function(){r.setRegister(r.spIndex,r.readRegister(r.spIndex)+Z)}}else if(45568==(65280&e)){var T=(56&e)>>3,M=7&e;switch((192&e)>>6){case 0:i._decodedInstructions[n]=function(){var e=65535&r.readRegister(T);32768&e&&(e|=-65536),r.setRegister(M,e)};break;case 1:i._decodedInstructions[n]=function(){var e=255&r.readRegister(T);128&e&&(e|=-256),r.setRegister(M,e)};break;case 2:i._decodedInstructions[n]=function(){var e=65535&r.readRegister(T);r.setRegister(M,e)};break;case 3:i._decodedInstructions[n]=function(){var e=255&r.readRegister(T);r.setRegister(M,e)}}}else if(47616==(65280&e)){var E=(56&e)>>3,L=7&e;switch((192&e)>>6){case 1:i._decodedInstructions[n]=function(){var e=r.readRegister(E),t=(4278255360&e)>>>8|(16711935&e)<<8;r.setRegister(L,t)}}}else if(46688==(65512&e))i._decodedInstructions[n]=function(){};else if(46080==(62976&e)){var j=!!(256&e),V=255&e;(C=!!(2048&e))||j||(i._decodedInstructions[n]=function(){for(var e=128,t=7;t>=0;t--)V&e&&r.pushStack(r.readRegister(t)),e>>=1}),!C&&j&&(i._decodedInstructions[n]=function(){r.pushStack(r.readRegister(r.lrIndex));for(var e=128,t=7;t>=0;t--)V&e&&r.pushStack(r.readRegister(t)),e>>=1}),C&&j&&(i._decodedInstructions[n]=function(){for(var e=1,t=0;t<8;t++)V&e&&r.popStack(t),e<<=1;r.popStack(r.pcIndex),r.setRegister(r.pcIndex,-2&r.readRegister(r.pcIndex)),r.incrementPc()}),C&&!j&&(i._decodedInstructions[n]=function(){for(var e=1,t=0;t<8;t++)V&e&&r.popStack(t),e<<=1})}else if(49152==(61440&e)){var K=0!=(2048&e),U=(1792&e)>>8,F=255&e;i._decodedInstructions[n]=K?function(){for(var e=1,t=r.readRegister(U),s=0;s<8;s++)F&e&&(r.setRegister(s,r.fetchWord(t)),t+=4),e<<=1;r.setRegister(U,t)}:function(){for(var e=1,t=r.readRegister(U),s=0;s<8;s++)F&e&&(r.writeWord(t,r.readRegister(s)),t+=4),e<<=1;r.setRegister(U,t)}}else if(53248==(61440&e)){var q=255&e;switch(128&q&&(q|=-256),q<<=1,(3840&e)>>8){case 0:i._decodedInstructions[n]=function(){r.condZ&&(r.setRegister(r.pcIndex,r.readRegister(r.pcIndex)+q),r.incrementPc())};break;case 1:i._decodedInstructions[n]=function(){r.condZ||(r.setRegister(r.pcIndex,r.readRegister(r.pcIndex)+q),r.incrementPc())};break;case 2:i._decodedInstructions[n]=function(){r.condC&&(r.setRegister(r.pcIndex,r.readRegister(r.pcIndex)+q),r.incrementPc())};break;case 3:i._decodedInstructions[n]=function(){r.condC||(r.setRegister(r.pcIndex,r.readRegister(r.pcIndex)+q),r.incrementPc())};break;case 4:i._decodedInstructions[n]=function(){r.condN&&(r.setRegister(r.pcIndex,r.readRegister(r.pcIndex)+q),r.incrementPc())};break;case 5:i._decodedInstructions[n]=function(){r.condN||(r.setRegister(r.pcIndex,r.readRegister(r.pcIndex)+q),r.incrementPc())};break;case 6:i._decodedInstructions[n]=function(){r.condV&&(r.setRegister(r.pcIndex,r.readRegister(r.pcIndex)+q),r.incrementPc())};break;case 7:i._decodedInstructions[n]=function(){r.condV||(r.setRegister(r.pcIndex,r.readRegister(r.pcIndex)+q),r.incrementPc())};break;case 8:i._decodedInstructions[n]=function(){r.condC&&!r.condZ&&(r.setRegister(r.pcIndex,r.readRegister(r.pcIndex)+q),r.incrementPc())};break;case 9:i._decodedInstructions[n]=function(){r.condC&&!r.condZ||(r.setRegister(r.pcIndex,r.readRegister(r.pcIndex)+q),r.incrementPc())};break;case 10:i._decodedInstructions[n]=function(){r.condN==r.condV&&(r.setRegister(r.pcIndex,r.readRegister(r.pcIndex)+q),r.incrementPc())};break;case 11:i._decodedInstructions[n]=function(){r.condN!=r.condV&&(r.setRegister(r.pcIndex,r.readRegister(r.pcIndex)+q),r.incrementPc())};break;case 12:i._decodedInstructions[n]=function(){r.condZ||r.condN!=r.condV||(r.setRegister(r.pcIndex,r.readRegister(r.pcIndex)+q),r.incrementPc())};break;case 13:i._decodedInstructions[n]=function(){(r.condZ||r.condN!=r.condV)&&(r.setRegister(r.pcIndex,r.readRegister(r.pcIndex)+q),r.incrementPc())}}}else if(57344==(63488&e)){var G=2047&e;1024&G&&(G|=-2048),G<<=1,i._decodedInstructions[n]=function(){r.setRegister(r.pcIndex,r.readRegister(r.pcIndex)+G),r.incrementPc()}}else if(61440==(63488&e)&&63488==(63488&t)){var X=2047&e;1024&X&&(X|=-2048);var z=2047&t;i._decodedInstructions[n]=function(){r.setRegister(r.lrIndex,r.readRegister(r.pcIndex)+(X<<12))},i._decodedInstructions[n+2]=function(){var e=r.readRegister(r.pcIndex)-2;r.setRegister(r.pcIndex,r.readRegister(r.lrIndex)+(z<<1)),r.setRegister(r.lrIndex,1|e),r.incrementPc()}}else 62432==(65504&e)&&32768==(53248&t)?i._decodedInstructions[n]=function(){}:62399==e&&(i._decodedInstructions[n]=function(){r.incrementPc()})},i=this,n=0;n<this._flash.length;n+=2)s()},e}();t.Atsamd21=a},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=0,i=4,n=8,d=12,o=16,a=20,c=24,u=28,h=32,f=function(){function e(e,t){var r=this;this._outListeners=[],t.registerPeripheralReadHandler(e+o,function(e){return r._out}),t.registerPeripheralReadHandler(e+a,function(e){return r._out}),t.registerPeripheralReadHandler(e+c,function(e){return r._out}),t.registerPeripheralReadHandler(e+u,function(e){return r._out}),t.registerPeripheralReadHandler(e+h,function(e){return r._in}),t.registerPeripheralReadHandler(e+s,function(e){return r._dir}),t.registerPeripheralReadHandler(e+i,function(e){return r._dir}),t.registerPeripheralReadHandler(e+n,function(e){return r._dir}),t.registerPeripheralReadHandler(e+d,function(e){return r._dir}),t.registerPeripheralWriteHandler(e+o,function(e,t){var s=r._out^t;r._out=t,r.handleOutModified(s)}),t.registerPeripheralWriteHandler(e+a,function(e,t){var s=r._out&~t,i=r._out^s;r._out=s,r.handleOutModified(i)}),t.registerPeripheralWriteHandler(e+c,function(e,t){var s=r._out|t,i=r._out^s;r._out=s,r.handleOutModified(i)}),t.registerPeripheralWriteHandler(e+u,function(e,t){var s=r._out^t,i=r._out^s;r._out=s,r.handleOutModified(i)}),t.registerPeripheralWriteHandler(e+s,function(e,t){r._dir=r._dir^t}),t.registerPeripheralWriteHandler(e+i,function(e,t){r._dir=r._dir&~t}),t.registerPeripheralWriteHandler(e+n,function(e,t){r._dir=r._dir|t}),t.registerPeripheralWriteHandler(e+d,function(e,t){r._dir=r._dir^t})}return e.prototype.addOutListener=function(e){this._outListeners.push(e)},e.prototype.handleOutModified=function(e){var t=this;e&&this._outListeners.forEach(function(r){r(e,t._out)})},e.prototype.getOut=function(){return this._out},e}();t.PortRegister=f},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=1107298304,i=24,n=40,d=function(){function e(e,t){var r=this;this._dataListeners=[],this.data=128;var d=s+1024*e;t.registerPeripheralReadHandler(d+i,function(e){return 7}),t.registerPeripheralWriteHandler(d+n,function(e,t){t&=255,r.data=128,r._dataListeners.forEach(function(e){e(t)})}),t.registerPeripheralReadHandler(d+n,function(e){return r.data})}return e.prototype.registerDataListener=function(e){this._dataListeners.push(e)},e}();t.SercomRegister=d},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=1090537472,i=52,n=56,d=63,o=64,a=78,c=function(){function e(e){var t=this;e.registerPeripheralWriteHandler(s+i,function(e,r){t._baseAddr=r,t.debugWrite("BASEADDR",e,r)}),e.registerPeripheralWriteHandler(s+n,function(e,r){t._wrbAddr=r,t.debugWrite("WRBADDR",e,r)}),e.registerPeripheralWriteHandler(s+d,function(e,r){t._selectedChannelId=r,t.debugWrite("CHID",e,r)}),e.registerPeripheralWriteHandler(s+o,function(r,s){if(t.debugWrite("CHCTRLA",r,s),2==s){for(var i=t._baseAddr+16*t._selectedChannelId,n=(e.fetchHalfword(i),e.fetchHalfword(i+2)),d=e.fetchWord(i+4),o=e.fetchWord(i+8),a=(e.fetchWord(i+12),0);a<n;a++)e.writeByte(o,e.fetchByte(d+a-n));e.dmacInterrupt()}}),e.registerPeripheralReadHandler(s+a,function(e){return 2})}return e.prototype.debugWrite=function(e,t,r){},e}();t.DmacRegisters=c},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=160,i=128,n=2,d=function(){function e(e,t,r,d){if(this._portA=t,this._portB=r,this._ctx=d,e.registerDataListener(this.byteReceived.bind(this)),d){this._imageData=d.getImageData(0,0,s*n,i*n);var o=new ArrayBuffer(this._imageData.data.length);this._buf8=new Uint8ClampedArray(o),this._data=new Uint32Array(o)}}return e.prototype.byteReceived=function(e){if(0==(this._portB.getOut()&1<<22))if(8388608&this._portB.getOut()){switch(this._lastCommand){case 44:if(this._argIndex%2==0)this._tmpData=e;else{if(this._ctx){var t=this._tmpData<<8|e,r=255<<24|(31&t)<<3<<16|(2016&t)>>>3<<8|(63488&t)>>>8,i=n*(this._y*s*n+this._x);this._data[i]=r,this._data[i+1]=r,this._data[i+s*n]=r,this._data[i+1+s*n]=r}this._x++,this._x>this._xEnd&&(this._x=this._xStart,this._y++,this._y>this._yEnd&&(this._y=this._yStart))}break;case 42:1==this._argIndex?this._xStart=this._x=e:3==this._argIndex&&(this._xEnd=e);break;case 43:1==this._argIndex?this._yStart=this._y=e:3==this._argIndex&&(this._yEnd=e)}this._argIndex++}else this._lastCommand=e,this._argIndex=0},e.prototype.updateCanvas=function(){this._ctx&&(this._imageData.data.set(this._buf8),this._ctx.putImageData(this._imageData,0,0))},e.prototype.clear=function(){for(var e=0;e<this._data.length;e++)this._data[e]=255<<24},e}();t.St7735=d},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=function(){function e(e,t,r){var s=this;this._keymap=[[83,40],[65,81,37],[68,39],[87,90,38],[74],[75],[85],[73]],this._portA=t,this._portB=r,this._sercom=e,this._buttonData=255,e.registerDataListener(this.setButtonData.bind(this)),document.addEventListener("keydown",function(e){for(var t=0;t<s._keymap.length;t++)for(var r=0,i=s._keymap[t];r<i.length;r++){if(i[r]==e.keyCode){e.preventDefault(),s._buttonData&=~(1<<t);break}}}),document.addEventListener("keyup",function(e){for(var t=0;t<s._keymap.length;t++)for(var r=0,i=s._keymap[t];r<i.length;r++){if(i[r]==e.keyCode){s._buttonData|=1<<t;break}}})}return e.prototype.setButtonData=function(){0==(8&this._portB.getOut())&&(this._sercom.data=this._buttonData)},e.prototype.setKeymap=function(e){this._keymap=e},e.prototype.customButtonData=function(e){this._buttonData=e},e}();t.Buttons=s}]);