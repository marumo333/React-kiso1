import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function FormDetail() {
  const { thread_id } = useParams()
  const [postData, setPostData] = useState([]);
  const [formData, setFormData] = useState({ newReaction: '' }); // 反応のデータ
  const navigate = useNavigate(); // useNavigateフックを使用

  const clickedToHomeBtn = () => {
    navigate('/');
  };
  const getData = useCallback(async () => {
    try {
      const response = await fetch(`https://railway.bulletinboard.techtrain.dev/threads/${thread_id}/posts?`);
      if (!response.ok) {
        throw new Error("APIからのデータの取得に失敗しました。");
      }

      const data = await response.json();
      console.log(data);
      
      if (Array.isArray(data.posts)) {
        setPostData(data.posts); // 投稿データをセット
        alert("データの取得に成功しました"); // 成功メッセージを追加
      } 
    } catch (error) {
      console.error("エラー", error);
      alert(error.message); // ユーザーにエラーメッセージを表示
    }
  }, [thread_id]);

  useEffect(() => {
    getData();
  }, [getData]); // getDataを依存配列に追加

  const publishNewReaction = async () => {
    if (!formData.newReaction) return; // タイトルが空の場合は何もしないでおk
    const newReaction = { post: formData.newReaction };

    try {
      const response = await fetch(`https://railway.bulletinboard.techtrain.dev/threads/${thread_id}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newReaction),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`反応の投稿に失敗しました: ${errorText}`);
      }

      const data = await response.json();
      setPostData(prevData => [...prevData, data]); // 投稿データに反応を追加
      setFormData({ newReaction: '' });
      alert("反応が投稿されました");
    } catch (error) {
      console.error("エラー", error);
      alert(`反応の投稿が失敗しました: ${error.message}`);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    publishNewReaction();
  };

  return (
    <div>
      <div className='page1Container'>
        <h1>投稿詳細画面</h1>
        <button className='toHomeBtn' onClick={clickedToHomeBtn}>Homeに戻る</button>
      </div>
      <h2>投稿内容</h2>
      <ul>
                {postData.map((post, index) => (
                    <li key={index}>{post.post}</li> 
                ))}
            </ul>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="newReaction"
          value={formData.newReaction}
          onChange={handleInputChange}
          placeholder="反応を入力"
          required
        />
        <button type="submit">反応を送信</button>
      </form>
    </div>
  );
}

export default FormDetail;