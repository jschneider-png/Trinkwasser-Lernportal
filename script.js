const pages = [...document.querySelectorAll(".page")];
const navButtons = [...document.querySelectorAll(".nav-btn")];
const moduleTabs = [...document.querySelectorAll(".module-tab")];
const moduleContent = document.getElementById("moduleContent");
const storageKey = "wasserPortalProgressV2";
let progress = JSON.parse(localStorage.getItem(storageKey) || "{}");

const modules = {
  1: {
    title:"Grundlagen Wasser",
    color:"#1677d2",
    text:"Wasser ist die Grundlage allen Lebens. In diesem Modul geht es um seine wichtigsten Eigenschaften, seine Bedeutung für Mensch und Umwelt und den natürlichen Wasserkreislauf.",
    info:["Wasser kommt als Flüssigkeit, Eis und Wasserdampf vor.","Wasser ist ein sehr gutes Lösungsmittel.","Ohne Wasser sind Stoffwechsel, Hygiene und viele technische Prozesse nicht möglich."],
    note:"Merksatz: Wasser ist die Grundlage allen Lebens.",
    task:"Nenne zwei Bereiche aus deinem Alltag, in denen Wasser unverzichtbar ist."
  },
  2: {
    title:"Trinkwasser",
    color:"#2b9959",
    text:"Trinkwasser entsteht aus geeignetem Rohwasser. Je nach Herkunft wird es gefördert, aufbereitet, kontrolliert und anschließend über das Leitungsnetz verteilt.",
    info:["Mögliche Quellen sind Grundwasser, Quellen und Oberflächenwasser.","Aufbereitungsverfahren hängen von der Rohwasserqualität ab.","Trinkwasser wird regelmäßig auf hygienische und chemische Qualität kontrolliert."],
    note:"Merksatz: Trinkwasser ist aufbereitetes und kontrolliertes Wasser für den menschlichen Gebrauch.",
    task:"Bringe diese Schritte in die richtige Reihenfolge: Kontrolle – Rohwasser – Verteilung – Aufbereitung."
  },
  3: {
    title:"Wasserhärte",
    color:"#ef8c28",
    text:"Wasserhärte beschreibt den Gehalt bestimmter gelöster Mineralstoffe. Besonders wichtig sind Calcium- und Magnesiumionen.",
    info:["Mehr Calcium und Magnesium bedeuten in der Regel härteres Wasser.","Hartes Wasser kann zu sichtbaren Kalkablagerungen führen.","Wasserhärte ist kein einfacher Wert für 'gut' oder 'schlecht', sondern beschreibt eine Eigenschaft des Wassers."],
    note:"Merksatz: Je mehr Calcium und Magnesium im Wasser gelöst sind, desto härter ist es.",
    task:"Ordne im Bereich 'Interaktive Übungen' die Begriffe hartem und weichem Wasser zu."
  },
  4: {
    title:"pH-Wert",
    color:"#7b3ec4",
    text:"Der pH-Wert beschreibt, wie sauer oder basisch eine wässrige Lösung ist. Der neutrale Mittelpunkt liegt bei pH 7.",
    info:["pH < 7: sauer","pH = 7: neutral","pH > 7: basisch"],
    note:"Merksatz: Ein pH-Wert von 7 ist neutral.",
    task:"Öffne das Mini-Quiz und prüfe deine Einordnung der pH-Skala."
  },
  5: {
    title:"TOC-Wert",
    color:"#1494a4",
    text:"TOC bedeutet Total Organic Carbon. Der Messwert gibt einen Hinweis auf organisch gebundenen Kohlenstoff im Wasser.",
    info:["Organische Stoffe können natürliche oder technische Ursachen haben.","Der TOC-Wert dient als Summenparameter.","Er unterstützt die Beurteilung und Überwachung der Wasserqualität."],
    note:"Merksatz: Der TOC-Wert zeigt organische Bestandteile im Wasser als Summenwert.",
    task:"Nutze die Karteikarten im Bereich 'Interaktive Übungen'."
  },
  6: {
    title:"Übungen & Wissenstest",
    color:"#d84b4b",
    text:"Zum Abschluss wiederholst du die wichtigsten Inhalte und überprüfst, was bereits sicher sitzt.",
    info:["Grundlagen wiederholen","Begriffe sicher zuordnen","Messwerte interpretieren","Ergebnisse begründen"],
    note:"Merksatz: Lernen wird sicherer, wenn du Wissen aktiv abrufst und anwendest.",
    task:"Öffne den Wissenstest über den Menüpunkt 'Quiz'."
  }
};

function showPage(name){
  pages.forEach(p => p.classList.toggle("active", p.id === `page-${name}`));
  navButtons.forEach(b => b.classList.toggle("active", b.dataset.page === name));
  window.scrollTo({top:0,behavior:"smooth"});
}
navButtons.forEach(b => b.addEventListener("click", () => showPage(b.dataset.page)));
document.querySelectorAll("[data-page-jump]").forEach(b => b.addEventListener("click", () => showPage(b.dataset.pageJump)));

function renderModule(id){
  const m = modules[id];
  moduleTabs.forEach(t => t.classList.toggle("active", t.dataset.moduleTab == id));
  progress[id] = Math.max(progress[id] || 0, 25);
  saveProgress();
  moduleContent.innerHTML = `
    <div class="section-head">
      <div>
        <span class="eyebrow">Modul ${id}</span>
        <h2 style="margin:.25rem 0 0;color:${m.color}">${m.title}</h2>
      </div>
      <button class="secondary" id="completeModule">Als abgeschlossen markieren</button>
    </div>
    <p>${m.text}</p>
    <div class="module-meta">
      <span class="tag">Infoteil</span><span class="tag">Merksatz</span><span class="tag">Praxisaufgabe</span>
    </div>
    <div class="info-box">
      <h3>Wissen</h3>
      <ul>${m.info.map(x=>`<li>${x}</li>`).join("")}</ul>
    </div>
    <div class="merksatz">💡 ${m.note}</div>
    <div class="info-box">
      <h3>Aufgabe</h3>
      <p>${m.task}</p>
    </div>
    <div class="check-list">
      <label><input type="checkbox" class="module-check"> Ich habe den Infotext gelesen.</label>
      <label><input type="checkbox" class="module-check"> Ich kann den Merksatz erklären.</label>
      <label><input type="checkbox" class="module-check"> Ich habe die Aufgabe bearbeitet.</label>
    </div>
  `;
  document.getElementById("completeModule").addEventListener("click", ()=>{
    progress[id] = 100; saveProgress(); updateStatus();
    document.getElementById("completeModule").textContent = "Abgeschlossen ✓";
  });
  document.querySelectorAll(".module-check").forEach(cb => cb.addEventListener("change", ()=>{
    const checks=[...document.querySelectorAll(".module-check")];
    const done=checks.filter(c=>c.checked).length;
    progress[id]=Math.max(progress[id]||0,25+done*25);
    saveProgress(); updateStatus();
  }));
}
moduleTabs.forEach(t => t.addEventListener("click", () => renderModule(Number(t.dataset.moduleTab))));
document.querySelectorAll("[data-module-open]").forEach(b => b.addEventListener("click", ()=>{
  showPage("lernmodule"); renderModule(Number(b.dataset.moduleOpen));
}));

function saveProgress(){ localStorage.setItem(storageKey, JSON.stringify(progress)); }
function updateStatus(){
  const complete = Object.values(progress).filter(v => v >= 100).length;
  document.getElementById("statusPill").textContent = `${complete} / 6 Module abgeschlossen`;
  renderProgress();
}
function renderProgress(){
  const grid=document.getElementById("progressGrid");
  if(!grid) return;
  grid.innerHTML=Object.keys(modules).map(id=>{
    const value=progress[id]||0;
    return `<div class="progress-row">
      <div class="head"><span>${id}. ${modules[id].title}</span><span>${value}%</span></div>
      <div class="bar"><div class="fill" style="width:${value}%"></div></div>
    </div>`;
  }).join("");
}
document.getElementById("resetProgress").addEventListener("click", ()=>{
  progress={}; saveProgress(); updateStatus();
});

// PDF preview
let currentPdfUrl=null;
const picker=document.getElementById("pdfPicker");
picker.addEventListener("change", e=>{
  const file=e.target.files[0];
  if(!file) return;
  if(file.type!=="application/pdf"){ alert("Bitte eine PDF-Datei auswählen."); return; }
  if(currentPdfUrl) URL.revokeObjectURL(currentPdfUrl);
  currentPdfUrl=URL.createObjectURL(file);
  document.getElementById("pdfName").textContent=file.name;
  document.getElementById("pdfPreview").src=currentPdfUrl;
  document.getElementById("pdfPreviewWrap").classList.remove("hidden");
});
document.getElementById("closePdf").addEventListener("click", ()=>{
  document.getElementById("pdfPreview").src="";
  document.getElementById("pdfPreviewWrap").classList.add("hidden");
  if(currentPdfUrl){URL.revokeObjectURL(currentPdfUrl);currentPdfUrl=null;}
});

// Interactions
document.querySelectorAll(".activity").forEach(b=>b.addEventListener("click",()=>renderActivity(b.dataset.activity)));
function renderActivity(type){
  const s=document.getElementById("interactionStage");
  if(type==="quiz"){
    s.innerHTML=`<h3>💡 Mini-Quiz: pH-Wert</h3>
    <p>Was bedeutet ein pH-Wert von 7?</p>
    <button class="quiz-option" data-a="0">sauer</button>
    <button class="quiz-option" data-a="1">neutral</button>
    <button class="quiz-option" data-a="0">basisch</button>
    <button class="primary" id="checkMini">Antwort prüfen</button><div class="feedback" id="miniFb"></div>`;
    let choice=null;
    s.querySelectorAll(".quiz-option").forEach(o=>o.onclick=()=>{
      s.querySelectorAll(".quiz-option").forEach(x=>x.classList.remove("selected"));
      o.classList.add("selected"); choice=o.dataset.a;
    });
    document.getElementById("checkMini").onclick=()=>{
      const fb=document.getElementById("miniFb");
      if(choice===null){fb.textContent="Bitte zuerst eine Antwort auswählen.";fb.style.color="#a86b00";}
      else if(choice==="1"){fb.textContent="✅ Richtig! pH 7 ist neutral.";fb.style.color="#238451";}
      else{fb.textContent="❌ Noch nicht. Versuche es erneut.";fb.style.color="#bd3f3f";}
    };
  }
  if(type==="drag"){
    s.innerHTML=`<h3>🧩 Drag & Drop: Wasserhärte</h3>
    <p>Ziehe die Begriffe in die passende Kategorie.</p>
    <div class="drag-layout">
      <div class="drag-pool"><strong>Begriffe</strong><br>
        <span class="drag-item" draggable="true" data-t="hard">viel Calcium</span>
        <span class="drag-item" draggable="true" data-t="hard">viel Magnesium</span>
        <span class="drag-item" draggable="true" data-t="soft">wenig Mineralien</span>
      </div>
      <div>
        <div class="drop-zone" data-zone="hard"><strong>Hartes Wasser</strong></div>
        <div class="drop-zone" data-zone="soft" style="margin-top:10px"><strong>Weiches Wasser</strong></div>
      </div>
    </div><div class="feedback" id="dragFb"></div>`;
    let dragged=null;
    s.querySelectorAll(".drag-item").forEach(i=>i.addEventListener("dragstart",()=>dragged=i));
    s.querySelectorAll(".drop-zone").forEach(z=>{
      z.addEventListener("dragover",e=>{e.preventDefault();z.classList.add("over")});
      z.addEventListener("dragleave",()=>z.classList.remove("over"));
      z.addEventListener("drop",e=>{
        e.preventDefault(); z.classList.remove("over");
        if(!dragged) return;
        const fb=document.getElementById("dragFb");
        if(dragged.dataset.t===z.dataset.zone){z.appendChild(dragged);fb.textContent="✅ Richtig zugeordnet.";fb.style.color="#238451";}
        else{fb.textContent="↩️ Noch nicht passend.";fb.style.color="#bd3f3f";}
        dragged=null;
      });
    });
  }
  if(type==="hotspot"){
    s.innerHTML=`<h3>🖼️ Hotspot-Bild: Trinkwasseraufbereitung</h3>
    <p>Klicke auf die drei Punkte.</p>
    <div class="hotspot-demo">
      <button class="dot d1" data-info="Rohwasser: Ausgangswasser aus natürlichen Vorkommen.">1</button>
      <button class="dot d2" data-info="Aufbereitung: Je nach Rohwasser werden verschiedene Verfahren eingesetzt.">2</button>
      <button class="dot d3" data-info="Verteilung: Nach der Kontrolle gelangt das Trinkwasser ins Leitungsnetz.">3</button>
    </div>
    <div class="hot-info" id="hotInfo">Wähle einen Punkt.</div>`;
    s.querySelectorAll(".dot").forEach(d=>d.onclick=()=>document.getElementById("hotInfo").textContent=d.dataset.info);
  }
  if(type==="cards"){
    s.innerHTML=`<h3>🃏 Karteikarten</h3><p>Klicke eine Karte an, um die Antwort zu sehen.</p>
    <div class="cards-grid">
      <div class="flip-card"><div class="question"><strong>Was bedeutet pH 7?</strong></div><div class="answer"><strong>Neutral.</strong></div></div>
      <div class="flip-card"><div class="question"><strong>Was macht Wasser hart?</strong></div><div class="answer"><strong>Vor allem Calcium und Magnesium.</strong></div></div>
      <div class="flip-card"><div class="question"><strong>Was bedeutet TOC?</strong></div><div class="answer"><strong>Total Organic Carbon.</strong></div></div>
      <div class="flip-card"><div class="question"><strong>Wozu wird Rohwasser aufbereitet?</strong></div><div class="answer"><strong>Damit geeignetes und kontrolliertes Trinkwasser entsteht.</strong></div></div>
    </div>`;
    s.querySelectorAll(".flip-card").forEach(c=>c.onclick=()=>c.classList.toggle("revealed"));
  }
  if(type==="gap"){
    s.innerHTML=`<h3>📝 Lückentext</h3>
    <div class="gap-row"><span>Ein pH-Wert von</span><input id="gapInput" placeholder="?"><span>ist neutral.</span><button class="primary" id="gapCheck">Prüfen</button></div>
    <div class="feedback" id="gapFb"></div>`;
    document.getElementById("gapCheck").onclick=()=>{
      const ok=document.getElementById("gapInput").value.trim()==="7";
      const fb=document.getElementById("gapFb");
      fb.textContent=ok?"✅ Richtig!":"❌ Tipp: Die neutrale Mitte der Skala.";
      fb.style.color=ok?"#238451":"#bd3f3f";
    };
  }
  if(type==="check"){
    s.innerHTML=`<h3>☑️ Selbstcheck</h3>
    <p>Was kannst du schon sicher erklären?</p>
    <div class="check-list">
      <label><input type="checkbox"> Woher Trinkwasser kommt</label>
      <label><input type="checkbox"> Was Wasserhärte bedeutet</label>
      <label><input type="checkbox"> Wie pH 7 einzuordnen ist</label>
      <label><input type="checkbox"> Was der TOC-Wert beschreibt</label>
    </div><button class="primary" id="selfEval" style="margin-top:12px">Auswerten</button><div class="feedback" id="selfFb"></div>`;
    document.getElementById("selfEval").onclick=()=>{
      const n=s.querySelectorAll('input[type="checkbox"]:checked').length;
      document.getElementById("selfFb").textContent=`Du hast ${n} von 4 Punkten abgehakt.`;
      document.getElementById("selfFb").style.color="#238451";
    };
  }
}

// Final quiz
function renderFinalQuiz(){
  document.getElementById("finalQuiz").innerHTML=`
    <div class="final-q"><strong>1. Welche Stoffe beeinflussen die Wasserhärte besonders?</strong>
      <label><input type="radio" name="q1" value="1"> Calcium und Magnesium</label>
      <label><input type="radio" name="q1" value="0"> Sauerstoff und Stickstoff</label>
    </div>
    <div class="final-q"><strong>2. pH 7 ist …</strong>
      <label><input type="radio" name="q2" value="0"> sauer</label>
      <label><input type="radio" name="q2" value="1"> neutral</label>
      <label><input type="radio" name="q2" value="0"> basisch</label>
    </div>
    <div class="final-q"><strong>3. TOC bedeutet …</strong>
      <label><input type="radio" name="q3" value="1"> Total Organic Carbon</label>
      <label><input type="radio" name="q3" value="0"> Total Oxygen Control</label>
    </div>
    <div class="final-q"><strong>4. Trinkwasser wird vor der Verteilung …</strong>
      <label><input type="radio" name="q4" value="1"> kontrolliert</label>
      <label><input type="radio" name="q4" value="0"> eingefärbt</label>
    </div>
    <div class="final-q"><strong>5. Hartes Wasser enthält typischerweise …</strong>
      <label><input type="radio" name="q5" value="1"> mehr Calcium- und Magnesiumionen</label>
      <label><input type="radio" name="q5" value="0"> gar keine Mineralien</label>
    </div>
    <button class="primary" id="evaluateQuiz">Wissenstest auswerten</button>
    <div class="feedback" id="finalFb"></div>`;
  document.getElementById("evaluateQuiz").onclick=()=>{
    let score=0, answered=0;
    for(let i=1;i<=5;i++){
      const c=document.querySelector(`input[name="q${i}"]:checked`);
      if(c){answered++;score+=Number(c.value);}
    }
    const fb=document.getElementById("finalFb");
    if(answered<5){fb.textContent="Bitte beantworte zuerst alle fünf Fragen.";fb.style.color="#a86b00";return;}
    fb.textContent=`Du hast ${score} von 5 Punkten erreicht.`;
    fb.style.color=score>=4?"#238451":"#bd3f3f";
    progress[6]=score===5?100:Math.max(progress[6]||0,75); saveProgress(); updateStatus();
  };
}

renderModule(1);
renderFinalQuiz();
updateStatus();
