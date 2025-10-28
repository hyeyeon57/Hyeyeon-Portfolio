'use client';

import { useEffect } from 'react';

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Header와 Footer를 숨기기
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    
    if (header) {
      header.style.display = 'none';
    }
    if (footer) {
      footer.style.display = 'none';
    }
    
    return () => {
      // cleanup: 다른 페이지로 이동할 때 Header와 Footer 다시 표시
      const header = document.querySelector('header');
      const footer = document.querySelector('footer');
      
      if (header) {
        header.style.display = '';
      }
      if (footer) {
        footer.style.display = '';
      }
    };
  }, []);

  return (
    <>
      {children}
    </>
  );
}

