
(function(){
'use strict';
document.documentElement.classList.add('barnacle-page-active');
document.body.classList.add('barnacle-page-active');

// Inject CSS fixes that bypass Shopify CDN cache
(function(){
  var s=document.createElement('style');
  s.textContent='#bl .b-swatch{display:block!important} #bl .eyebrow{display:none!important}';
  document.head.appendChild(s);
})();

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

// Canvas constants — matched to reference index.html
var canvas=null,ctx=null;
var CX=300,CY=300;
var R_DISC=278;
var R_RED_OUTER=176,R_RED_INNER=168;
var R_CUP=162;
var R_HOLE=92;
var R_TOP_TEXT=248;
var R_BOTTOM_TEXT=248;
var woodBg=null;

// Arc text renderer — supports top arc (flip=false) and bottom arc (flip=true)
// flip=false: top arc, characters point outward, midAngleDeg=-90
// flip=true:  bottom arc, characters read right-side-up, midAngleDeg=90
function blDrawArcText(text,radius,midAngleDeg,fontSize,fontFamily,weight,fillColor,strokeColor,strokeW,flip){
  if(!text||!ctx)return;
  var midAngle=(midAngleDeg*Math.PI)/180;
  ctx.save();
  ctx.font=weight+' '+fontSize+"px '"+fontFamily+"',cursive,sans-serif";
  ctx.textAlign='center';
  ctx.textBaseline='alphabetic';
  var chars=text.split('');
  var totalW=chars.reduce(function(s,c){return s+ctx.measureText(c).width*1.08;},0);
  var totalAngle=totalW/radius;
  // flip=true: bottom arc — start from LEFT side (midAngle+totalAngle/2), go counter-clockwise (direction=-1)
  // Confirmed correct: charAngle-PI/2 rotation + alphabetic baseline = readable L->R at bottom
  // flip=false: top arc — start from left side (midAngle-totalAngle/2), go clockwise (direction=+1)
  var startAngle=flip?(midAngle+totalAngle/2):(midAngle-totalAngle/2);
  var direction=flip?-1:1;
  var currentAngle=startAngle;
  for(var i=0;i<chars.length;i++){
    var ch=chars[i];
    var cw=ctx.measureText(ch).width*1.08;
    var charAngle=currentAngle+direction*cw/(2*radius);
    ctx.save();
    ctx.translate(CX+radius*Math.cos(charAngle),CY+radius*Math.sin(charAngle));
    // Both top and bottom: charAngle+PI/2 points the character baseline outward (away from center)
    // For top arc (charAngle≈-PI/2): rotation=0, upright. For bottom (charAngle≈PI/2): rotation=PI, upside-down.
    // Fix: top uses charAngle+PI/2, bottom uses charAngle-PI/2 (baseline faces inward, top faces out)
    ctx.rotate(flip?(charAngle-Math.PI/2):(charAngle+Math.PI/2));
    ctx.font=weight+' '+fontSize+"px '"+fontFamily+"',cursive,sans-serif";
    ctx.textAlign='center';
    ctx.textBaseline='alphabetic';
    if(strokeColor&&strokeColor!=='none'){
      ctx.strokeStyle=strokeColor;
      ctx.lineWidth=strokeW*2;
      ctx.lineJoin='round';
      ctx.strokeText(ch,0,0);
    }
    ctx.fillStyle=fillColor;
    ctx.fillText(ch,0,0);
    ctx.restore();
    currentAngle+=direction*cw/radius;
  }
  ctx.restore();
}

window.blRender=function(){
  if(!ctx||!canvas)return;
  var W=canvas.width,H=canvas.height;
  ctx.clearRect(0,0,W,H);

  // 1. Wood background
  if(woodBg&&woodBg.complete&&woodBg.naturalWidth>0){
    ctx.drawImage(woodBg,0,0,W,H);
  }else{
    ctx.fillStyle='#c8a96e';
    ctx.fillRect(0,0,W,H);
  }

  // 2. Disc drop shadow
  ctx.save();
  ctx.shadowColor='rgba(0,0,0,.6)';
  ctx.shadowBlur=36;
  ctx.shadowOffsetY=10;
  ctx.beginPath();
  ctx.arc(CX,CY,R_DISC,0,Math.PI*2);
  ctx.fillStyle='#555';
  ctx.fill();
  ctx.restore();

  // 3. Full disc — pattern/image or gray
  ctx.save();
  ctx.beginPath();
  ctx.arc(CX,CY,R_DISC,0,Math.PI*2);
  ctx.closePath();
  ctx.clip();
  var patSrc=blUploadedImg||blPresetImg;
  if(patSrc){
    ctx.drawImage(patSrc,CX-R_DISC,CY-R_DISC,R_DISC*2,R_DISC*2);
  }else{
    ctx.fillStyle='#9e9e9e';
    ctx.beginPath();
    ctx.arc(CX,CY,R_DISC,0,Math.PI*2);
    ctx.fill();
    var gg=ctx.createRadialGradient(CX-70,CY-70,20,CX,CY,R_DISC);
    gg.addColorStop(0,'rgba(255,255,255,.2)');
    gg.addColorStop(1,'rgba(0,0,0,.15)');
    ctx.fillStyle=gg;
    ctx.fillRect(CX-R_DISC,CY-R_DISC,R_DISC*2,R_DISC*2);
  }
  ctx.restore();

  // Disc edge
  ctx.beginPath();
  ctx.arc(CX,CY,R_DISC,0,Math.PI*2);
  ctx.strokeStyle='rgba(0,0,0,.3)';
  ctx.lineWidth=2.5;
  ctx.stroke();

  // 4. Silicone ring band — the visible ring between disc edge and dome, colored by blCurBase
  // This is the MIDDLE SECTION that updates with color selection
  var BC={
    white:{f:'#e8e8e8',h:'#f8f8f8',s:'#c0c0c0',r:'#d0d0d0',m:'#e0e0e0'},
    black:{f:'#222222',h:'#3c3c3c',s:'#101010',r:'#282828',m:'#2a2a2a'},
    pink: {f:'#ec4899',h:'#fbb6ce',s:'#d6548a',r:'#e879a8',m:'#f472b6'}
  };
  var bc=BC[blCurBase]||BC.white;
  // Draw the ring band (annular region between R_DISC and R_CUP)
  ctx.save();
  ctx.beginPath();
  ctx.arc(CX,CY,R_DISC,0,Math.PI*2,false);
  ctx.arc(CX,CY,R_CUP,0,Math.PI*2,true);
  ctx.closePath();
  var rg=ctx.createRadialGradient(CX-40,CY-40,R_CUP*0.5,CX,CY,R_DISC);
  rg.addColorStop(0,bc.h);
  rg.addColorStop(0.5,bc.m);
  rg.addColorStop(1,bc.f);
  ctx.fillStyle=rg;
  ctx.fill();
  ctx.restore();

  // 5. Silicone cup dome (same base color, 3D shaded)
  ctx.save();
  ctx.shadowColor='rgba(0,0,0,.45)';
  ctx.shadowBlur=22;
  ctx.shadowOffsetY=5;
  ctx.beginPath();
  ctx.arc(CX,CY,R_CUP,0,Math.PI*2);
  ctx.fillStyle=bc.f;
  ctx.fill();
  ctx.restore();
  var cg=ctx.createRadialGradient(CX-42,CY-42,6,CX,CY,R_CUP);
  cg.addColorStop(0,bc.h);
  cg.addColorStop(0.3,bc.m);
  cg.addColorStop(0.75,bc.f);
  cg.addColorStop(1,bc.s);
  ctx.beginPath();
  ctx.arc(CX,CY,R_CUP,0,Math.PI*2);
  ctx.fillStyle=cg;
  ctx.fill();
  // No dome stroke — edge defined by gradient transition

  // 6. White center hole
  ctx.save();
  ctx.shadowColor='rgba(0,0,0,.5)';
  ctx.shadowBlur=14;
  ctx.beginPath();
  ctx.arc(CX,CY,R_HOLE,0,Math.PI*2);
  ctx.fillStyle='#ffffff';
  ctx.fill();
  ctx.restore();

  // Center dot
  ctx.beginPath();
  ctx.arc(CX,CY,4,0,Math.PI*2);
  ctx.fillStyle='rgba(0,0,0,.35)';
  ctx.fill();

  // 7. TOP ARC: customer custom text — on top rim, reads outward
  var txt=document.getElementById('bl-textInput')?document.getElementById('bl-textInput').value.trim():'';
  if(txt){
    var sw=parseInt(document.getElementById('bl-strokeWidth')?document.getElementById('bl-strokeWidth').value:2)||2;
    var ms=blCurSize==='large'?42:32;
    blDrawArcText(txt,R_TOP_TEXT,-90,ms,blCurFont,'800',blCurTextColor,(blCurStrokeColor&&blCurStrokeColor!=='none')?blCurStrokeColor:null,sw,false);
  }

  // 8. BOTTOM ARC: "The Barnacle Co." — permanent branding on bottom rim
  blDrawArcText('The Barnacle Co.',R_BOTTOM_TEXT,90,24,'Permanent Marker','800','#111111',null,0,true);

  // 9. Outer vignette
  var vg=ctx.createRadialGradient(CX,CY,R_DISC*0.72,CX,CY,R_DISC*1.05);
  vg.addColorStop(0,'rgba(0,0,0,0)');
  vg.addColorStop(1,'rgba(0,0,0,.22)');
  ctx.save();
  ctx.beginPath();
  ctx.arc(CX,CY,R_DISC,0,Math.PI*2);
  ctx.clip();
  ctx.fillStyle=vg;
  ctx.fillRect(CX-R_DISC,CY-R_DISC,R_DISC*2,R_DISC*2);
  ctx.restore();
};

// Init canvas after DOM ready
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
var ti=document.getElementById('bl-textInput');if(ti)ti.addEventListener('input',function(){blSyncProps();blRender();});
var tc=document.getElementById('bl-textColor');if(tc)tc.addEventListener('input',function(){blCurTextColor=this.value;blRender();blSyncProps();});
var sc=document.getElementById('bl-strokeColor');if(sc)sc.addEventListener('input',function(){if(blCurStrokeColor!=='none'){blCurStrokeColor=this.value;blRender();blSyncProps();}});
})();
