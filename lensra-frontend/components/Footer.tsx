export default function Footer() {
  return (
    <footer className="bg-gray-100 p-6 text-center text-gray-600 mt-8">
      <p>&copy; {new Date().getFullYear()} Lensra Gifts. All rights reserved.</p>
      <p>
        Follow us on <a href="#" className="text-blue-600">Instagram</a> | 
        <a href="#" className="text-blue-600 ml-2">Twitter</a>
      </p>
    </footer>
  );
}
