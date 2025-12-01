import React from 'react';

const NewsletterBox = () => {

    const onSubmitHandler = (event) => {
        event.preventDefault();
        alert("Cảm ơn bạn đã đăng ký nhận tin!");
    }

    return (
        <div className="text-center py-16 px-4 sm:px-10 bg-gray-50 rounded-xl shadow-lg">
            {/* Tiêu đề */}
            <p className="text-3xl sm:text-4xl font-bold text-gray-800">
                Đăng ký ngay & nhận 20% giảm giá
            </p>

            {/* Description */}
            <p className="text-gray-500 mt-3 text-sm sm:text-base">
                Nhận thông tin về các sản phẩm mới và ưu đãi hấp dẫn từ cửa hàng của chúng tôi.
            </p>

            {/* Form đăng ký */}
            <form className="flex flex-col sm:flex-row items-center gap-3 bg-white shadow-md rounded-full p-2 mt-6 w-full max-w-xl mx-auto">
                <input
                    type="email"
                    className="w-full flex-1 px-4 py-3 rounded-full outline-none text-gray-700 placeholder-gray-400 border border-gray-300 focus:border-black transition-all duration-200"
                    placeholder="Nhập email của bạn"
                    required
                />
                <button
                    type="submit"
                    onClick={onSubmitHandler}
                    className="bg-black text-white text-sm sm:text-base font-semibold px-8 py-3 rounded-full hover:bg-gray-800 transition-all duration-200"
                >
                    ĐĂNG KÝ
                </button>
            </form>
        </div>
    );
}

export default NewsletterBox;
