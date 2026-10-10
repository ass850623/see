// Cosmetic transitions never delay reading or choices.
export function createPresentation(background,portrait,reducedMotion=matchMedia('(prefers-reduced-motion: reduce)')){
  let enabled=true,previousBackground=null,previousPortrait=null;
  const running=new Set();
  function cancel(){for(const animation of running)animation.cancel();running.clear();}
  function animate(element,frames,duration){const animation=element.animate(frames,{duration,easing:'ease-out'});running.add(animation);animation.finished.catch(()=>{}).finally(()=>running.delete(animation));}
  reducedMotion.addEventListener('change',cancel);
  return {
    configure(value){enabled=value;if(!enabled||reducedMotion.matches)cancel();},
    update({art,sprite,renderPortrait,immediate=false}){
      const backgroundChanged=art!==previousBackground,portraitChanged=sprite!==previousPortrait;
      if(backgroundChanged||portraitChanged||immediate)cancel();
      background.hidden=!art;
      if(art&&backgroundChanged)background.src=art;
      if(portraitChanged)renderPortrait();
      if(!immediate&&enabled&&!reducedMotion.matches){
        if(art&&backgroundChanged)animate(background,[{opacity:.45},{opacity:1}],320);
        if(portraitChanged)animate(portrait,[{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],240);
      }
      previousBackground=art;previousPortrait=sprite;
    }
  };
}
