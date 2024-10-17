import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Form({ setThreads }) {// 親コンポーネントからsetThreadsを受け取る
  const [formData, setFormData] = useState({ newThreadTitle: '' });
  const navigate = useNavigate(); // useNavigateフックを使用

  const clickedToHomeBtn = () => {
    navigate('/');
  };

  const publishNewThreadTitle = async () => {
    if (!formData.newThreadTitle) return; // タイトルが空の場合は何もしないでおk
    const newThread = { title: formData.newThreadTitle };

    try {
      const response = await fetch(`https://railway.bulletinboard.techtrain.dev/threads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newThread),
      });
      if (!response.ok) {
        throw new Error("スレッドの作成が失敗しました");
      }
      const data = await response.json();
      setThreads(prevThreads => [...prevThreads, data]);
      setFormData({ newThreadTitle: '' });
      navigate('/');
      alert("スレッドが作成されました");
    } catch (error) {
      console.error("エラー", error);
      alert(`スレッドの作成が失敗しました: ${error.message}`);
    }
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
          required
        />
        <button type="submit">送信する</button>
      </form>
    </div>
  );
}

export default Form;
