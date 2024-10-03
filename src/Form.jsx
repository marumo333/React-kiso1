import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Form({ threads = [], setThreads }) {//デフォルト値を設定
  const [formData, setFormData] = useState({ newThreadTitle: '' });
  const navigate = useNavigate(); // useNavigateフックを使用

  const clickedToHomeBtn = () => {
    navigate('/');
  };

  const publishNewThreadTitle = () => {
    if (!formData.newThreadTitle) return; // タイトルが空の場合は何もしないでおk
    const newThread = { title: formData.newThreadTitle };

    fetch('https://railway.bulletinboard.techtrain.dev/threads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newThread),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("スレッドの作成が失敗しました");
        }
        return response.json();
      })
      .then((data) => {
        setThreads([...threads, data]); // 親コンポーネントの状態を更新
        setFormData({ newThreadTitle: '' })// 入力フィールドをクリア
        navigate('/'); // ホームに戻る
      })
      .catch((error) => {
        console.error("エラー", error);
        alert("スレッドの作成が成功しました")
      });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData);
    publishNewThreadTitle();
  };

  return (
    <div>
      <div className='page1Container'>
        <h1>スレッド作成画面</h1>
        <button className='toHomeBtn' onClick={clickedToHomeBtn}>Homeに戻る</button>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="newThreadTitle"
          value={formData.newThreadTitle}
          onChange={handleInputChange}
          placeholder="スレッドのタイトルを入力"
        />
        <button type="submit">送信する</button>
      </form>
      <ul>
        {threads.length > 0 ? ( // threadsが空でない場合のみ表示
          threads.map((thread, index) => (
            <li key={index}>{thread.title}</li> // スレッドのタイトルをリスト表示
          ))
        ) : (
          <li>スレッドがありません</li> // スレッドがない場合のメッセージ
        )}
      </ul>
    </div>
  );
}

export default Form;
