export default function({ title, text, color='is-danger', onRemove = null, ...props }) {
  return (
    <article className={`message ${color}`} {...props}>
      <div className="message-header">
        <p>{title}</p>
        {
          onRemove &&
          <button className="delete" aria-label="delete" onClick={() => onRemove()}></button>
        }
      </div>
      <div className="message-body">
        {text}
      </div>
    </article>
  );
};