export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-bg mt-12">
      <div className="max-w-6xl mx-auto px-4 py-6 text-center text-text text-sm">
        © {new Date().getFullYear()} Complyn. All rights reserved.
      </div>
    </footer>
  );
}
