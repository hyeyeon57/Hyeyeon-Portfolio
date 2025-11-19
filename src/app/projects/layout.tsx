'use client';

import { useEffect } from 'react';

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Footer만 숨기기 (GNB는 유지)
    const footer = document.querySelector('footer');
    
    if (footer) {
      footer.style.display = 'none';
    }
    
    return () => {
      // cleanup: 다른 페이지로 이동할 때 Footer 다시 표시
      const footer = document.querySelector('footer');
      
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

