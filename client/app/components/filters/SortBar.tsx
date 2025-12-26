export default function SortBar() {
  return (
    <div className="flex justify-end">
      <select className="border px-3 py-2 text-sm">
        <option>Recommended</option>
        <option>Price: Low to High</option>
        <option>Price: High to Low</option>
        <option>Newest</option>
      </select>
    </div>
  );
}
