import Navbar from "../../components/Navbar";

export default function Home() {
  const doctorName = localStorage.getItem("doctorName") || "Doctor";

  return (
  <div className="min-h-screen">
    <Navbar />
    ...


      <main className="max-w-6xl mx-auto px-4 py-8 space-y-10">
        {/* Hero */}
        <section className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-medicalBlue mb-4">
              Welcome, Dr. {doctorName}
            </h1>
            <p className="text-slate-700 text-lg">
              AI-assisted OCT analysis for glaucoma staging with explainable
              insights. Support your clinical decisions with quantitative RNFL
              and GC-IPL metrics, probability scores and feature-based
              explanations.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 flex items-center justify-center">
            <div className="w-40 h-40 rounded-full border-4 border-medicalBlue flex items-center justify-center">
              <span className="text-medicalBlue font-semibold text-center">
                OCT
                <br />
                Glaucoma
                <br />
                XAI
              </span>
            </div>
          </div>
        </section>

        {/* What is Glaucoma */}
        <section className="bg-white rounded-2xl shadow p-6 space-y-2">
          <h2 className="text-xl font-semibold text-medicalBlue">
            What is Glaucoma?
          </h2>
          <p className="text-slate-700">
            Glaucoma is a chronic, progressive optic neuropathy characterized by
            loss of retinal ganglion cells and corresponding visual field
            damage. Structural changes typically include thinning of the retinal
            nerve fiber layer (RNFL) and ganglion cell–inner plexiform layer
            (GC-IPL). Vision loss from glaucoma is irreversible, which makes
            early detection and monitoring critical.
          </p>
        </section>

        {/* Why early detection matters */}
        <section>
          <h2 className="text-xl font-semibold text-medicalBlue mb-3">
            Why Early Detection Matters
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <InfoCard
              title="Silent progression"
              text="Many patients are asymptomatic in early stages. Significant optic nerve damage can occur before visual symptoms are noticed."
            />
            <InfoCard
              title="Irreversible damage"
              text="Once retinal ganglion cells are lost, functional vision cannot be restored. Early intervention is the only way to preserve vision."
            />
            <InfoCard
              title="Role of OCT"
              text="OCT enables high-resolution imaging of RNFL and GC-IPL thickness, allowing detection of structural changes before visual field loss appears."
            />
          </div>
        </section>

        {/* Stages */}
        <section>
          <h2 className="text-xl font-semibold text-medicalBlue mb-3">
            Glaucoma Stages Overview
          </h2>
          <div className="grid md:grid-cols-4 gap-4 text-sm">
            <StageCard
              title="Normal"
              description="Healthy RNFL and GC-IPL thickness with normal optic nerve head appearance and full visual field."
            />
            <StageCard
              title="Early"
              description="Focal RNFL / GC-IPL thinning, subtle optic disc changes, minimal or no functional visual field loss."
            />
            <StageCard
              title="Moderate"
              description="More pronounced structural thinning with repeatable visual field defects affecting one or more quadrants."
            />
            <StageCard
              title="Advanced"
              description="Severe RNFL and GC-IPL loss, marked cupping and dense visual field defects with central vision at risk."
            />
          </div>
        </section>

        {/* How AI system helps */}
        <section className="bg-white rounded-2xl shadow p-6 space-y-2">
          <h2 className="text-xl font-semibold text-medicalBlue">
            How This AI System Helps
          </h2>
          <ul className="list-disc list-inside text-slate-700 space-y-1 text-sm">
            <li>Uses OCT-derived RNFL and GC-IPL thickness features.</li>
            <li>
              Predicts glaucoma stage: Normal, Early, Moderate or Advanced.
            </li>
            <li>Provides a calibrated probability score for the stage.</li>
            <li>
              Generates feature-based explanations (e.g. RNFL inferior thinning,
              RNFL symmetry).
            </li>
            <li>
              Stores patient-wise prediction history for longitudinal tracking
              and follow-up.
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}

type InfoCardProps = { title: string; text: string };
function InfoCard({ title, text }: InfoCardProps) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-slate-700 text-sm">{text}</p>
    </div>
  );
}

type StageCardProps = { title: string; description: string };
function StageCard({ title, description }: StageCardProps) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-slate-700 text-sm">{description}</p>
    </div>
  );
}
