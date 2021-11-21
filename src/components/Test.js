import { useState } from 'react';

export default function LikeDislike() {
  const [action, setAction] = useState();
  const [like, setLike] = useState(100);
  const [dislike, setDislike] = useState(25);

  const likeAction = () => {
    if (action === undefined) {
      setLike(like + 1);
      setAction('like');
    } else if (action === 'like') {
      setLike(like - 1);
      setAction(undefined);
    } else {
      setLike(like + 1);
      setDislike(dislike - 1);
      setAction('like');
    }
  };

  const dislikeAction = () => {
    if (action === undefined) {
      setDislike(dislike + 1);
      setAction('dislike');
    } else if (action === 'dislike') {
      setDislike(dislike - 1);
      setAction(undefined);
    } else {
      setDislike(dislike + 1);
      setLike(like - 1);
      setAction('dislike');
    }
  };
  return (
    <>
      <div>
        <h2>Like/Dislike</h2>
      </div>
      <style>{`
                    .like-button, .dislike-button {
                        font-size: 1rem;
                        padding: 5px 10px;
                        color:   #585858;
                    }

                    .liked, .disliked {
                        font-weight: bold;
                        color: #1565c0;
                    }
                `}</style>
      <div style={{ display: 'flex' }}>
        <button
          className={`like-button ${action === 'like' ? `liked` : null}`}
          onClick={likeAction}
        >
          Like | <span className={`likes-counter`}>{like}</span>
        </button>
        {
          " "
        }
        <button
          className={`dislike-button ${action === 'dislike' ? `disliked` : null}`}
          onClick={dislikeAction}
        >
          Dislike | <span className={`dislikes-counter`}>{dislike}</span>
        </button>
      </div>
    </>
  );
}
