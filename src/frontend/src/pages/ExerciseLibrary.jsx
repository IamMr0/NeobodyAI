export default function ExerciseLibrary() {
  return (
    <div className="p-margin-mobile bg-background h-full overflow-y-auto">
      {/* Hero Section */}
      <section className="mb-stack-lg">
        <div className="bg-primary-container p-stack-lg border-thick border-on-surface shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row justify-between items-center gap-stack-lg">
          <div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface-variant uppercase mb-stack-sm">THE VAULT</h1>
            <p className="font-body-lg text-body-lg max-w-xl text-on-surface">Your definitive database of movement engineering. Browse over 500+ AI-analyzed exercises to optimize your mechanical tension and muscle hypertrophy.</p>
          </div>
          <div className="flex-shrink-0">
            <div className="w-32 h-32 bg-secondary border-thick border-on-surface flex items-center justify-center rotate-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <span className="material-symbols-outlined text-on-secondary text-5xl" data-icon="terminal">terminal</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="mb-stack-lg">
        <div className="flex flex-wrap gap-stack-md items-center">
          <span className="font-label-bold text-label-bold uppercase text-on-surface-variant">Filter by Equipment:</span>
          <button className="font-label-bold text-label-bold px-stack-md py-stack-sm border-thin border-on-surface bg-surface-container-lowest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-primary-container transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
            Dumbbells
          </button>
          <button className="font-label-bold text-label-bold px-stack-md py-stack-sm border-thin border-on-surface bg-primary-container shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-primary-container transition-all">
            Bodyweight
          </button>
          <button className="font-label-bold text-label-bold px-stack-md py-stack-sm border-thin border-on-surface bg-surface-container-lowest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-primary-container transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
            Barbell
          </button>
          <button className="font-label-bold text-label-bold px-stack-md py-stack-sm border-thin border-on-surface bg-surface-container-lowest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-primary-container transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
            Kettlebell
          </button>
          <button className="ml-auto flex items-center gap-2 font-label-bold text-label-bold px-stack-md py-stack-sm border-thin border-on-surface bg-surface-container-lowest">
            <span className="material-symbols-outlined" data-icon="filter_list">filter_list</span>
            More Filters
          </button>
        </div>
      </section>

      {/* Exercise Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-stack-lg">
        {/* Card 1 */}
        <div className="group bg-surface-container-lowest border-thick border-on-surface shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col overflow-hidden">
          <div className="relative h-56 w-full border-b-thick border-on-surface">
            <img alt="Barbell Back Squat" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBB1Z5Zy7hYWsuYK7JX3ThjDtKbDhYk2o53lBIPwsk13fVRiZXO3ZfxcCTgTxUDVUACktJZvggV3XT6zh4HoOC-yxho9P_33uQyFktPyJBkff2UXYWCkZx2lw5cGZUSgeYLqohd3zwaYRvLGAqYIT9vaZxaakPmOx2Lbcia52SbayB_ZJQVJh1r_AFWmwhqqeMLtLoU6XWvh4nGFXb2fKY3Hp7v60eXEsCAn7tvUbcXOrTUV9jvIz9tG427bxB--GBv1Tlrg5GC05N7" />
            <div className="absolute top-stack-sm right-stack-sm bg-tertiary-fixed-dim border-thin border-on-surface px-stack-sm py-1 font-label-bold text-label-sm text-on-tertiary-fixed uppercase">
              AI Recommended
            </div>
          </div>
          <div className="p-stack-md flex-grow">
            <div className="flex justify-between items-start mb-stack-sm">
              <h3 className="font-headline-md text-headline-md uppercase">Barbell Back Squat</h3>
              <span className="material-symbols-outlined text-primary" data-icon="star" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            </div>
            <div className="flex flex-wrap gap-stack-sm mb-stack-md">
              <span className="font-label-bold text-label-sm border-thin border-on-surface px-2 py-0.5 bg-surface-container">Quads</span>
              <span className="font-label-bold text-label-sm border-thin border-on-surface px-2 py-0.5 bg-surface-container">Glutes</span>
              <span className="font-label-bold text-label-sm border-thin border-on-surface px-2 py-0.5 bg-surface-container">Core</span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant mb-stack-lg">The king of lower body movements. AI analysis shows 92% fiber recruitment in your lateral quads based on previous form data.</p>
          </div>
          <div className="p-stack-md pt-0">
            <button className="w-full py-stack-sm border-thin border-on-surface font-label-bold text-label-bold uppercase bg-primary-container hover:bg-primary hover:text-on-primary transition-colors">
              View Technique
            </button>
          </div>
        </div>

        {/* Card 2 */}
        <div className="group bg-surface-container-lowest border-thick border-on-surface shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col overflow-hidden">
          <div className="relative h-56 w-full border-b-thick border-on-surface">
            <img alt="DB Lateral Raise" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOEAEFnR6dllPN2olSCUP1EUuaN2Ii_xl3ONMI3hBjMWsoQaZt6hw-ODckVFk4fpGxEZHKc7rKGBsQj65H_2KOlp2effRe0nxs60JMGU_ydqMM4y8UDbmhLoEQT-R2MBGpNz4CxOniRQY2pSbhVlqgqgkL-cAyLIHjiPHkW8600AWp1l4PXQ6mww93UP40nMtBeBjRdG7niWlGrFQgAcYACJMUMXvcw7WF-1YXO5RSnsJ2ChX8WmWsC5udJO2v60ncKRTKbLM09rWi" />
            <div className="absolute top-stack-sm right-stack-sm bg-secondary-container border-thin border-on-surface px-stack-sm py-1 font-label-bold text-label-sm text-on-secondary-container uppercase">
              Active
            </div>
          </div>
          <div className="p-stack-md flex-grow">
            <div className="flex justify-between items-start mb-stack-sm">
              <h3 className="font-headline-md text-headline-md uppercase">DB Lateral Raise</h3>
              <span className="material-symbols-outlined text-outline" data-icon="star">star</span>
            </div>
            <div className="flex flex-wrap gap-stack-sm mb-stack-md">
              <span className="font-label-bold text-label-sm border-thin border-on-surface px-2 py-0.5 bg-surface-container">Lateral Delts</span>
              <span className="font-label-bold text-label-sm border-thin border-on-surface px-2 py-0.5 bg-surface-container">Upper Traps</span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant mb-stack-lg">Isolated tension for shoulder width. AI suggests a 2-second pause at peak contraction to break your current plateau.</p>
          </div>
          <div className="p-stack-md pt-0">
            <button className="w-full py-stack-sm border-thin border-on-surface font-label-bold text-label-bold uppercase bg-surface-variant hover:bg-primary-container transition-colors">
              View Technique
            </button>
          </div>
        </div>

        {/* Card 3 */}
        <div className="group bg-surface-container-lowest border-thick border-on-surface shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col overflow-hidden">
          <div className="relative h-56 w-full border-b-thick border-on-surface">
            <img alt="Bulgarian Split Squat" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVojos-w2knXbxxvLrrR2tHflUkRk3EkIEhJaXjMV97BI_vICt4RAm0J8_n-e7v3KSXJosH5B8BzrM-jar_huoxDYLfj2SSZMZ_bR9Kol00npK8--jYZ19U6Dm0vWCN4c27gvcO05gB0yZrJBaiFRxn8LViBwcB8jvSOYVbUkNJwY8lDf6nBaI6Rh3JofVsJUPpBDxWcfbIAtBYBoz7oyr4i2Db9wV3NAIUzyzoFcC33S5nZcdZpJJE-7ZiIZR7QqydRzY9OJtCXun" />
            <div className="absolute top-stack-sm right-stack-sm bg-tertiary-fixed-dim border-thin border-on-surface px-stack-sm py-1 font-label-bold text-label-sm text-on-tertiary-fixed uppercase">
              AI Recommended
            </div>
          </div>
          <div className="p-stack-md flex-grow">
            <div className="flex justify-between items-start mb-stack-sm">
              <h3 className="font-headline-md text-headline-md uppercase">Bulgarian Split Squat</h3>
              <span className="material-symbols-outlined text-primary" data-icon="star" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            </div>
            <div className="flex flex-wrap gap-stack-sm mb-stack-md">
              <span className="font-label-bold text-label-sm border-thin border-on-surface px-2 py-0.5 bg-surface-container">Unilateral Quads</span>
              <span className="font-label-bold text-label-sm border-thin border-on-surface px-2 py-0.5 bg-surface-container">Balance</span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant mb-stack-lg">Superior hypertrophy through deep eccentric loading. Corrects 12% strength imbalance detected in your left leg.</p>
          </div>
          <div className="p-stack-md pt-0">
            <button className="w-full py-stack-sm border-thin border-on-surface font-label-bold text-label-bold uppercase bg-primary-container hover:bg-primary hover:text-on-primary transition-colors">
              View Technique
            </button>
          </div>
        </div>

        {/* Card 4 */}
        <div className="group bg-surface-container-lowest border-thick border-on-surface shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col overflow-hidden">
          <div className="relative h-56 w-full border-b-thick border-on-surface">
            <img alt="Deadlift" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6iAto6Xjqd9LuIkxtjkZWSVvn9PqKs8Uh4YI1ao-qYGudHrz4waM1f7wLjvTa59d_0hcRI2-0jYT4Jekm8qW3xR9lj5mnDHPfi0_nDHyufI0k0rPvLqRtP7P12kV9QjdOYEKrNXfdlA8g3VccvRq3Ye71blWxGNLNNL1928FGP44cALw_u_Wb9EfgOJc-QculOwZadgYYsT2UBV8o9kEqSBirA4tCO3f-lWSeRRzdeO4Emfd1RyJyULPn0q9bPInH1AWz5_9v8S0j" />
          </div>
          <div className="p-stack-md flex-grow">
            <div className="flex justify-between items-start mb-stack-sm">
              <h3 className="font-headline-md text-headline-md uppercase">Conventional Deadlift</h3>
              <span className="material-symbols-outlined text-outline" data-icon="star">star</span>
            </div>
            <div className="flex flex-wrap gap-stack-sm mb-stack-md">
              <span className="font-label-bold text-label-sm border-thin border-on-surface px-2 py-0.5 bg-surface-container">Posterior Chain</span>
              <span className="font-label-bold text-label-sm border-thin border-on-surface px-2 py-0.5 bg-surface-container">Back</span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant mb-stack-lg">Fundamental posterior chain development. Form analysis tools active for spine alignment tracking.</p>
          </div>
          <div className="p-stack-md pt-0">
            <button className="w-full py-stack-sm border-thin border-on-surface font-label-bold text-label-bold uppercase bg-surface-variant hover:bg-primary-container transition-colors">
              View Technique
            </button>
          </div>
        </div>

        {/* Card 5 */}
        <div className="group bg-surface-container-lowest border-thick border-on-surface shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col overflow-hidden">
          <div className="relative h-56 w-full border-b-thick border-on-surface">
            <img alt="Dips" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD63UPtvGuIuHfgnOu4LQFgh_qbvmH9QyV_9te0XwASIcT-T_5RCa0eBYBTAyIH2W3omTpdy4TctWSQCrkckqv0j09tMu95iN4S1P6LUs0IjrpHc1Kj4OeTf6pMUll_0JuscKAEc9WBHpVzHqbQiPviVly3SeUmxRHm7gy96vErXfcgTWsPuwrVcMEFaOwiBTxkzudIwQpug04TQsGGVkK1DrbM3fTzvJycxhkViDg1onrZVwTX6CjSDkYsVdf35lbzaSQmV5FRYU0B" />
            <div className="absolute top-stack-sm right-stack-sm bg-secondary-container border-thin border-on-surface px-stack-sm py-1 font-label-bold text-label-sm text-on-secondary-container uppercase">
              Active
            </div>
          </div>
          <div className="p-stack-md flex-grow">
            <div className="flex justify-between items-start mb-stack-sm">
              <h3 className="font-headline-md text-headline-md uppercase">Chest Dips</h3>
              <span className="material-symbols-outlined text-primary" data-icon="star" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            </div>
            <div className="flex flex-wrap gap-stack-sm mb-stack-md">
              <span className="font-label-bold text-label-sm border-thin border-on-surface px-2 py-0.5 bg-surface-container">Lower Chest</span>
              <span className="font-label-bold text-label-sm border-thin border-on-surface px-2 py-0.5 bg-surface-container">Triceps</span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant mb-stack-lg">The squat of the upper body. Current AI recommendation: 3 sets to technical failure with 20kg added weight.</p>
          </div>
          <div className="p-stack-md pt-0">
            <button className="w-full py-stack-sm border-thin border-on-surface font-label-bold text-label-bold uppercase bg-surface-variant hover:bg-primary-container transition-colors">
              View Technique
            </button>
          </div>
        </div>

        {/* AI Insight Card */}
        <div className="col-span-full bg-surface border-thick border-on-surface p-stack-lg flex flex-col md:flex-row gap-stack-lg items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-full bg-primary-container -skew-x-12 translate-x-16 z-0"></div>
          <div className="relative z-10 md:w-2/3">
            <div className="inline-flex items-center gap-2 px-stack-sm py-1 border-thin border-on-surface bg-primary mb-stack-sm">
              <span className="material-symbols-outlined text-on-primary text-sm" data-icon="auto_awesome">auto_awesome</span>
              <span className="font-label-bold text-label-sm text-on-primary uppercase">Vault Intelligent Insight</span>
            </div>
            <h2 className="font-headline-lg text-headline-lg mb-stack-sm">Optimize Your Exercise Selection</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">Your current "Library" engagement shows a 40% bias toward pull movements. The AI recommends adding more **horizontal pushing** exercises to maintain scapular health and joint symmetry.</p>
          </div>
          <div className="relative z-10 md:w-1/3 flex justify-center">
            <button className="bg-primary-container text-on-primary-container font-label-bold text-label-bold px-stack-lg py-stack-md border-thick border-on-surface shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all uppercase">
              View Recommendations
            </button>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="mt-stack-lg pt-stack-lg border-t-thick border-on-surface flex flex-col md:flex-row justify-between items-center gap-stack-md">
        <span className="font-label-bold text-label-bold uppercase opacity-50">Iron AI / The Vault / v2.4.0</span>
        <div className="flex gap-stack-lg">
          <a className="font-label-bold text-label-bold uppercase hover:text-primary transition-colors" href="#">Glossary</a>
          <a className="font-label-bold text-label-bold uppercase hover:text-primary transition-colors" href="#">Anatomy Map</a>
          <a className="font-label-bold text-label-bold uppercase hover:text-primary transition-colors" href="#">Research Papers</a>
        </div>
      </footer>
    </div>
  );
}
