import React from "react";
import { Youtube, Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid md:grid-cols-3 gap-16">

                    {/* Logo + Description */}
                    <div className="space-y-5">
                        <h2 className="text-4xl font-bold text-black tracking-tight">
                            NowWear
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            Nơi mang đến những sản phẩm thời trang chất lượng và phong cách cho mọi nhà. Khẳng định phong cách của bạn với NowWear.
                        </p>
                        
                        {/* Social Media Icons */}
                        <div className="flex gap-3 pt-3">
                            <a href="#" className="group bg-black p-3 rounded-full hover:bg-gray-800 transition-all duration-300 transform hover:scale-110">
                                <Youtube className="w-5 h-5 text-white" />
                            </a>
                            <a href="#" className="group bg-black p-3 rounded-full hover:bg-gray-800 transition-all duration-300 transform hover:scale-110">
                                <Instagram className="w-5 h-5 text-white" />
                            </a>
                            <a href="#" className="group bg-black p-3 rounded-full hover:bg-gray-800 transition-all duration-300 transform hover:scale-110">
                                <Facebook className="w-5 h-5 text-white" />
                            </a>
                        </div>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="text-sm font-bold text-black mb-6 tracking-wider">
                            CÔNG TY
                        </h3>
                        <ul className="space-y-3">
                            {['Trang chủ', 'Về chúng tôi', 'Giao hàng', 'Chính sách bảo mật'].map((item) => (
                                <li key={item} className="group cursor-pointer">
                                    <span className="text-gray-600 hover:text-black transition-colors duration-200 relative">
                                        {item}
                                        <span className="absolute bottom-0 left-0 w-0 h-px bg-black group-hover:w-full transition-all duration-300"></span>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-sm font-bold text-black mb-6 tracking-wider">
                            LIÊN HỆ
                        </h3>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 group cursor-pointer">
                                <Phone className="w-4 h-4 text-black" />
                                <span className="text-gray-600 hover:text-black transition-colors duration-200">
                                    0356724126
                                </span>
                            </li>
                            <li className="flex items-start gap-3 group cursor-pointer">
                                <Mail className="w-4 h-4 text-black mt-1" />
                                <span className="text-gray-600 hover:text-black transition-colors duration-200 break-all">
                                    lamdv15042005@gmail.com
                                </span>
                            </li>
                            <li className="flex items-center gap-3 group cursor-pointer">
                                <MapPin className="w-4 h-4 text-black" />
                                <span className="text-gray-600 hover:text-black transition-colors duration-200">
                                    Hồ Chí Minh, Việt Nam
                                </span>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-200 mt-12 pt-8">
                    <p className="text-center text-gray-500 text-sm">
                        © 2025 <span className="text-black font-semibold">NowWear</span> — All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
