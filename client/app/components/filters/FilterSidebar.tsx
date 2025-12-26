export default function FilterSidebar() {
  return (
    <div className="space-y-6">
      <h3 className="text-sm font-semibold">FILTERS</h3>

      <div>
        <h4 className="mb-2 text-sm font-medium">CATEGORIES</h4>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" />
          T-Shirts
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" />
          Lounge T-Shirts
        </label>
      </div>

      <div>
        <h4 className="mb-2 text-sm font-medium">BRAND</h4>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" />
          Nike
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" />
          Puma
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" />
          Adidas
        </label>
      </div>
    </div>
  );
}
