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
      console.log('📤 메시지 전송 시작:', { name: formData.name, email: formData.email });
      
      const response = await fetch(API_ENDPOINTS.SEND_EMAIL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('📥 서버 응답 받음:', { 
        status: response.status, 
        ok: response.ok,
        statusText: response.statusText 
      });

      // 응답 본문 파싱 시도
      let result;
      try {
        result = await response.json();
        console.log('📋 응답 데이터:', result);
      } catch (parseError) {
        // JSON 파싱 실패 시 텍스트로 읽기 시도
        const text = await response.text();
        console.error('❌ 응답 파싱 오류:', { text, parseError, status: response.status });
        throw new Error('서버 응답을 처리할 수 없습니다.');
      }

      // 응답 처리: error 필드가 없고 message 필드가 있으면 성공
      if (response.ok && response.status === 200 && !result?.error) {
        // 성공 응답 처리
        console.log('✅ 메시지 전송 성공:', result);
        
        // 폼 초기화
        setFormData(initialFormData);
        setIsSubmitted(true);
        setError(null); // 에러 초기화

        // 5초 후 성공 메시지 숨기기
        setTimeout(() => {
          setIsSubmitted(false);
        }, 5000);
      } else {
        // 에러 응답 처리
        // result.error가 있으면 그것을 사용, 없으면 result.message를 사용, 둘 다 없으면 기본 메시지
        const errorMessage = result?.error || 
          (result?.message && response.status !== 200 ? result.message : null) ||
          '메시지 전송에 실패했습니다. 다시 시도해주세요.';
        
        console.error('❌ 메시지 전송 실패:', { 
          status: response.status, 
          ok: response.ok,
          error: errorMessage, 
          result,
          hasError: !!result?.error,
          hasMessage: !!result?.message
        });
        
        setError(errorMessage);
        setIsSubmitted(false); // 실패 시 submitted 상태 해제
      }
    } catch (err: any) {
      console.error('❌ 연락 정보 저장 오류:', err);
      const errorMessage = err?.message || '메시지 전송 중 오류가 발생했습니다. 네트워크 연결을 확인하고 다시 시도해주세요.';
      setError(errorMessage);
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
