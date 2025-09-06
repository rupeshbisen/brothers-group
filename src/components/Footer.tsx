import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-orange-600 via-orange-700 to-orange-800 text-white py-12 mt-16 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative w-28 h-28">
                <Image
                  src="/logo.png"
                  alt="Brother Bal Ganesh Logo"
                  width={100}
                  height={100}
                  className="rounded-full shadow-lg"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  Brother Bal Ganesh
                </h3>
                <p className="text-orange-100 text-sm">Utsav Mandal</p>
              </div>
            </div>
            <p className="text-orange-100 text-sm leading-relaxed">
              Celebrating Ganesh Utsav with devotion and community spirit since
              2015. This year marks our 10th year of celebration! Join us in
              spreading joy and spirituality through our annual celebrations.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6 text-white border-b border-orange-400 pb-2">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="/about"
                  className="text-orange-100 hover:text-white transition-colors duration-300 flex items-center"
                >
                  <span className="w-2 h-2 bg-orange-300 rounded-full mr-3"></span>
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/events"
                  className="text-orange-100 hover:text-white transition-colors duration-300 flex items-center"
                >
                  <span className="w-2 h-2 bg-orange-300 rounded-full mr-3"></span>
                  Events
                </a>
              </li>
              <li>
                <a
                  href="/gallery"
                  className="text-orange-100 hover:text-white transition-colors duration-300 flex items-center"
                >
                  <span className="w-2 h-2 bg-orange-300 rounded-full mr-3"></span>
                  Gallery
                </a>
              </li>
              <li>
                <a
                  href="/donate"
                  className="text-orange-100 hover:text-white transition-colors duration-300 flex items-center"
                >
                  <span className="w-2 h-2 bg-orange-300 rounded-full mr-3"></span>
                  Donate
                </a>
              </li>
              <li>
                <a
                  href="/upload"
                  className="text-orange-100 hover:text-white transition-colors duration-300 flex items-center"
                >
                  <span className="w-2 h-2 bg-orange-300 rounded-full mr-3"></span>
                  Upload Photos
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6 text-white border-b border-orange-400 pb-2">
              Contact Info
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-orange-300 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                <div>
                  <p className="text-orange-100 font-medium">Address:</p>
                  <p className="text-orange-200">Gangabagh, Pardi</p>
                  <p className="text-orange-200">Nagpur 440035</p>
                  <p className="text-orange-200">Maharashtra, India</p>
                </div>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-orange-300 rounded-full mr-3 flex-shrink-0"></span>
                <div>
                  <p className="text-orange-100 font-medium">Phone:</p>
                  <a
                    href="tel:+918408889448"
                    className="text-orange-200 hover:text-white transition-colors"
                  >
                    +91 84088 89448
                  </a>
                </div>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-orange-300 rounded-full mr-3 flex-shrink-0"></span>
                <div>
                  <p className="text-orange-100 font-medium">Email:</p>
                  <a
                    href="mailto:info@brothersbalganesh.com"
                    className="text-orange-200 hover:text-white transition-colors"
                  >
                    info@brothersbalganesh.com
                  </a>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6 text-white border-b border-orange-400 pb-2">
              Follow Us
            </h4>
            <div className="flex space-x-4 mb-6">
              <a
                href="#"
                className="bg-orange-500 hover:bg-orange-400 text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg"
              >
                <span className="sr-only">Facebook</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/brothers_bal_ganesh_mandal?igsh=aGp6ODBwZWN6emhs"
                className="bg-orange-500 hover:bg-orange-400 text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg"
              >
                <span className="sr-only">Instagram</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="bg-orange-500 hover:bg-orange-400 text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg"
              >
                <span className="sr-only">YouTube</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <p className="text-orange-100 text-sm font-medium mb-2">
                Visit Us
              </p>
              <p className="text-orange-200 text-xs">
                Join our celebrations and experience the divine atmosphere
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-orange-400/50 mt-12 pt-8 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-orange-100 text-sm mb-4 md:mb-0">
              &copy; 2024 Brother Bal Ganesh Utsav Mandal. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a
                href="/privacy"
                className="text-orange-100 hover:text-white transition-colors duration-300"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="text-orange-100 hover:text-white transition-colors duration-300"
              >
                Terms of Service
              </a>
              <a
                href="/contact"
                className="text-orange-100 hover:text-white transition-colors duration-300"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
