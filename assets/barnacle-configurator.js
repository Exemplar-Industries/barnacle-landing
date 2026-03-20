
(function(){
'use strict';
document.documentElement.classList.add('barnacle-page-active');
document.body.classList.add('barnacle-page-active');

var mainImg=document.getElementById('bl-mainImg');
document.querySelectorAll('#bl-thumbs .gal-thumb').forEach(function(t){
  t.addEventListener('click',function(){
    document.querySelectorAll('#bl-thumbs .gal-thumb').forEach(function(x){x.classList.remove('active');});
    t.classList.add('active');
    if(mainImg){mainImg.style.opacity='0';setTimeout(function(){mainImg.src=t.dataset.src;mainImg.style.opacity='1';},180);}
  });
});

var buyEl=document.getElementById('buy'),sticky=document.getElementById('bl-sticky');
if(buyEl&&sticky){new IntersectionObserver(function(e){sticky.classList.toggle('vis',!e[0].isIntersecting);},{threshold:0.1}).observe(buyEl);}
var stickyBtn=document.getElementById('bl-stickyBtn');
if(stickyBtn){stickyBtn.addEventListener('click',function(){blSyncProps();var f=document.getElementById('bl-form');if(f)f.submit();});}

var blCurBase='white',blCurFont='Inter',blCurTextColor='#0f172a',blCurStrokeColor='none',blCurPattern='none',blCurSize='medium';
var blUploadedImg=null,blPresetImg=null;

function blSyncProps(){
  var textEl=document.getElementById('bl-textInput');
  var pairs=[
    ['color',blCurBase.charAt(0).toUpperCase()+blCurBase.slice(1)],
    ['pattern',blCurPattern==='none'?'Plain':blCurPattern==='uploaded'?'Custom Upload':blCurPattern.charAt(0).toUpperCase()+blCurPattern.slice(1)],
    ['text',textEl?textEl.value:''],
    ['font',blCurFont],
    ['tcolor',blCurTextColor],
    ['stroke',blCurStrokeColor==='none'?'None':blCurStrokeColor],
    ['size',blCurSize.charAt(0).toUpperCase()+blCurSize.slice(1)],
  ];
  pairs.forEach(function(p){
    ['bl-p-','bl-cp-'].forEach(function(pfx){var el=document.getElementById(pfx+p[0]);if(el)el.value=p[1];});
  });
}

window.blSetBase=function(c,el){blCurBase=c;document.querySelectorAll('#bl .b-swatch').forEach(function(s){s.classList.remove('active');});el.classList.add('active');blRender();blSyncProps();};
window.blSetSize=function(s,el){blCurSize=s;document.querySelectorAll('#bl .sz-btn').forEach(function(b){b.classList.remove('active');});el.classList.add('active');blRender();blSyncProps();};
window.blToggleStroke=function(on){var picker=document.getElementById('bl-strokeColor'),row=document.getElementById('bl-strokeRow');if(on){blCurStrokeColor=picker.value;picker.style.display='block';row.style.display='flex';}else{blCurStrokeColor='none';picker.style.display='none';row.style.display='none';}blRender();blSyncProps();};

var BL_FONTS=[{n:'Inter',c:'Sans-Serif'},{n:'Roboto',c:'Sans-Serif'},{n:'Oswald',c:'Display'},{n:'Bebas Neue',c:'Display'},{n:'Anton',c:'Display'},{n:'Bangers',c:'Display'},{n:'Permanent Marker',c:'Handwriting'},{n:'Pacifico',c:'Handwriting'},{n:'Lobster',c:'Handwriting'},{n:'Dancing Script',c:'Handwriting'},{n:'Satisfy',c:'Handwriting'},{n:'Righteous',c:'Display'},{n:'Fredoka One',c:'Display'},{n:'Russo One',c:'Display'},{n:'Alfa Slab One',c:'Serif'},{n:'Playfair Display',c:'Serif'},{n:'Merriweather',c:'Serif'},{n:'Lato',c:'Sans-Serif'},{n:'Montserrat',c:'Sans-Serif'},{n:'Raleway',c:'Sans-Serif'},{n:'Exo 2',c:'Sans-Serif'},{n:'Orbitron',c:'Display'},{n:'Cinzel',c:'Serif'},{n:'Abril Fatface',c:'Display'},{n:'Titan One',c:'Display'},{n:'Lilita One',c:'Display'},{n:'Boogaloo',c:'Display'},{n:'Chewy',c:'Display'},{n:'Kalam',c:'Handwriting'}];
var blLoadedFonts=new Set(['Inter','Permanent Marker']),blFilteredFonts=BL_FONTS.slice();

window.blToggleFont=function(){var t=document.getElementById('bl-fontTrigger'),d=document.getElementById('bl-fontDd'),open=d.classList.contains('open');t.classList.toggle('open',!open);d.classList.toggle('open',!open);if(!open){blBuildFontList();document.getElementById('bl-fontSearch').focus();}};
window.blFilterFonts=function(){var q=document.getElementById('bl-fontSearch').value.toLowerCase();blFilteredFonts=BL_FONTS.filter(function(f){return f.n.toLowerCase().includes(q)||f.c.toLowerCase().includes(q);});blBuildFontList();};
function blBuildFontList(){var list=document.getElementById('bl-fontList');list.innerHTML='';blFilteredFonts.forEach(function(f){var d=document.createElement('div');d.className='font-opt'+(f.n===blCurFont?' sel':'');var nameSpan=document.createElement('span');nameSpan.textContent=f.n+' ';var small=document.createElement('small');small.style.cssText='opacity:.4;font-size:.75em;';small.textContent=f.c;nameSpan.appendChild(small);var previewSpan=document.createElement('span');previewSpan.className='fp';previewSpan.style.fontFamily=f.n+',sans-serif';previewSpan.textContent='Aa';d.appendChild(nameSpan);d.appendChild(previewSpan);d.addEventListener('click',function(){blSelectFont(f.n);});list.appendChild(d);});}
function blSelectFont(name){blCurFont=name;var lbl=document.getElementById('bl-fontLabel');lbl.textContent=name;lbl.style.fontFamily="'"+name+"',sans-serif";document.getElementById('bl-fontTrigger').classList.remove('open');document.getElementById('bl-fontDd').classList.remove('open');if(!blLoadedFonts.has(name)){var link=document.createElement('link');link.rel='stylesheet';link.href='https://fonts.googleapis.com/css2?family='+encodeURIComponent(name)+':wght@400;700&display=swap';document.head.appendChild(link);blLoadedFonts.add(name);setTimeout(blRender,450);}else{blRender();}blBuildFontList();blSyncProps();}
document.addEventListener('click',function(e){var wrap=document.querySelector('#bl .font-wrap');if(wrap&&!wrap.contains(e.target)){var t=document.getElementById('bl-fontTrigger'),d=document.getElementById('bl-fontDd');if(t)t.classList.remove('open');if(d)d.classList.remove('open');}});

var BL_PRESETS={camo:'https://cdn.shopify.com/s/files/1/0701/8437/0218/t/3/assets/preset-camo.jpg',usa:'https://cdn.shopify.com/s/files/1/0701/8437/0218/t/3/assets/preset-usa-flag.jpg',floral:'https://cdn.shopify.com/s/files/1/0701/8437/0218/t/3/assets/preset-floral.jpg'};
window.blSetPreset=function(name,el){blCurPattern=name;document.querySelectorAll('#bl-presets .preset-btn').forEach(function(b){b.classList.remove('active');});el.classList.add('active');blUploadedImg=null;if(name==='none'){blPresetImg=null;blRender();}else{var img=new Image();img.onload=function(){blPresetImg=img;blRender();};img.src=BL_PRESETS[name];}blSyncProps();};

function blUpscale(img,target){var maxDim=Math.max(img.naturalWidth,img.naturalHeight);if(maxDim>=target)return img;var cw=img.naturalWidth,ch=img.naturalHeight,cur=img;while(Math.max(cw,ch)<target){var scale=Math.min(2,target/Math.max(cw,ch));var off=document.createElement('canvas');off.width=Math.round(cw*scale);off.height=Math.round(ch*scale);var octx=off.getContext('2d');octx.imageSmoothingEnabled=true;octx.imageSmoothingQuality='high';octx.drawImage(cur,0,0,off.width,off.height);var up=new Image();up.src=off.toDataURL('image/png');cur=up;cw=off.width;ch=off.height;}return cur;}
window.blHandleUpload=function(e){var file=e.target.files[0];if(!file)return;var zone=document.getElementById('bl-uploadZone'),origTitle=zone.querySelector('.upload-title').textContent;zone.querySelector('.upload-title').textContent='Upscaling for print quality...';var reader=new FileReader();reader.onload=function(ev){var img=new Image();img.onload=function(){var up=blUpscale(img,2000);var finalize=function(fi){blUploadedImg=fi;blPresetImg=null;blCurPattern='uploaded';document.querySelectorAll('#bl-presets .preset-btn').forEach(function(b){b.classList.remove('active');});var strip=document.getElementById('bl-strip');strip.innerHTML='';var th=document.createElement('div');th.className='upload-thumb active';th.innerHTML='<img src="'+ev.target.result+'" alt="uploaded" />';strip.appendChild(th);zone.querySelector('.upload-title').textContent=origTitle;blRender();blSyncProps();};if(up.complete)finalize(up);else up.onload=function(){finalize(up);};};img.src=ev.target.result;};reader.readAsDataURL(file);};
var uploadZone=document.getElementById('bl-uploadZone');if(uploadZone){uploadZone.addEventListener('dragover',function(e){e.preventDefault();uploadZone.classList.add('drag-over');});uploadZone.addEventListener('dragleave',function(){uploadZone.classList.remove('drag-over');});uploadZone.addEventListener('drop',function(e){e.preventDefault();uploadZone.classList.remove('drag-over');var file=e.dataTransfer.files[0];if(file&&file.type.startsWith('image/')){var dt=new DataTransfer();dt.items.add(file);document.getElementById('bl-patternUpload').files=dt.files;blHandleUpload({target:{files:dt.files}});}});}

var canvas=null,ctx=null;
var CX=300,CY=300,R_DISC=278,R_CUP=168,R_HOLE=96,R_TEXT=234;
var woodBg=null;

function blDrawArcText(text,radius,maxSize,fontFamily,weight,fillColor,strokeColor,strokeW){if(!text||!ctx)return;var MAX_ARC=(120*Math.PI)/180,maxArcLen=radius*MAX_ARC,fontSize=maxSize;ctx.font=weight+' '+fontSize+"px '"+fontFamily+"',sans-serif";var totalW=Array.from(text).reduce(function(s,c){return s+ctx.measureText(c).width*1.05;},0);while(totalW>maxArcLen&&fontSize>10){fontSize--;ctx.font=weight+' '+fontSize+"px '"+fontFamily+"',sans-serif";totalW=Array.from(text).reduce(function(s,c){return s+ctx.measureText(c).width*1.05;},0);}var totalAngle=totalW/radius,midAngle=-Math.PI/2,angle=midAngle-totalAngle/2;ctx.save();for(var i=0;i<text.length;i++){var ch=text[i],cw=ctx.measureText(ch).width*1.05,charAngle=angle+cw/(2*radius);ctx.save();ctx.translate(CX+radius*Math.cos(charAngle),CY+radius*Math.sin(charAngle));ctx.rotate(charAngle+Math.PI/2);ctx.font=weight+' '+fontSize+"px '"+fontFamily+"',sans-serif";ctx.textAlign='center';ctx.textBaseline='alphabetic';if(strokeColor&&strokeColor!=='none'){ctx.strokeStyle=strokeColor;ctx.lineWidth=strokeW*2;ctx.lineJoin='round';ctx.strokeText(ch,0,0);}ctx.fillStyle=fillColor;ctx.fillText(ch,0,0);ctx.restore();angle+=cw/radius;}ctx.restore();}

window.blRender=function(){if(!ctx||!canvas)return;var W=canvas.width,H=canvas.height;ctx.clearRect(0,0,W,H);if(woodBg&&woodBg.complete&&woodBg.naturalWidth>0)ctx.drawImage(woodBg,0,0,W,H);else{ctx.fillStyle='#c8a96e';ctx.fillRect(0,0,W,H);}ctx.save();ctx.shadowColor='rgba(0,0,0,.6)';ctx.shadowBlur=36;ctx.shadowOffsetY=10;ctx.beginPath();ctx.arc(CX,CY,R_DISC,0,Math.PI*2);ctx.fillStyle='#555';ctx.fill();ctx.restore();ctx.save();ctx.beginPath();ctx.arc(CX,CY,R_DISC,0,Math.PI*2);ctx.closePath();ctx.clip();var patSrc=blUploadedImg||blPresetImg;if(patSrc){ctx.drawImage(patSrc,CX-R_DISC,CY-R_DISC,R_DISC*2,R_DISC*2);}else{ctx.fillStyle='#9e9e9e';ctx.beginPath();ctx.arc(CX,CY,R_DISC,0,Math.PI*2);ctx.fill();var gg=ctx.createRadialGradient(CX-70,CY-70,20,CX,CY,R_DISC);gg.addColorStop(0,'rgba(255,255,255,.2)');gg.addColorStop(1,'rgba(0,0,0,.15)');ctx.fillStyle=gg;ctx.fillRect(CX-R_DISC,CY-R_DISC,R_DISC*2,R_DISC*2);}ctx.restore();ctx.beginPath();ctx.arc(CX,CY,R_DISC,0,Math.PI*2);ctx.strokeStyle='rgba(0,0,0,.3)';ctx.lineWidth=2.5;ctx.stroke();var BC={white:{f:'#f0f0f0',h:'#ffffff',s:'#b8b8b8',r:'#d0d0d0',m:'#e4e4e4'},black:{f:'#1c1c1c',h:'#3a3a3a',s:'#080808',r:'#262626',m:'#242424'},pink:{f:'#ec4899',h:'#f9a8d4',s:'#be185d',r:'#db2777',m:'#f472b6'}};var bc=BC[blCurBase]||BC.white;ctx.save();ctx.shadowColor='rgba(0,0,0,.45)';ctx.shadowBlur=22;ctx.shadowOffsetY=5;ctx.beginPath();ctx.arc(CX,CY,R_CUP,0,Math.PI*2);ctx.fillStyle=bc.f;ctx.fill();ctx.restore();var cg=ctx.createRadialGradient(CX-42,CY-42,6,CX,CY,R_CUP);cg.addColorStop(0,bc.h);cg.addColorStop(0.3,bc.m);cg.addColorStop(0.75,bc.f);cg.addColorStop(1,bc.s);ctx.beginPath();ctx.arc(CX,CY,R_CUP,0,Math.PI*2);ctx.fillStyle=cg;ctx.fill();ctx.beginPath();ctx.arc(CX,CY,R_CUP,0,Math.PI*2);ctx.strokeStyle=bc.r;ctx.lineWidth=3;ctx.stroke();ctx.save();ctx.shadowColor='rgba(0,0,0,.5)';ctx.shadowBlur=14;ctx.beginPath();ctx.arc(CX,CY,R_HOLE,0,Math.PI*2);ctx.fillStyle='#ffffff';ctx.fill();ctx.restore();ctx.beginPath();ctx.arc(CX,CY,4,0,Math.PI*2);ctx.fillStyle='rgba(0,0,0,.35)';ctx.fill();var txt=document.getElementById('bl-textInput')?document.getElementById('bl-textInput').value.trim():'';if(txt){var sw=parseInt(document.getElementById('bl-strokeWidth')?document.getElementById('bl-strokeWidth').value:2)||2;var ms=blCurSize==='large'?40:30;blDrawArcText(txt,R_TEXT,ms,blCurFont,'800',blCurTextColor,(blCurStrokeColor&&blCurStrokeColor!=='none')?blCurStrokeColor:null,sw);}var vg=ctx.createRadialGradient(CX,CY,R_DISC*0.72,CX,CY,R_DISC*1.05);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.22)');ctx.save();ctx.beginPath();ctx.arc(CX,CY,R_DISC,0,Math.PI*2);ctx.clip();ctx.fillStyle=vg;ctx.fillRect(CX-R_DISC,CY-R_DISC,R_DISC*2,R_DISC*2);ctx.restore();};

// Init canvas — must happen after DOM is ready
function blInitCanvas(){
  canvas=document.getElementById('previewCanvas');
  ctx=canvas?canvas.getContext('2d'):null;
  if(ctx){
    woodBg=new Image();
    woodBg.onload=function(){blRender();document.fonts.ready.then(blRender);};
    woodBg.src='https://cdn.shopify.com/s/files/1/0701/8437/0218/t/3/assets/barnacle-topdown-wood-clean-nodrink.jpg';
    blRender();
  }
}
if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',blInitCanvas);
}else{
  blInitCanvas();
}
var ti=document.getElementById('bl-textInput');if(ti)ti.addEventListener('input',blSyncProps);
var tc=document.getElementById('bl-textColor');if(tc)tc.addEventListener('input',blSyncProps);
})();
