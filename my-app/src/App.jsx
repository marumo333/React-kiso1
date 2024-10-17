import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate} from 'react-router-dom';
import Form from './Form'; // スレッド作成フォームのコンポーネント
import FormDetail from './FormDetail'
const AppContent = () => {
    const navigate = useNavigate();
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
    const handleThreadClick = (threadId) => {
        navigate(`/threads/${threadId}`); // スレッドIDを含むURLにナビゲート
    };
    const clickedToPageBtn = () => {
        navigate('/create-thread');
    };

    return (
        <>
            <div>
            <header>掲示板</header>
            <p>新着スレッド</p>
                        <button onClick={clickedToPageBtn}>スレッドを立てる</button>
                        <h1>投稿一覧</h1>
                        <ul>
                {threads.length > 0 && threads.map((thread) => (
                    <li
                        key={thread.id}
                        onClick={() => handleThreadClick(thread.id)}
                        style={{ cursor: 'pointer', color: 'black' }}
                    >
                        {thread.title}
                    </li>
                ))}
            </ul>
            </div>
        </>
    );
};
export const App = () => {
    const [threads, setThreads] = useState([]);
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AppContent threads={threads} setThreads={setThreads}/>} />
                <Route path="/create-thread" element={<Form setThreads={setThreads} />} />
                <Route path="/threads/:thread_id" element={<FormDetail/>}/>

            </Routes>
        </Router>
    );
};

export default App