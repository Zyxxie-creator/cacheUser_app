import React, { useState, useEffect, useCallback, useMemo } from "react";

const URL = "https://jsonplaceholder.typicode.com/users";

type Company = {
  bs: string;
  catchPhrase: string;
  name: string;
};

type User = {
  id: number;
  email: string;
  name: string;
  phone: string;
  username: string;
  website: string;
  company: Company;
  address: any;
};

interface IButtonProps {
  onClick: () => void;
}

// Кнопка для получения случайного пользователя
const Button = React.memo(({ onClick }: IButtonProps): JSX.Element => {
  return <button onClick={onClick}>Get a random user</button>;
});

interface IUserInfoProps {
  user: User;
}

// Отображение информации о пользователе
const UserInfo = React.memo(({ user }: IUserInfoProps): JSX.Element => {
  return (
    <div>
      <div>
        <span>Username: </span>
        <span>{user?.name}</span>
      </div>
      <div>
        <span>Phone number: </span>
        <span>{user?.phone}</span>
      </div>
    </div>
  );
});

// Кастомный хук useThrottle для задержки вызова функции
function useThrottle(callback: () => void, delay: number) {
  const [lastExecuted, setLastExecuted] = useState(Date.now());

  const throttledCallback = useCallback(() => {
    const now = Date.now();
    if (now - lastExecuted >= delay) {
      callback();
      setLastExecuted(now);
    }
  }, [callback, delay, lastExecuted]);

  return throttledCallback;
}

// Основной компонент приложения
function App(): JSX.Element {
  const [item, setItem] = useState<User | null>(null);

  // Функция для получения случайного пользователя
  const receiveRandomUser = useCallback(async () => {
    try {
      const id = Math.floor(Math.random() * (10 - 1)) + 1;
      const response = await fetch(`${URL}/${id}`);
      const _user = (await response.json()) as User;
      setItem(_user);
      localStorage.setItem("cachedUser", JSON.stringify(_user)); // Сохранение в localStorage
    } catch (error) {
      console.error("ОШИБКА/ERROR", error);
    }
  }, []);

  // Функция-обработчик для кнопки с задержкой вызова
  const handleButtonClick = useThrottle(() => {
    receiveRandomUser();
  }, 1000);

  // Загрузка закэшированного пользователя или получение нового пользователя
  useEffect(() => {
    const cachedUser = localStorage.getItem("cachedUser");
    if (cachedUser) {
      setItem(JSON.parse(cachedUser));
    } else {
      receiveRandomUser();
    }
  }, [receiveRandomUser]);

  const cachedItem = useMemo(() => item, [item]);

  return (
    <div>
      <Button onClick={handleButtonClick} />
      {cachedItem !== null && <UserInfo user={cachedItem} />}
    </div>
  );
}

export default App;
// Code by @Zyxxie https://github.com/Zyxxie-creator
// Тестовое задание
