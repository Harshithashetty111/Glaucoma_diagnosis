import Navbar from "../../components/Navbar";

export default function ModelInfo() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-5xl mx-auto px-5 py-10 space-y-8">
        {/* PAGE HEADER */}
        <header className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-50 drop-shadow-lg tracking-tight">
            Glaucoma XAI Model Overview
          </h1>
          <p className="text-sm text-slate-200 max-w-2xl">
            OCT-based glaucoma staging model with explainable AI (XAI) to
            support clinical decision-making. This page summarizes how the model
            works, what data it was trained on, and how to interpret its
            outputs.
          </p>
        </header>

        {/* MODEL SUMMARY CARD */}
        <section className="glass-card space-y-3">
          <h2 className="text-lg font-bold text-slate-900">
            Model at a Glance
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="rounded-lg border border-slate-200 px-3 py-2">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                Task
              </p>
              <p className="mt-1 font-semibold text-slate-900">
                Glaucoma staging
              </p>
              <p className="text-[11px] text-slate-500">
                Classifies OCT scans into glaucoma severity categories.
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 px-3 py-2">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                Input
              </p>
              <p className="mt-1 font-semibold text-slate-900">
                Macular / RNFL OCT
              </p>
              <p className="text-[11px] text-slate-500">
                Single OCT image (PNG / JPG) preprocessed to model resolution.
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 px-3 py-2">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                Output
              </p>
              <p className="mt-1 font-semibold text-slate-900">
                Stage + probabilities
              </p>
              <p className="text-[11px] text-slate-500">
                Predicted glaucoma stage and per-class probabilities.
              </p>
            </div>
          </div>
        </section>

        {/* PIPELINE SECTION */}
        <section className="glass-card space-y-4">
          <h2 className="text-lg font-bold text-slate-900">
            How the Pipeline Works
          </h2>

          <ol className="list-decimal list-inside text-sm text-slate-800 space-y-2">
            <li>
              <span className="font-semibold">Image upload:</span> An OCT scan
              is uploaded on the <span className="font-semibold">New Prediction</span> page.
              The image is validated and resized to the model&apos;s input
              dimensions.
            </li>
            <li>
              <span className="font-semibold">Pre-processing:</span> Intensity
              normalization, resizing, and optional contrast enhancement are
              applied. Non-image metadata is discarded.
            </li>
            <li>
              <span className="font-semibold">CNN-based feature extraction:</span>{" "}
              A convolutional neural network (e.g. ResNet/EfficientNet-style
              backbone) extracts structural features from RNFL / GC-IPL layers.
            </li>
            <li>
              <span className="font-semibold">Classification head:</span> A
              fully connected layer maps features to glaucoma stages (e.g.
              Normal / Early / Moderate / Advanced). Softmax produces
              probabilities for each class.
            </li>
            <li>
              <span className="font-semibold">Explainability (XAI):</span>{" "}
              Grad-CAM / saliency maps highlight regions of the OCT that most
              influenced the prediction. These can be visualized as overlays in
              future versions of the portal.
            </li>
          </ol>
        </section>

        {/* PERFORMANCE SECTION */}
        <section className="glass-card space-y-3">
          <h2 className="text-lg font-bold text-slate-900">
            Performance (Demo Values)
          </h2>
          <p className="text-xs text-slate-500">
            The following numbers are example metrics for a model trained on a
            curated OCT dataset. Replace with your real results when available.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm">
            <div className="rounded-lg border border-slate-200 px-3 py-2">
              <p className="text-[11px] font-semibold text-slate-500 uppercase">
                Overall Accuracy
              </p>
              <p className="mt-1 text-2xl font-extrabold text-emerald-600">
                91%
              </p>
              <p className="text-[11px] text-slate-500">Test set</p>
            </div>

            <div className="rounded-lg border border-slate-200 px-3 py-2">
              <p className="text-[11px] font-semibold text-slate-500 uppercase">
                Sensitivity (Glaucoma)
              </p>
              <p className="mt-1 text-2xl font-extrabold text-emerald-600">
                93%
              </p>
              <p className="text-[11px] text-slate-500">Detecting disease</p>
            </div>

            <div className="rounded-lg border border-slate-200 px-3 py-2">
              <p className="text-[11px] font-semibold text-slate-500 uppercase">
                Specificity (Normal)
              </p>
              <p className="mt-1 text-2xl font-extrabold text-emerald-600">
                89%
              </p>
              <p className="text-[11px] text-slate-500">Avoiding false alarms</p>
            </div>

            <div className="rounded-lg border border-slate-200 px-3 py-2">
              <p className="text-[11px] font-semibold text-slate-500 uppercase">
                AUC (ROC)
              </p>
              <p className="mt-1 text-2xl font-extrabold text-emerald-600">
                0.94
              </p>
              <p className="text-[11px] text-slate-500">Overall discrimination</p>
            </div>
          </div>
        </section>

        {/* INTERPRETATION SECTION */}
        <section className="glass-card space-y-3">
          <h2 className="text-lg font-bold text-slate-900">
            Interpreting the Output
          </h2>
          <ul className="list-disc list-inside text-sm text-slate-800 space-y-2">
            <li>
              The{" "}
              <span className="font-semibold">Predicted Stage</span> on the New
              Prediction page summarizes the model&apos;s best guess based on
              the OCT scan.
            </li>
            <li>
              <span className="font-semibold">Class probabilities</span> show
              how confident the model is for each stage. Values closer to 50–60%
              indicate more uncertainty.
            </li>
            <li>
              Explainability (XAI) maps highlight retinal regions that
              contributed most to the output. These are meant to{" "}
              <span className="font-semibold">
                support, not replace
              </span>{" "}
              your own interpretation.
            </li>
            <li>
              Always cross-check the model&apos;s suggestion with clinical
              findings (IOP, visual fields, optic disc evaluation, etc.).
            </li>
          </ul>
        </section>

        {/* LIMITATIONS / DISCLAIMER */}
        <section className="glass-card space-y-3">
          <h2 className="text-lg font-bold text-slate-900">
            Limitations & Clinical Disclaimer
          </h2>
          <ul className="list-disc list-inside text-sm text-slate-800 space-y-2">
            <li>
              The model is trained on a{" "}
              <span className="font-semibold">specific dataset</span>; performance
              may vary on different devices, populations, or acquisition
              protocols.
            </li>
            <li>
              Artifacts (motion blur, poor fixation, media opacity) can reduce
              prediction quality. Use only high-quality OCT scans.
            </li>
            <li>
              This tool is intended for{" "}
              <span className="font-semibold">educational / decision-support</span>{" "}
              use in its current version and{" "}
              <span className="font-semibold">
                is not a standalone diagnostic device
              </span>
              .
            </li>
            <li>
              Final diagnosis and management decisions must always remain with
              the treating ophthalmologist / clinician.
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
