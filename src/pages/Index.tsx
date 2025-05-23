
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Перенаправляем на страницу авторизации
    navigate('/auth');
  }, [navigate]);

  return null;
};

export default Index;
