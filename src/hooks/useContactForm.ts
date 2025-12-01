import { useState } from 'react';
import { API_ENDPOINTS } from '@/constants/api';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

interface UseContactFormReturn {
  formData: ContactFormData;
  isSubmitted: boolean;
  isSubmitting: boolean;
  error: string | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
}

const initialFormData: ContactFormData = {
  name: '',
  email: '',
  message: '',
};

/**
 * 연락 폼 관리 훅
 * - 폼 상태 관리
 * - 제출 처리
 * - 에러 핸들링
 */
export function useContactForm(): UseContactFormReturn {
  const [formData, setFormData] = useState<ContactFormData>(initialFormData);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // 입력 시 에러 초기화
    if (error) {
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('모든 필드를 입력해주세요.');
      return;
    }

    if (!formData.email.includes('@')) {
      setError('올바른 이메일 주소를 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(API_ENDPOINTS.SEND_EMAIL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        // 폼 초기화
        setFormData(initialFormData);
        setIsSubmitted(true);

        // 3초 후 성공 메시지 숨기기
        setTimeout(() => {
          setIsSubmitted(false);
        }, 3000);
      } else {
        setError(result.error || '메시지 전송에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (err) {
      console.error('연락 정보 저장 오류:', err);
      setError('메시지 전송 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setIsSubmitted(false);
    setError(null);
  };

  return {
    formData,
    isSubmitted,
    isSubmitting,
    error,
    handleChange,
    handleSubmit,
    resetForm,
  };
}
