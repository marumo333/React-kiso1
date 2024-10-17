import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Form from './Form'; // スレッド作成フォームのコンポーネント

const AppContent = () => {
    const navigate = useNavigate();
    const clickedToPageBtn = () => {
        navigate('/create-thread');
    };
    const [threads, setThreads] = useState([]);
    const getData = () => {
        fetch('https://railway.bulletinboard.techtrain.dev/threads')
            .then((response) => {
                if (!response.ok) {
                    throw new Error("APIからのデータの取得に失敗しました。")
                }
                return response.json();
            })
            .then((data) => {
                setThreads(data)
                console.log(data)
            })
            .catch((error) => {
                console.error("エラー", error)
            });
    };
    useEffect(() => {
        getData();
    }, []);

    return (
        <>
            <header>掲示板</header>
            <p>新着スレッド</p>
                        <button onClick={clickedToPageBtn}>スレッドを立てる</button>
                        <ul>
                            {threads.length > 0 && threads.map((thread, id) => (
                                <li key={id}>{thread.title}</li>//スレッド情報をリスト表示
                            ))}
                        </ul>
        </>
    );
};
export const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AppContent />} />
                <Route path="/create-thread" element={<Form />} />
            </Routes>
        </Router>
    );
};

export default App