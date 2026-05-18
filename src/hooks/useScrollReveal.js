// ==================== FILE: useScrollReveal.js ====================
// Mô tả: Custom Hook tạo hiệu ứng "cuộn để hiện" (scroll-reveal animation)
// cho các section/component khi người dùng cuộn trang đến vị trí của chúng.
// Sử dụng IntersectionObserver API (Web API) để theo dõi khi element xuất hiện trong viewport.
// Hiệu suất cao hơn so với lắng nghe sự kiện scroll truyền thống.
// ==================================================================

import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Custom hook cho hiệu ứng scroll-reveal.
 * @param {Object} options - Các tùy chọn cấu hình
 * @param {number} options.threshold - Tỷ lệ phần trăm element hiển thị để kích hoạt (0-1). VD: 0.1 = 10% hiện trong viewport
 * @param {string} options.rootMargin - Margin bao quanh vùng quan sát (giống CSS margin). VD: '0px', '-50px'
 * @param {boolean} options.triggerOnce - Chỉ kích hoạt 1 lần duy nhất (mặc định: true). Nếu false → ẩn/hiện mỗi khi cuộn qua
 * @returns {{ ref: React.RefCallback, isVisible: boolean }} - ref: gắn vào element cần quan sát, isVisible: trạng thái hiển thị
 */
export default function useScrollReveal({
  threshold = 0.1,       // Mặc định: kích hoạt khi 10% element hiện trong viewport
  rootMargin = '0px',    // Mặc định: không có margin thêm
  triggerOnce = true,    // Mặc định: chỉ kích hoạt 1 lần (element hiện rồi giữ nguyên)
} = {}) {
  const [isVisible, setIsVisible] = useState(false);   // Trạng thái: element có đang hiển thị trong viewport không
  const observerRef = useRef(null);                     // Lưu reference đến IntersectionObserver instance
  const elementRef = useRef(null);                      // Lưu reference đến DOM element đang được quan sát

  // ===== Hàm dọn dẹp Observer =====
  // Ngắt kết nối observer hiện tại để tránh memory leak
  const cleanup = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect(); // Ngắt kết nối tất cả element đang quan sát
      observerRef.current = null;       // Reset reference
    }
  }, []);

  // ===== Callback Ref =====
  // Sử dụng callback ref thay vì useRef thông thường.
  // Lý do: callback ref được gọi ngay khi DOM node được gắn/gỡ,
  // giúp đảm bảo observer luôn quan sát đúng element.
  const ref = useCallback((node) => {
    cleanup();                  // Dọn dẹp observer cũ (nếu có)
    elementRef.current = node;  // Lưu reference đến DOM node mới

    if (!node) return; // Nếu node là null (element bị unmount) → dừng lại

    // Tạo IntersectionObserver mới để theo dõi element
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Element đã xuất hiện trong viewport → đánh dấu isVisible = true
          setIsVisible(true);
          if (triggerOnce && observerRef.current) {
            // Nếu chỉ kích hoạt 1 lần → ngừng quan sát element này
            observerRef.current.unobserve(node);
          }
        } else if (!triggerOnce) {
          // Nếu cho phép kích hoạt nhiều lần → ẩn element khi rời khỏi viewport
          setIsVisible(false);
        }
      },
      { threshold, rootMargin } // Truyền các tùy chọn cho observer
    );

    observerRef.current.observe(node); // Bắt đầu quan sát element
  }, [threshold, rootMargin, triggerOnce, cleanup]); // Tạo lại khi các tùy chọn thay đổi

  // ===== Dọn dẹp khi component unmount =====
  // Đảm bảo observer được ngắt kết nối khi component bị gỡ khỏi DOM
  useEffect(() => {
    return cleanup; // Trả về hàm cleanup để React gọi khi unmount
  }, [cleanup]);

  // Trả về:
  // - ref: gắn vào element cần hiệu ứng (VD: <section ref={ref}>)
  // - isVisible: dùng để toggle CSS class/animation (VD: isVisible ? 'opacity-100' : 'opacity-0')
  return { ref, isVisible };
}
