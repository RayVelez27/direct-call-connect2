export default function ExpertMatching() {
  return (
    <section className="py-16 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-card border border-border p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground font-['Playfair_Display']">
              Looking for the perfect creator?
            </h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-xl">
              Tell us what you're looking for and we'll match you with verified creators who fit your style and preferences.
            </p>
          </div>
          <button className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 transition-colors whitespace-nowrap">
              Get matched
          </button>
        </div>
      </div>
    </section>
  );
}
