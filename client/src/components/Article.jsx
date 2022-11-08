function Article({ title, paragraph, color, onDelete }) {
  return (
    <article>
      <h2
        style={{
          color,
        }}
      >
        {title}
      </h2>
      <p className="text">{paragraph}</p>
      <button
        style={{
          color: "white",
          backgroundColor: "red",
          cursor: "pointer",
          padding: "4px 8px",
          borderRadius: "8px",
        }}
        onClick={onDelete}
      >
        Delete Article
      </button>
    </article>
  );
}

export default Article;
